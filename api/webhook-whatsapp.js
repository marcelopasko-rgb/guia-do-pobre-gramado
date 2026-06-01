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

    // A Kiwify usa "webhook_event_type" para vendas e "event" para abandono
    const evento = payload.webhook_event_type || payload.event;

    // Dados do cliente — estrutura diferente dependendo do evento
    const customer = payload.Customer || payload.customer || {};
    const nomeCompleto = customer.full_name || customer.name || customer.first_name || "";
    const primeiroNome = nomeCompleto.split(" ")[0] || "amigo(a)";
    const email = customer.email || null;
    const telefone = limparTelefone(customer.mobile || customer.phone);
    const produto = payload.Product?.product_name || null;
    const valor = payload.Commissions?.charge_amount ? Number(payload.Commissions.charge_amount) / 100 : null;
    const orderId = payload.order_id || payload.checkout_id || payload.id || null;
    const codigoPix = payload.pix_code || payload.payment?.pix_code || payload.payment?.pix_qr || null;

    // Link de abandono (vem direto como checkout_url)
    const linkAbandono = payload.checkout_url
      ? `${payload.checkout_url}?coupon=POBRE50`
      : null;

    let whatsappEnviado = false;
    let whatsappResposta = null;

    if (telefone) {
      if (evento === "order_approved") {
        // Mensagem 1: boas-vindas + link do app (1 de 3 variações sorteadas)
        const msg1 = escolherVariacao(variacoesBoasVindas)(primeiroNome);
        whatsappResposta = await enviarWhatsApp(telefone, msg1);
        whatsappEnviado = !whatsappResposta.error;

        // Aguarda um tempo aleatório entre 10 e 30 segundos (parece mais orgânico)
        await delay(delayAleatorio(10000, 30000));

        // Mensagem 2: link do grupo VIP com preview (1 de 3 variações sorteadas)
        const textoGrupo = escolherVariacao(variacoesGrupoVip)(primeiroNome);
        await enviarWhatsAppLink(telefone, textoGrupo);

      } else if (evento === "carrinho_abandonado" || evento === "cart_abandoned") {
        // Mensagem 1: cupom + link personalizado
        const msgAbandono = `Oi, ${primeiroNome}! 😊\n\nVi que você se interessou pelo aplicativo Guia do Pobre em Gramado, mas não finalizou a compra.\n\nQuero te dar uma condição especial: use o cupom *POBRE50* e garanta 50% de desconto! 🎉\n\n⚠️ Atenção: o cupom é válido por apenas 3 horas!\n\n👉 Acesse pelo seu link exclusivo:\n${linkAbandono || "https://pay.kiwify.com.br/fN5HZp2"}\n\nQualquer dúvida, é só chamar! 😊`;
        whatsappResposta = await enviarWhatsApp(telefone, msgAbandono);
        whatsappEnviado = !whatsappResposta.error;

        // Aguarda 5 segundos
        await delay(5000);

        // Mensagem 2: dica do contato
        await enviarWhatsApp(telefone, "Obs.: às vezes é necessário salvar meu contato para conseguir clicar no link.");

      } else {
        // Outros eventos
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
// Variações de mensagens (compra aprovada)
// Estruturas genuinamente diferentes para quebrar o
// padrão de repetição detectado como spam.
// =====================================================

const LINK_APP = "https://guia-do-pobre-gramado.vercel.app/";
const LINK_GRUPO = "https://chat.whatsapp.com/FWQr1VHGXMb52H69SXWzZq";

// 3 variações da mensagem de boas-vindas
const variacoesBoasVindas = [
  // Variação A — saudação, anúncio, link, instruções
  (nome) =>
    `Olá, ${nome}! 😊 Aqui é o Marcelo, do Guia do Pobre em Gramado.\n\nSua compra foi aprovada! 🎉\n\nAcesse seu app pelo link:\n${LINK_APP}\n\nPara fazer login, use o mesmo e-mail da compra. Se não conseguir clicar no link acima, salve meu número nos contatos e tente novamente.\n\nBoa viagem e aproveite os cupons para economizar! 🥰`,

  // Variação B — confirmação primeiro, login antes do link, fechamento curto
  (nome) =>
    `${nome}, deu tudo certo com seu pagamento! ✅\n\nSeja muito bem-vindo(a) ao Guia do Pobre em Gramado — quem fala aqui é o Marcelo. Seu acesso já está liberado: basta entrar com o mesmo e-mail que você usou na compra.\n\n👉 ${LINK_APP}\n\nDica: se o link não abrir de primeira, salva meu contato e tenta de novo.\n\nBora economizar em Gramado! 💚`,

  // Variação C — conversacional, frases curtas, link no meio
  (nome) =>
    `Oi, ${nome}! Aqui é o Marcelo do Guia do Pobre em Gramado. 🙌\n\nTô passando pra avisar que sua compra foi confirmada e seu app já está no ar:\n${LINK_APP}\n\nPra acessar, é só entrar com o e-mail da compra. Caso o link não abra, salva meu número e clica de novo que funciona certinho.\n\nAproveita bastante e boa viagem! 😄`,
];

// 3 variações da mensagem do Grupo VIP
const variacoesGrupoVip = [
  // Variação A
  (nome) =>
    `${nome}, tem mais uma coisa importante! 🎁\n\nVocê também ganhou acesso ao nosso *Grupo VIP* no WhatsApp. É lá que rolam as dicas exclusivas, promoções e novidades de Gramado em primeira mão.\n\nEntra agora:\n${LINK_GRUPO}\n\nTe espero lá! 😉`,

  // Variação B
  (nome) =>
    `Ah, ${nome}, não esquece disso! 👀\n\nJunto com o app você tem entrada no nosso *Grupo VIP* do WhatsApp — dicas que economizam de verdade, promoções e tudo o que acontece em Gramado em tempo real.\n\nSeu convite está aqui:\n${LINK_GRUPO}\n\nNos vemos por lá!`,

  // Variação C
  (nome) =>
    `E pra fechar, ${nome}: 💎\n\nToda semana a gente compartilha promoção, dica exclusiva e novidade de Gramado no *Grupo VIP*. Você já pode entrar, é só clicar:\n${LINK_GRUPO}\n\nBora pro grupo! 🤩`,
];

// =====================================================
// Mensagens por evento
// =====================================================

function montarMensagem(evento, nome, codigoPix) {
  switch (evento) {
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

// Retorna um valor aleatório (em ms) entre min e max, inclusive
function delayAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sorteia uma das variações de uma lista
function escolherVariacao(variacoes) {
  return variacoes[Math.floor(Math.random() * variacoes.length)];
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
        linkUrl: LINK_GRUPO,
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
