// /api/minhas-compras.js
// Consulta as compras de um usuário pelo email.
// Usado pelo app pra saber quais bônus mostrar liberados.
//
// Uso: GET /api/minhas-compras?email=fulano@exemplo.com
// Retorna: { email: "fulano@exemplo.com", compras: ["roteiro_pdf", "restaurantes_secretos"] }

export default async function handler(req, res) {
  // CORS — permite que o app (mesmo domínio) faça chamadas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Validar email
    const email = (req.query.email || '').toLowerCase().trim();

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // 2. Consultar Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[minhas-compras] Variáveis de ambiente faltando');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Busca todas as compras aprovadas desse email
    const url = `${supabaseUrl}/rest/v1/compras?email=eq.${encodeURIComponent(email)}&status=eq.aprovado&select=produto`;

    const dbRes = await fetch(url, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!dbRes.ok) {
      const errText = await dbRes.text();
      console.error('[minhas-compras] Erro Supabase:', dbRes.status, errText);
      return res.status(500).json({ error: 'Database error' });
    }

    const rows = await dbRes.json();

    // 3. Expandir "combo" pros 2 produtos individuais
    const produtosSet = new Set();
    for (const row of rows) {
      if (row.produto === 'combo') {
        produtosSet.add('roteiro_pdf');
        produtosSet.add('restaurantes_secretos');
      } else {
        produtosSet.add(row.produto);
      }
    }

    const compras = Array.from(produtosSet);

    // 4. Resposta
    return res.status(200).json({
      email,
      compras,
    });

  } catch (err) {
    console.error('[minhas-compras] Erro inesperado:', err);
    return res.status(500).json({ error: 'Internal error', message: err.message });
  }
}
