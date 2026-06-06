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

    // O abandono de carrinho tem payload DIFERENTE: não tem "webhook_event_type"
    // nem "event", os dados ficam dentro de "cart" e o evento é identificado
    // por cart.status === "abandoned".
    const ehAbandono = payload.cart?.status === "abandoned";
    const evento = ehAbandono
      ? "cart_abandoned"
      : payload.webhook_event_type || payload.event;

    // Fonte dos dados do cliente muda conforme o tipo de evento
    const fonte = ehAbandono ? payload.cart : payload.Customer || payload.customer || {};
    const nomeCompleto = fonte.full_name || fonte.name || fonte.first_name || "";
    const primeiroNome = nomeCompleto.split(" ")[0] || "amigo(a)";
    const email = fonte.email || null;
    const telefone = limparTelefone(fonte.mobile || fonte.phone);
    const produto = payload.Product?.product_name || payload.cart?.product_name || null;
    const valor = payload.Commissions?.charge_amount ? Number(payload.Commissions.charge_amount) / 100 : null;
    const orderId = payload.order_id || payload.checkout_id || payload.id || payload.cart?.id || null;
    const codigoPix = payload.pix_code || payload.payment?.pix_code || payload.payment?.pix_qr || null;

    // Link de recuperação: cart.checkout_link é só o slug (ex: "fN5HZp2"),
    // precisa virar URL completa com o cupom de 25% e os dados do cliente
    // pré-preenchidos (name, email, phone) — tudo codificado pra URL.
    const slugAbandono = payload.cart?.checkout_link || "fN5HZp2";
    const paramsAbandono = new URLSearchParams({ coupon: CUPOM_ABANDONO });
    if (nomeCompleto) paramsAbandono.set("name", nomeCompleto);
    if (email) paramsAbandono.set("email", email);
    if (telefone) paramsAbandono.set("phone", telefone);
    const linkAbandono = `https://pay.kiwify.com.br/${slugAbandono}?${paramsAbandono.toString()}`;

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
        // Mensagem 1: recuperação com cupom de 25% (1 de 5 variações sorteadas)
        const msgAbandono = escolherVariacao(variacoesAbandono)(primeiroNome, linkAbandono);
        whatsappResposta = await enviarWhatsApp(telefone, msgAbandono);
        whatsappEnviado = !whatsappResposta.error;

        // Aguarda um tempo aleatório entre 8 e 15 segundos
        await delay(delayAleatorio(8000, 15000));

        // Mensagem 2: dica do contato
        await enviarWhatsApp(telefone, "Obs.: às vezes é necessário salvar meu contato para conseguir clicar no link. 😉");

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

// Cupom usado na recuperação de carrinho abandonado (25% OFF)
const CUPOM_ABANDONO = "POBRE25";

// 7 variações da mensagem de boas-vindas
const variacoesBoasVindas = [
  // Variação A — saudação, anúncio, link, instruções
  (nome) =>
    `Olá, ${nome}! 😊 Aqui é o Marcelo, do Guia do Pobre em Gramado.

Sua compra foi aprovada! 🎉

Acesse seu app pelo link:
${LINK_APP}

Para fazer login, use o mesmo e-mail da compra. Se não conseguir clicar no link acima, salve meu número nos contatos e tente novamente.

Boa viagem e aproveite os cupons para economizar! 🥰`,

  // Variação B — confirmação primeiro, login antes do link, fechamento curto
  (nome) =>
    `${nome}, deu tudo certo com seu pagamento! ✅

Seja muito bem-vindo(a) ao Guia do Pobre em Gramado — quem fala aqui é o Marcelo. Seu acesso já está liberado: basta entrar com o mesmo e-mail que você usou na compra.

👉 ${LINK_APP}

Dica: se o link não abrir de primeira, salva meu contato e tenta de novo.

Bora economizar em Gramado! 💚`,

  // Variação C — conversacional, frases curtas, link no meio
  (nome) =>
    `Oi, ${nome}! Aqui é o Marcelo do Guia do Pobre em Gramado. 🙌

Tô passando pra avisar que sua compra foi confirmada e seu app já está no ar:
${LINK_APP}

Pra acessar, é só entrar com o e-mail da compra. Caso o link não abra, salva meu número e clica de novo que funciona certinho.

Aproveita bastante e boa viagem! 😄`,

  // Variação D — tom mais formal, poucos emojis
  (nome) =>
    `Olá, ${nome}. Sou o Marcelo, responsável pelo Guia do Pobre em Gramado.

Confirmo que seu pagamento foi aprovado e seu acesso já está disponível. Para entrar, utilize o mesmo e-mail informado na compra:

${LINK_APP}

Caso o link não abra ao toque, salve este contato e tente novamente. Qualquer dúvida, estou à disposição.

Desejo uma excelente viagem!`,

  // Variação E — entusiasmada, link logo no começo
  (nome) =>
    `${nome}, seja bem-vindo(a) ao Guia do Pobre em Gramado! 🎉

Seu acesso já está liberado, é só clicar aqui:
${LINK_APP}

Entra com o mesmo e-mail da compra que cai direto. Se o link não abrir, salva meu contato e tenta de novo.

Qualquer coisa me chama por aqui. Aproveita Gramado gastando pouco! 😍`,

  // Variação F — pessoal e calorosa
  (nome) =>
    `${nome}, que alegria ter você aqui! 🥰 É o Marcelo falando, do Guia do Pobre em Gramado.

Sua compra caiu certinho e já liberei tudo pra você. Pra abrir, use o e-mail da compra:
${LINK_APP}

Se por acaso o link travar, é só salvar meu número e clicar de novo.

Vai por mim: dá pra curtir Gramado MUITO sem estourar o orçamento. Boa viagem! 😊`,

  // Variação G — direta e enxuta
  (nome) =>
    `Oi ${nome}, é o Marcelo do Guia do Pobre em Gramado.

Compra aprovada! Seu app está aqui:
${LINK_APP}

Login com o e-mail da compra. Se o link não abrir, salva meu contato e tenta de novo.

Boa viagem! 🎉`,
];

// 7 variações da mensagem do Grupo VIP
const variacoesGrupoVip = [
  // Variação A
  (nome) =>
    `${nome}, tem mais uma coisa importante! 🎁

Você também ganhou acesso ao nosso *Grupo VIP* no WhatsApp. É lá que rolam as dicas exclusivas, promoções e novidades de Gramado em primeira mão.

Entra agora:
${LINK_GRUPO}

Te espero lá! 😉`,

  // Variação B
  (nome) =>
    `Ah, ${nome}, não esquece disso! 👀

Junto com o app você tem entrada no nosso *Grupo VIP* do WhatsApp — dicas que economizam de verdade, promoções e tudo o que acontece em Gramado em tempo real.

Seu convite está aqui:
${LINK_GRUPO}

Nos vemos por lá!`,

  // Variação C
  (nome) =>
    `E pra fechar, ${nome}: 💎

Toda semana a gente compartilha promoção, dica exclusiva e novidade de Gramado no *Grupo VIP*. Você já pode entrar, é só clicar:
${LINK_GRUPO}

Bora pro grupo! 🤩`,

  // Variação D — formal, poucos emojis
  (nome) =>
    `${nome}, um último aviso importante.

Sua compra também inclui acesso ao nosso Grupo VIP no WhatsApp, onde compartilhamos dicas exclusivas, promoções e novidades de Gramado em primeira mão.

Você pode entrar por aqui:
${LINK_GRUPO}

Será um prazer ter você no grupo.`,

  // Variação E — começa pelo benefício
  (nome) =>
    `Quer economizar ainda mais em Gramado, ${nome}? 🤑

No nosso *Grupo VIP* do WhatsApp saem promoções e dicas exclusivas que não vão pra mais ninguém. Seu acesso já está incluso:
${LINK_GRUPO}

Clica e entra, te espero lá!`,

  // Variação F — casual e curta
  (nome) =>
    `Ah ${nome}, entra no nosso *Grupo VIP*! 🙌

É onde rola promoção, dica e novidade de Gramado em tempo real.

${LINK_GRUPO}

Bora! 😄`,

  // Variação G — curiosidade / FOMO
  (nome) =>
    `${nome}, você não vai querer ficar de fora dessa. 👇

No *Grupo VIP* a galera recebe as melhores dicas e promoções de Gramado antes de todo mundo. E o seu acesso já está liberado:
${LINK_GRUPO}

Entra agora que tá começando! 🔥`,
];

// =====================================================
// Variações da mensagem de recuperação (carrinho abandonado)
// Cupom de 25% OFF válido por 3 horas. Todas usam o nome.
// =====================================================

const variacoesAbandono = [
  // Variacao A - identica ao formato pedido
  (nome, link) =>
    `Oi, ${nome}! 😊

Vi que você se interessou pelo *aplicativo Guia do Pobre em Gramado*, mas não finalizou a compra.

Quero te dar uma condição especial: use o cupom *${CUPOM_ABANDONO}* e garanta *25% de desconto*! 🎉

⚠️ Atenção: o cupom é válido por apenas *3 horas*!

👉 Acesse pelo seu link exclusivo:

${link}

Qualquer dúvida, é só chamar! 😊`,

  // Variacao B - urgencia
  (nome, link) =>
    `${nome}, seu desconto tá te esperando! ⏳

Você começou a garantir o *Guia do Pobre em Gramado*, mas não finalizou a compra.

Liberei o cupom *${CUPOM_ABANDONO}* com *25% de desconto* só pra você! 🎉

⚠️ Mas corre: vale só pelas próximas *3 horas*!

👉 Finalize pelo seu link exclusivo:

${link}

Qualquer dúvida, é só me chamar! 😊`,

  // Variacao C - conversacional
  (nome, link) =>
    `Oi, ${nome}! 🙌

Vi que você se interessou pelo *Guia do Pobre em Gramado*, mas a compra ficou pela metade.

Pra te ajudar a decidir, use o cupom *${CUPOM_ABANDONO}* e ganhe *25% de desconto*! 🎁

⚠️ Atenção: o cupom vale só por *3 horas*!

👉 É só finalizar por aqui:

${link}

Ficou alguma dúvida? Me chama! 😄`,

  // Variacao D - formal
  (nome, link) =>
    `Olá, ${nome}.

Notei que você iniciou a compra do *aplicativo Guia do Pobre em Gramado*, mas não a concluiu.

Para ajudar, use o cupom *${CUPOM_ABANDONO}* e garanta *25% de desconto*.

⚠️ O cupom é válido apenas pelas próximas *3 horas*.

👉 Você pode finalizar por este link:

${link}

Fico à disposição para qualquer dúvida.`,

  // Variacao E - curiosidade / FOMO
  (nome, link) =>
    `${nome}, você esqueceu algo! 👀

Sua compra do *Guia do Pobre em Gramado* ficou quase pronta.

Garanti *25% de desconto* pra você com o cupom *${CUPOM_ABANDONO}*! 🤑

⚠️ Atenção: ele some em *3 horas*!

👉 Finalize antes que acabe:

${link}

Qualquer dúvida, é só chamar! 😊`,
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
