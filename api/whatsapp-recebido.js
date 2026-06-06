// =====================================================
// Vercel API Route: /api/whatsapp-recebido
// Recebe mensagens via Z-API (on-message-received) e
// responde automaticamente APENAS os leads que chegam
// pelos anúncios (Click-to-WhatsApp), já com o nome.
// Guia do Pobre em Gramado - Marcelo
// =====================================================

// Frases que identificam a mensagem automática do anúncio.
// Se você mudar o texto do anúncio no Meta, adicione a nova frase aqui.
// A comparação ignora maiúsculas, acentos e pontuação.
const GATILHOS_ANUNCIO = [
  "tenho interesse",
  "mais informacoes",
  "quero saber mais",
  "gostaria de informacoes",
];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Webhook ativo");
  }

  try {
    const p = req.body || {};

    // ----- Guardas: ignora o que NÃO é lead de anúncio -----

    // 1. Ignora mensagens enviadas por você mesmo
    if (p.fromMe) return res.status(200).json({ ok: true, motivo: "fromMe" });

    // 2. Ignora grupos (não responde nos grupos de turistas)
    if (p.isGroup) return res.status(200).json({ ok: true, motivo: "grupo" });

    // 3. Ignora status / newsletter / outros tipos
    if (p.isStatusReply || p.isNewsletter) {
      return res.status(200).json({ ok: true, motivo: "status/newsletter" });
    }

    // ----- Extrai dados da mensagem -----
    const telefone = p.phone || null;
    const texto = p.text?.message || p.message || "";
    const nomeBruto = p.senderName || p.chatName || p.pushName || "";

    if (!telefone || !texto) {
      return res.status(200).json({ ok: true, motivo: "sem telefone ou texto" });
    }

    // 4. Só responde se a mensagem casar com um gatilho do anúncio
    if (!ehLeadDeAnuncio(texto)) {
      return res.status(200).json({ ok: true, motivo: "não é lead de anúncio" });
    }

    // 5. Só responde quem NUNCA falou comigo antes.
    // Registra o lead no Supabase de forma atômica: se já existia, não responde.
    const ehNovo = await registrarLeadSeNovo(telefone, nomeBruto);
    if (!ehNovo) {
      return res.status(200).json({ ok: true, motivo: "lead já atendido antes" });
    }

    // ----- Responde o lead -----
    const nome = nomeLimpo(nomeBruto) || "tudo bem";
    const resposta = escolherVariacao(variacoesBoasVindasLead)(nome);

    // atraso aleatório de 10 a 20 segundos (parece mais orgânico)
    await delay(delayAleatorio(10000, 20000));
    const r = await enviarWhatsApp(telefone, resposta);

    return res.status(200).json({ ok: true, respondido: !r.error });
  } catch (err) {
    console.error("[whatsapp-recebido] ERRO:", err.message);
    // Sempre devolve 200 pro Z-API não ficar reenviando
    return res.status(200).json({ ok: false, erro: err.message });
  }
};

// =====================================================
// Detecção do lead de anúncio
// =====================================================

function normalizar(txt) {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^\w\s]/g, " ")        // remove pontuação
    .replace(/\s+/g, " ")
    .trim();
}

function ehLeadDeAnuncio(texto) {
  const t = normalizar(texto);
  return GATILHOS_ANUNCIO.some((g) => t.includes(normalizar(g)));
}

// =====================================================
// Variações da resposta ao lead
// Estruturas diferentes pra não cair em padrão de spam.
// Cada uma faz UMA pergunta de qualificação.
// =====================================================

const variacoesBoasVindasLead = [
  (nome) =>
    `Oi, ${nome}! 😊 Que bom que chegou até aqui.

Aqui é o Marcelo, do Guia do Pobre em Gramado — ajudo casais e famílias a aproveitarem Gramado e Canela sem gastar uma fortuna.

Pra eu te ajudar melhor: você já tem data definida pra viagem ou ainda está no planejamento?`,

  (nome) =>
    `${nome}, seja bem-vindo(a)! 🙌 Quem fala é o Marcelo, do Guia do Pobre em Gramado.

A gente monta roteiros pra você curtir a Serra Gaúcha gastando pouco. 💚

Me conta uma coisa: sua viagem já tem data marcada ou você ainda está organizando?`,

  (nome) =>
    `Oi ${nome}! 😄 Aqui é o Marcelo, do Guia do Pobre em Gramado.

Fico feliz pelo seu interesse! Antes de te passar tudo, me ajuda com uma info rápida:

Você já sabe quando vai viajar pra Gramado, ou ainda está pesquisando?`,

  (nome) =>
    `${nome}, oi! 🥰 É o Marcelo, do Guia do Pobre em Gramado.

Posso te ajudar a montar um roteiro econômico pra Gramado e Canela. Pra começar do jeito certo:

Já tem data da viagem ou está só começando a planejar?`,

  (nome) =>
    `Olá, ${nome}! 😊 Aqui é o Marcelo, do Guia do Pobre em Gramado.

Que ótimo ter você por aqui! Pra eu entender como te ajudar melhor, me diz:

Sua viagem pra Gramado já tem data ou ainda está no papel?`,
];

// =====================================================
// Helpers
// =====================================================

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function delayAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escolherVariacao(variacoes) {
  return variacoes[Math.floor(Math.random() * variacoes.length)];
}

// Valida/normaliza um nome: descarta emoji, números longos e nomes muito curtos.
function nomeLimpo(rawName) {
  if (!rawName) return null;
  const nome = rawName.trim();
  const invalido = /[\u{1F000}-\u{1FFFF}]|\d{3,}|^.{1,2}$/u.test(nome);
  if (invalido) return null;
  const primeiro = nome.split(/\s+/)[0];
  return primeiro.charAt(0).toUpperCase() + primeiro.slice(1).toLowerCase();
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

// Registra o lead no Supabase. Retorna true se é NOVO (nunca falou comigo),
// false se já existia. Usa "ignore-duplicates" pra ser atômico e evitar corrida
// quando o WhatsApp manda a mesma mensagem em duplicidade.
async function registrarLeadSeNovo(telefone, nome) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/leads_atendidos`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        // ignore-duplicates: se o telefone já existe, não insere e não dá erro
        Prefer: "resolution=ignore-duplicates,return=representation",
      },
      body: JSON.stringify({ telefone, nome: nome || null }),
    });

    if (!resp.ok) {
      console.error("[leads] erro ao registrar:", await resp.text());
      // fail-open: na dúvida, melhor responder um lead novo do que perder venda
      return true;
    }

    const data = await resp.json();
    // array com 1 item = inseriu agora = é novo. array vazio = já existia.
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.error("[leads] falha:", err.message);
    return true; // fail-open
  }
}
