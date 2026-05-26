// =====================================================
// Vercel API Route: /api/webhook-whatsapp
// Recebe eventos da Kiwify, envia WhatsApp via Z-API
// e salva tudo no Supabase
// Guia do Pobre em Gramado - Marcelo
// =====================================================

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Webhook ativo");
  }

  try {
    const tokenRecebido = req.query.token;
    if (tokenRecebido !== process.env.KIWIFY_TOKEN) {
      return res.status(401).send("Token inválido");
    }

    const payload = req.body;
    const evento = payload.webhook_event_type;

    // Dados do cliente — vem de Customer ou cart dependendo do evento
    const customer = payload.Customer || payload.cart || {};
    const nomeCompleto = customer.full_name || customer.name || customer.first_name || "";
    const primeiroNome = nomeCompleto.split(" ")[0] || "amigo(a)";
    const email = customer.email || null;
    const telefone = limparTelefone(customer.mobile || customer.phone);
    const produto = payload.Product?.product_name || customer.product_name || null;
    const valor = payload.Commissions?.charge_amount ? Number(payload.Commissions.charge_amount) / 100 : null;
    const orderId = payload.order_id || payload.id || customer.id || null;
    const codigoPix = payload.pix_code || payload.payment?.pix_code || null;

    // Link personalizado de abandono com cupom
    const checkoutLink = customer.checkout_link || null;
    const linkAbandono = checkoutLink
      ? `https://pay.kiwify.com.br/${checkoutLink}?name=${encodeURIComponent(nomeCompleto)}&email=${encodeURIComponent(email || "")}&phone=${encodeURIComponent(telefone || "")}&coupon=POBRE50`
      : null;

    let whatsappEnviado = false;
    let whatsappResposta = null;

    if (telefone) {
      if (evento === "purchase_approved") {
        // Mensagem 1: boas-vindas + link do app
        const msg1 = `Olá, ${primeiroNome}! 😊 Aqui é o Marcelo, do Guia do Pobre em Gramado.\n\nSua compra foi aprovada! 🎉\n\nAcesse seu app pelo link:\nhttps://guia-do-pobre-gramado.vercel.app/\n\nPara fazer login, use o mesmo e-mail da compra. Se não conseguir clicar no link acima, salve meu número nos contatos e tente novamente.\n\nBoa viagem e aproveite os cupons para economizar! 🥰`;
        whatsappResposta = await enviarWhatsApp(telefone, msg1);
        whatsappEnviado = !whatsappResposta.error;

        // Aguarda 10 segundos
        await delay(10000);

        // Mensagem 2: link do grupo VIP com preview
        const textoGrupo = `${primeiroNome}, outra coisa importante!\n\nVocê também tem acesso ao nosso *Grupo VIP* no WhatsApp, onde são compartilhadas dicas exclusivas, promoções e novidades de Gramado em tempo real.\n\nEntre agora pelo link:\nhttps://chat.whatsapp.com/FWQr1VHGXMb52H69SXWzZq\n\nNos vemos lá!`;
        await enviarWhatsAppLink(telefone, textoGrupo);

      } else if (evento === "checkout_abandonment") {
        // Mensagem 1: cupom + link personalizado
        const msgAbandono = `Oi, ${primeiroNome}! 😊\n\nVi que você se interessou pelo aplicativo Guia do Pobre em Gramado, mas não finalizou a compra.\n\nQuero te dar uma condição especial: use o cupom *POBRE50* e garanta 50% de desconto! 🎉\n\n⚠️ Atenção: o cupom é válido por apenas 3 horas!\n\n👉 Acesse pelo seu link exclusivo:\n${linkAbandono || "https://pay.kiwify.com.br/fN5HZp2"}\n\nQualquer dúvida, é só chamar! 😊`;
        whatsappResposta = await enviarWhatsApp(telefone, msgAbandono);
        whatsappEnviado = !whatsappResposta.error;

        // Aguarda 5 segundos
        await delay(5000);

        // Mensagem 2: dica do contato
        await enviarWhatsApp(telefone, "Obs.: às vezes é necessário salvar meu contato para conseguir clicar no link.");

      } else {
        const mensagem = montarMensagem(evento, primeiroNome, codigoPix, linkAbandono);
        if (mensagem) {
          whatsappResposta = await enviarWhatsApp(telefone, mensagem);
          whatsappEnviado = !whatsappResposta.error;
        }
      }
    }

    await salvarSupabase({
      evento,
      order_id: orderId,
      nome: nomeCompleto,
      email,
      telefone,
      produto,
      valor,
      codigo_pix: codigoPix,
      whatsapp_enviado: whatsappEnviado,
      whatsapp_resposta: whatsappResposta,
      payload_completo: payload,
    });

    return res.status(200).json({ ok: true, evento, whatsapp_enviado: whatsappEnviado });
  } catch (err) {
    console.error("[webhook] ERRO:", err.message);
    return res.status(500).json({ ok: false, erro: err.message });
  }
};

// =====================================================
// Mensagens por evento
// =====================================================

function montarMensagem(evento, nome, codigoPix, linkAbandono) {
  switch (evento) {
    case "refund":
    case "chargeback":
      return `Olá ${nome}, aqui é o Marcelo do Guia do Pobre em Gramado.\n\nIdentifiquei que sua compra foi reembolsada e seu acesso ao guia foi removido.\n\nSem problema nenhum, faz parte. Mas se puder me contar rapidamente o que não atendeu sua expectativa, vou levar a sério e usar pra melhorar o produto. Seu feedback vale muito.\n\nSe foi algum engano ou problema técnico que dá pra resolver, também me avisa.\n\nObrigado!`;

    default:
      return null;
  }
}

// =====================================================
// Helpers
// =====================================================

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function limparTelefone(tel) {
  if (!tel) return null;
  let n = tel.replace(/\D/g, "");
  if (!n.startsWith("55")) n = "55" + n;
  return n;
}

async function enviarWhatsApp(telefone, mensagem) {
  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE}/token/${process.env.ZAPI_TOKEN}/send-text`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Token": process.env.ZAPI_CLIENT_TOKEN,
      },
      body: JSON.stringify({ phone: telefone, message: mensagem }),
    });
    return await resp.json();
  } catch (err) {
    return { error: err.message };
  }
}

async function enviarWhatsAppLink(telefone, mensagem) {
  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE}/token/${process.env.ZAPI_TOKEN}/send-link`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Token": process.env.ZAPI_CLIENT_TOKEN,
      },
      body: JSON.stringify({
        phone: telefone,
        message: mensagem,
        image: "https://guia-do-pobre-gramado.vercel.app/icone_512.png",
        linkUrl: "https://chat.whatsapp.com/FWQr1VHGXMb52H69SXWzZq",
        title: "Grupo VIP - Guia do Pobre em Gramado",
        linkDescription: "Dicas exclusivas, promoções e novidades de Gramado em tempo real.",
      }),
    });
    return await resp.json();
  } catch (err) {
    return { error: err.message };
  }
}

async function salvarSupabase(dados) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/whatsapp_notificacoes`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(dados),
    });

    if (!resp.ok) {
      const erro = await resp.text();
      console.error("[supabase] Erro:", erro);
    }
  } catch (err) {
    console.error("[supabase] Falha:", err.message);
  }
}
