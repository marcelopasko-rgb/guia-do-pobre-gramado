// /api/kiwify-webhook.js
// Recebe notificações de compra do Kiwify e salva no Supabase.
// Configurado no painel da Kiwify em: Apps → Webhooks
//
// Variáveis de ambiente necessárias (Vercel → Settings → Environment Variables):
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_KEY
//   - KIWIFY_WEBHOOK_TOKEN
//   - KIWIFY_PRODUCT_ROTEIRO_PDF    (preenchido na Etapa 7)
//   - KIWIFY_PRODUCT_RESTAURANTES   (preenchido na Etapa 7)
//   - KIWIFY_PRODUCT_COMBO          (preenchido na Etapa 7)

export default async function handler(req, res) {
  // 1. Só aceita POST (Kiwify sempre manda POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Validar o token do Kiwify (segurança)
    // O Kiwify manda o token como query string ?token=XXX
    const tokenRecebido = req.query.token;
    const tokenEsperado = process.env.KIWIFY_WEBHOOK_TOKEN;

    if (!tokenEsperado) {
      console.error('[kiwify-webhook] KIWIFY_WEBHOOK_TOKEN não configurado');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    if (tokenRecebido !== tokenEsperado) {
      console.warn('[kiwify-webhook] Token inválido:', tokenRecebido);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 3. Pegar dados do body
    const body = req.body;
    console.log('[kiwify-webhook] Evento recebido:', body?.webhook_event_type, body?.order_id);

    // 4. Só processar evento de compra aprovada
    // Outros eventos (boleto_gerado, pix_gerado, etc) ignoramos
    const eventType = body?.webhook_event_type || body?.event;
    if (eventType !== 'order_approved' && eventType !== 'compra_aprovada') {
      console.log('[kiwify-webhook] Evento ignorado:', eventType);
      return res.status(200).json({ ok: true, ignored: eventType });
    }

    // 5. Extrair dados que interessam
    const email = (body?.Customer?.email || body?.customer?.email || body?.email || '').toLowerCase().trim();
    const orderId = body?.order_id || body?.id;
    const productId = body?.Product?.product_id || body?.product?.id || body?.product_id;
    const valor = parseFloat(body?.Commissions?.charge_amount || body?.charge_amount || body?.price || 0) / 100;

    if (!email || !orderId || !productId) {
      console.error('[kiwify-webhook] Dados faltando:', { email, orderId, productId });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 6. Mapear product_id do Kiwify pro nosso nome interno
    const mapaProdutos = {
      [process.env.KIWIFY_PRODUCT_ROTEIRO_PDF]: 'roteiro_pdf',
      [process.env.KIWIFY_PRODUCT_RESTAURANTES]: 'restaurantes_secretos',
      [process.env.KIWIFY_PRODUCT_COMBO]: 'combo',
    };

    const produto = mapaProdutos[productId];

    if (!produto) {
      console.error('[kiwify-webhook] Product ID desconhecido:', productId);
      return res.status(400).json({ error: 'Unknown product', productId });
    }

    // 7. Salvar no Supabase (com tratamento de duplicado)
    // Se for combo, gravamos 1 linha como "combo" - o endpoint /api/minhas-compras
    // expande pros 2 produtos individuais quando consulta.
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/compras`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=ignore-duplicates',
      },
      body: JSON.stringify({
        email,
        produto,
        kiwify_order_id: orderId,
        valor,
        status: 'aprovado',
      }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      // Se for duplicado (constraint unique), tudo bem - ignora
      if (insertRes.status === 409 || errText.includes('duplicate')) {
        console.log('[kiwify-webhook] Compra duplicada ignorada:', orderId);
        return res.status(200).json({ ok: true, duplicate: true });
      }
      console.error('[kiwify-webhook] Erro no Supabase:', insertRes.status, errText);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('[kiwify-webhook] Compra salva:', { email, produto, orderId });
    return res.status(200).json({ ok: true, email, produto });

  } catch (err) {
    console.error('[kiwify-webhook] Erro inesperado:', err);
    return res.status(500).json({ error: 'Internal error', message: err.message });
  }
}
