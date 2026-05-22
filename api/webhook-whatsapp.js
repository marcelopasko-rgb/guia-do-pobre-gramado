// =====================================================
// Vercel API Route: /api/webhook-whatsapp
// Recebe eventos da Kiwify, envia WhatsApp via Z-API
// e salva tudo no Supabase
// Guia do Pobre em Gramado - Marcelo
// =====================================================

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(200).send("Webhook ativo");
  }

  try {
    // 1. Valida o token de segurança
    const tokenRecebido = req.query.token;
    if (tokenRecebido !== process.env.KIWIFY_TOKEN) {
      return res.status(401).send("Token inválido");
    }

    // 2. Lê o payload
    const payload = req.body;
    const evento = payload.webhook_event_type;

    // 3. Extrai dados do cliente
    const nomeCompleto = payload.Customer?.full_name || payload.Customer?.first_name || "";
    const primeiroNome = nomeCompleto.split(" ")[0] || "amigo(a)";
    const email = payload.Customer?.email || null;
    const telefone = limparTelefone(payload.Customer?.mobile);
    const produto = payload.Product?.product_name || null;
    const valor = payload.Commissions?.charge_amount ? Number(payload.Commissions.charge_amount) / 100 : null;
    const orderId = payload.order_id || payload.id || null;
    const codigoPix = payload.pix_code || payload.payment?.pix_code || null;

    // 4. Monta mensagem conforme o evento
    const mensagem = montarMensagem(evento, primeiroNome, codigoPix);

    // 5. Envia WhatsApp (se tem telefone e mensagem)
    let whatsappEnviado = false;
    let whatsappResposta = null;

    if (telefone && mensagem) {
      whatsappResposta = await enviarWhatsApp(telefone, mensagem);
      whatsappEnviado = !whatsappResposta.error;
    }

    // 6. Salva no Supabase (sempre, mesmo se não enviou WhatsApp)
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

    return res.status(200).json({
      ok: true,
      evento,
      whatsapp_enviado: whatsappEnviado,
    });
  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.status(500).json({ ok: false, erro: err.message });
  }
}

// =====================================================
// Mensagens por evento
// =====================================================

function montarMensagem(evento, nome, codigoPix) {
  switch (evento) {
    case "compra_aprovada":
      return `Olá, ${nome}! 😊 Aqui é o Marcelo, do Guia do Pobre em Gramado.

Sua compra foi aprovada! 🎉

Acesse seu app pelo link:
https://guia-do-pobre-gramado.vercel.app/

Para fazer login, use o mesmo e-mail da compra. Se não conseguir clicar no link acima, salve meu número nos contatos e tente novamente.

Boa viagem e aproveite os cupons para economizar! 🥰`;

    case "carrinho_abandonado":
      return `Oi ${nome}, aqui é o Marcelo do Guia do Pobre em Gramado.

Vi que você chegou no checkout do guia mas não finalizou. Aconteceu alguma coisa? Foi dúvida sobre o conteúdo, problema no pagamento, ou só decidiu deixar pra depois mesmo?

Tô aqui se quiser tirar qualquer dúvida antes de decidir. Sem pressão.`;

    case "pix_gerado":
      return `Oi ${nome}, Marcelo aqui do Guia do Pobre em Gramado.

Seu PIX foi gerado e tá esperando pagamento.

Só um lembrete: PIX da Kiwify expira em algumas horas, então se ainda tem interesse, recomendo finalizar agora pra não precisar gerar de novo.

Assim que o pagamento cair, o acesso é liberado automaticamente no seu e-mail.

${codigoPix ? `Código PIX:\n${codigoPix}\n\n` : ""}Qualquer problema pra pagar, me chama.`;

    case "compra_reembolsada":
    case "chargeback":
      return `Olá ${nome}, aqui é o Marcelo do Guia do Pobre em Gramado.

Identifiquei que sua compra foi reembolsada e seu acesso ao guia foi removido.

Sem problema nenhum, faz parte. Mas se puder me contar rapidamente o que não atendeu sua expectativa, vou levar a sério e usar pra melhorar o produto. Seu feedback vale muito.

Se foi algum engano ou problema técnico que dá pra resolver, também me avisa.

Obrigado!`;

    default:
      return null; // evento que não queremos tratar
  }
}

// =====================================================
// Helpers
// =====================================================

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
      body: JSON.stringify({
        phone: telefone,
        message: mensagem,
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
      console.error("Erro Supabase:", erro);
    }
  } catch (err) {
    console.error("Falha ao salvar no Supabase:", err);
  }
}
