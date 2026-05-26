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

    const nomeCompleto = payload.Customer?.full_name || payload.Customer?.first_name || "";
    const primeiroNome = nomeCompleto.split(" ")[0] || "amigo(a)";
    const email = payload.Customer?.email || null;
    const telefone = limparTelefone(payload.Customer?.mobile);
    const produto = payload.Product?.product_name || null;
    const valor = payload.Commissions?.charge_amount ? Number(payload.Commissions.charge_amount) / 100 : null;
    const orderId = payload.order_id || payload.id || null;
    const codigoPix = payload.pix_code || payload.payment?.pix_code || null;

    let whatsappEnviado = false;
    let whatsappResposta = null;

    if (telefone) {
      if (evento === "order_approved") {
        // Mensagem 1: boas-vindas + link do app
        const msg1 = `Olá, ${primeiroNome}! 😊 Aqui é o Marcelo, do Guia do Pobre em Gramado.\n\nSua compra foi aprovada! 🎉\n\nAcesse seu app pelo link:\nhttps://guia-do-pobre-gramado.vercel.app/\n\nPara fazer login, use o mesmo e-mail da compra. Se não conseguir clicar no link acima, salve meu número nos contatos e tente novamente.\n\nBoa viagem e aproveite os cupons para economizar! 🥰`;
        whatsappResposta = await enviarWhatsApp(telefone, msg1);
        whatsappEnviado = !whatsappResposta.error;

        // Aguarda 10 segundos
        await delay(10000);

        // Mensagem 2: link do grupo VIP com preview
        const textoGrupo = `${primeiroNome}, outra coisa importante!\n\nVocê também tem acesso ao nosso *Grupo VIP* no WhatsApp, onde são compartilhadas dicas exclusivas, promoções e novidades de Gramado em tempo real.\n\nEntre agora pelo link:\nhttps://chat.whatsapp.com/FWQr1VHGXMb52H69SXWzZq\n\nNos vemos lá!`;
        await enviarWhatsAppLink(telefone, textoGrupo);

      } else {
        // Outros eventos: envia mensagem única
        const mensagem = montarMensagem(evento, primeiroNome, codigoPix);
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

function montarMensagem(evento, nome, codigoPix) {
  switch (evento) {
    case "abandoned_cart":
      return `Oi ${nome}, aqui é o Marcelo do Guia do Pobre em Gramado.\n\nVi que você chegou no checkout do guia mas não finalizou. Aconteceu alguma coisa? Foi dúvida sobre o conteúdo, problema no pagamento, ou só decidiu deixar pra depois mesmo?\n\nTô aqui se quiser tirar qualquer dúvida antes de decidir.`;

    case "waiting_payment":
      return `Oi ${nome}, Marcelo aqui do Guia do Pobre em Gramado.\n\nSeu PIX foi gerado e tá esperando pagamento.\n\nSó um lembrete: PIX da Kiwify expira em algumas horas, então se ainda tem interesse, recomendo finalizar agora pra não precisar gerar de novo.\n\nAssim que o pagamento cair, o acesso é liberado automaticamente no seu e-mail.\n\n${codigoPix ? `Código PIX:\n${codigoPix}\n\n` : ""}Qualquer problema pra pagar, me chama.`;

    case "refunded":
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

// Mensagem simples
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

// Mensagem com link preview (grupo VIP)
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
