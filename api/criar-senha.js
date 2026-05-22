// /api/criar-senha.js
// Cria/atualiza a senha do usuário no Supabase Auth.
//
// Fluxo:
//   1. Recebe { email, senha } via POST
//   2. Busca o usuário no auth.users (com fallback de paginação)
//   3. Se existe → updateUserById com a nova senha
//   4. Se NÃO existe → 404 (não criamos do nada, é segurança)
//
// Variáveis de ambiente:
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const email = (body?.email || '').toLowerCase().trim();
    const senha = body?.senha || '';

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (!senha || senha.length < 6) {
      return res.status(400).json({ error: 'Senha precisa de no mínimo 6 caracteres' });
    }
    if (senha.length > 72) {
      return res.status(400).json({ error: 'Senha muito longa (máx. 72 caracteres)' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[criar-senha] Faltam env vars');
      return res.status(500).json({ error: 'Servidor mal configurado' });
    }

    const user = await buscarUsuarioPorEmail(supabaseUrl, supabaseKey, email);

    if (!user) {
      return res.status(404).json({
        error: 'Email não encontrado. Verifique se é o mesmo da sua compra na Kiwify.'
      });
    }

    // Atualiza senha do usuário existente
    const updateRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${user.id}`,
      {
        method: 'PUT',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: senha,
          email_confirm: true,
        }),
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error('[criar-senha] Erro ao atualizar senha:', updateRes.status, errText);
      return res.status(500).json({ error: 'Erro ao salvar senha. Tente de novo.' });
    }

    console.log('[criar-senha] Senha definida para:', email);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[criar-senha] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno', message: err.message });
  }
}

/**
 * Busca usuário pelo email com fallback de paginação.
 * Idêntica à de checar-acesso.js — copiada para manter cada endpoint
 * autocontido (Vercel serverless não compartilha facilmente entre files).
 */
async function buscarUsuarioPorEmail(supabaseUrl, supabaseKey, email) {
  const baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  };

  try {
    const filtroRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      { headers: baseHeaders }
    );

    if (filtroRes.ok) {
      const data = await filtroRes.json();
      const users = data?.users || [];
      const match = users.find(u => (u.email || '').toLowerCase() === email);
      if (match) return match;
    }
  } catch (e) {
    console.warn('[criar-senha] Erro no filtro server-side:', e.message);
  }

  const PER_PAGE = 1000;
  const MAX_PAGES = 5;

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const pageRes = await fetch(
        `${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=${PER_PAGE}`,
        { headers: baseHeaders }
      );

      if (!pageRes.ok) break;

      const data = await pageRes.json();
      const users = data?.users || [];

      const match = users.find(u => (u.email || '').toLowerCase() === email);
      if (match) return match;

      if (users.length < PER_PAGE) break;
    } catch (e) {
      console.warn('[criar-senha] Erro na página', page, ':', e.message);
      break;
    }
  }

  return null;
}
