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

    const payload = req.body || {};

    // DICA DE DEBUG: deixe esta linha ligada até confirmar que está funcionando.
    // Ela mostra o payload cru nos logs da Vercel, revelando ONDE a Kiwify
    // realmente põe telefone/nome no evento de carrinho abandonado.
    console.log("[webhook] payload recebido:", JSON.stringify(payload));

    // --- Detecção de evento ---
    // O tipo de evento EXPLÍCITO tem prioridade ABSOLUTA. A compra aprovada
    // chega com webhook_event_type = "order_approved".
    // IMPORTANTE: a Kiwify pode mandar o payload aninhado dentro de "order"
    // (ex.: payload.order.webhook_event_type) OU achatado no nível raiz.
    // Tratamos os dois casos para não quebrar a extração.
    const ordem = payload.order || payload;

    const tipoExplicito =
      payload.webhook_event_type || ordem.webhook_event_type || payload.event || null;

    const ehAbandono =
      !tipoExplicito &&
      (payload.status === "abandoned" ||
        payload.cart?.status === "abandoned" ||
        ordem.status === "abandoned");

    const evento = ehAbandono ? "carrinho_abandonado" : tipoExplicito;

    // --- Extração de dados do cliente (robusta) ---
    // NÃO assumimos onde os dados estão. Procuramos em todas as fontes possíveis
    // (raiz, order, cart, Customer aninhado etc.) e pegamos a 1ª que tiver.
    const fontes = [
      payload,
      ordem,
      payload.cart,
      payload.Customer,
      ordem.Customer,
      payload.customer,
      ordem.customer,
    ].filter(Boolean);
    const pega = (...chaves) => {
      for (const f of fontes) {
        for (const k of chaves) {
          if (f && f[k]) return f[k];
        }
      }
      return null;
    };

    const nomeCompleto = pega("full_name", "name", "first_name", "nome") || "";
    const primeiroNome = nomeCompleto.split(" ")[0] || "amigo(a)";
    const email = pega("email");
    const telefone = limparTelefone(pega("mobile", "phone", "phone_number", "telefone", "cellphone"));
    const produto = pega("product_name") || ordem.Product?.product_name || null;
    const comissoes = ordem.Commissions || payload.Commissions || null;
    const valor = comissoes?.charge_amount ? Number(comissoes.charge_amount) / 100 : null;
    const orderId = pega("order_id", "checkout_id", "id") || payload.cart?.id || null;
    const codigoPix =
      pega("pix_code") || payload.payment?.pix_code || payload.payment?.pix_qr || null;

    // Chave de deduplicação: App + order bumps disparam vários "order_approved"
    // com order_id DIFERENTE, mas com o MESMO email e MESMA approved_date.
    // Essa chave é idêntica nos eventos da mesma compra, então serve de trava.
    const dataAprovacao = pega("approved_date", "created_at") || new Date().toISOString().slice(0, 10);
    const chaveDedup = `${email || telefone || "sem-id"}_${dataAprovacao}`.trim();

    // Link de recuperação: checkout_link costuma ser só o slug (ex: "fN5HZp2"),
    // precisa virar URL completa com o cupom de 25% e os dados do cliente
    // pré-preenchidos (name, email, phone) — tudo codificado pra URL.
    const slugAbandono = pega("checkout_link") || "fN5HZp2";
    const paramsAbandono = new URLSearchParams({ coupon: CUPOM_ABANDONO });
    if (nomeCompleto) paramsAbandono.set("name", nomeCompleto);
    if (email) paramsAbandono.set("email", email);
    if (telefone) paramsAbandono.set("phone", telefone);
    const linkAbandono = `https://pay.kiwify.com.br/${slugAbandono}?${paramsAbandono.toString()}`;

    let whatsappEnviado = false;
    let whatsappResposta = null;

    if (telefone) {
      if (evento === "order_approved") {
        // Deduplicação ATÔMICA contra order bump.
        // A Kiwify dispara um "order_approved" para CADA produto comprado
        // (app + order bumps), todos com o mesmo email/horário mas order_id
        // diferente. Reservamos a chave no banco: o 1º evento cria o registro
        // e envia; os outros recebem conflito (409) do Postgres e são pulados.
        // Isso elimina a race condition (não há janela entre "consultar" e "salvar").
        const reservou = await reservarEnvio(chaveDedup);

        if (!reservou) {
          console.log(`[webhook] duplicado (order bump) para ${email} — mensagem NÃO enviada.`);
          await salvarSupabase({
            evento: "order_bump_ignorado",
            order_id: orderId,
            nome: nomeCompleto,
            email,
            telefone,
            produto,
            valor,
            codigo_pix: codigoPix,
            whatsapp_enviado: false,
            whatsapp_resposta: { skipped: "order_bump_duplicado" },
            payload_completo: payload,
          });
          return res.status(200).json({ ok: true, evento: "order_bump_ignorado", whatsapp_enviado: false });
        }

        // Primeiro evento da compra — envia normalmente.
        // Mensagem 1: boas-vindas + app + grupo VIP (com preview do app)
        const msg1 = montarMensagemBoasVindas(primeiroNome);
        whatsappResposta = await enviarWhatsAppLink(telefone, msg1);
        whatsappEnviado = !whatsappResposta.error;

        // Aguarda um tempo aleatório entre 10 e 30 segundos (parece mais orgânico)
        await delay(delayAleatorio(10000, 30000));

        // Mensagem 2: serviços adicionais que o Marcelo oferece
        const msg2 = montarMensagemServicos(primeiroNome);
        await enviarWhatsApp(telefone, msg2);

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

      } else if (evento === "carrinho_abandonado" || evento === "cart_abandoned") {
        // Só envia o abandono para quem NUNCA conversou no WhatsApp.
        // Quem já trocou mensagem com você (contato existente) é pulado.
        const conversou = await jaConversou(telefone);

        if (conversou) {
          console.log(`[webhook] ${telefone} já tem conversa — abandono NÃO enviado.`);
          whatsappEnviado = false;
          whatsappResposta = { skipped: "contato_existente" };
        } else {
          // Mensagem 1: recuperação com cupom de 25% (1 de 5 variações sorteadas)
          const msgAbandono = escolherVariacao(variacoesAbandono)(primeiroNome, linkAbandono);
          whatsappResposta = await enviarWhatsApp(telefone, msgAbandono);
          whatsappEnviado = !whatsappResposta.error;

          // Aguarda um tempo aleatório entre 8 e 15 segundos
          await delay(delayAleatorio(8000, 15000));

          // Mensagem 2: dica do contato
          await enviarWhatsApp(telefone, "Obs.: às vezes é necessário salvar meu contato para conseguir clicar no link. 😉");
        }

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
      // Este salvarSupabase cobre apenas carrinho_abandonado e outros eventos.
      // O order_approved já retornou mais acima após salvar e atualizar o próprio registro.
      evento: evento || "desconhecido",
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
// Configuração
// =====================================================

const LINK_APP = "https://guia-do-pobre-gramado.vercel.app/";
const LINK_GRUPO = "https://chat.whatsapp.com/FWQr1VHGXMb52H69SXWzZq";

// Cupom usado na recuperação de carrinho abandonado (25% OFF)
const CUPOM_ABANDONO = "POBRE25";

// =====================================================
// Mensagens de compra aprovada (texto único, sem variações)
// =====================================================

// Mensagem 1 — boas-vindas + app + Grupo VIP (enviada com preview do app)
function montarMensagemBoasVindas(nome) {
  return `Olá, ${nome}! 😊 Aqui é o Marcelo, do Guia do Pobre em Gramado.

Sua compra foi aprovada!

*Link do Aplicativo*: ${LINK_APP}

(Para fazer login, use o mesmo e-mail da compra)

Acesse também ao *Grupo VIP*! Nele enviamos *cupons exclusivos*, *dicas* e *ofertas* que você não vai encontrar em outro lugar!

*Link Grupo VIP*: ${LINK_GRUPO}`;
}

// Mensagem 2 — serviços adicionais
function montarMensagemServicos(nome) {
  return `Além disso, ${nome}, caso precise de ajuda com:

· *Transfer entre o Aeroporto → Gramado/Canela*
· *Aluguel de Roupa*
· *Indicação de Hospedagem*
· *Cupons de Desconto*
· *Dicas*

Estou à disposição para te ajudar! 😊`;
}

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

// Busca o metadata do chat tentando os dois caminhos possíveis, porque a
// documentação da Z-API é inconsistente entre /chats/{phone} e /chat/{phone}.
// Retorna o objeto de metadata, ou undefined se nenhum caminho responder.
async function buscarMetadataChat(telefone) {
  const base = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE}/token/${process.env.ZAPI_TOKEN}`;
  const caminhos = [`${base}/chats/${telefone}`, `${base}/chat/${telefone}`];

  for (const url of caminhos) {
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: { "Client-Token": process.env.ZAPI_CLIENT_TOKEN },
      });
      const data = await resp.json().catch(() => null);

      // Erro de rota (endpoint errado) → tenta o próximo caminho
      if (data && data.error === "NOT_FOUND") continue;
      if (!resp.ok) continue;

      return data; // resposta válida (objeto de metadata, ou vazio se não há chat)
    } catch (_) {
      // tenta o próximo caminho
    }
  }
  return undefined; // nenhum caminho respondeu
}

// Reserva atômica de envio. Tenta inserir a chave na tabela whatsapp_dedup.
// - Se inserir (HTTP 201): é o PRIMEIRO evento da compra → retorna true (envia).
// - Se der conflito (HTTP 409): a chave já existe (order bump) → retorna false (pula).
// O Postgres garante a atomicidade pela PRIMARY KEY, então não há race condition
// mesmo que os 3 eventos cheguem no mesmo instante.
//
// FALHA SEGURA: se a tabela não existir ou der erro de rede, retorna true (envia).
// Melhor mandar duplicado do que travar todos os envios. Por isso é OBRIGATÓRIO
// criar a tabela whatsapp_dedup no Supabase (SQL no final deste arquivo).
async function reservarEnvio(chave) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/whatsapp_dedup`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ chave }),
    });

    if (resp.status === 201) return true;  // reservou (primeiro evento)
    if (resp.status === 409) return false; // duplicado (order bump)

    // Qualquer outro status (tabela inexistente, erro do PostgREST etc.):
    // loga e deixa passar, para não bloquear envios por engano de config.
    const detalhe = await resp.text().catch(() => "");
    console.warn(`[reservarEnvio] status inesperado ${resp.status}: ${detalhe}`);
    return true;
  } catch (err) {
    console.warn("[reservarEnvio] erro na reserva:", err.message);
    return true;
  }
}

// Verifica se já existe uma conversa com esse número no WhatsApp.
// Retorna true se a pessoa já trocou mensagens com você (chat existente,
// com lastMessageTime — conta mensagem em qualquer direção, inclusive as
// que você enviou), e false se for um contato totalmente novo.
//
// FALHA SEGURA: se a checagem não conseguir confirmar (Z-API fora do ar,
// ambos os caminhos com erro), retorna TRUE = "já conversou" = NÃO envia.
// Isso respeita seu pedido de só falar com contatos novos. Se preferir o
// contrário (na dúvida, ENVIAR), troque o "return true" abaixo por "return false".
async function jaConversou(telefone) {
  const data = await buscarMetadataChat(telefone);
  console.log(`[jaConversou] metadata de ${telefone}:`, JSON.stringify(data));

  if (data === undefined) {
    console.warn(`[jaConversou] não foi possível confirmar ${telefone} — pulando o envio por segurança.`);
    return true;
  }

  // Conversa existente = tem histórico (lastMessageTime preenchido)
  return !!(data && data.lastMessageTime);
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

// Mensagem com link preview — agora aponta para o APP (não mais grupo VIP),
// que é o card que aparece no topo da mensagem de boas-vindas.
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
        linkUrl: LINK_APP,
        title: "Guia do Pobre em Gramado",
        linkDescription: "guia-do-pobre-gramado.vercel.app",
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

// =====================================================
// ⚠️ OBRIGATÓRIO: rode este SQL no Supabase (SQL Editor)
// antes de subir. Sem essa tabela a deduplicação não funciona
// e as mensagens vão continuar duplicando.
// =====================================================
//
// create table if not exists whatsapp_dedup (
//   chave text primary key,
//   criado_em timestamptz default now()
// );
//
// (opcional) limpeza automática de chaves antigas, se quiser:
// não é necessário — a tabela só cresce devagar (1 linha por compra).
// =====================================================
