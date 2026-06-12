// /api/criar-senha.js
// Define/atualiza a senha do usuário no Supabase Auth.
// Também marca `senha_definida = true` em `perfis_usuarios` (fonte da verdade).
//
// Fluxo:
//   1. Recebe { email, senha } via POST
//   2. Busca o usuário no auth.users
//   3. Se existe: atualiza senha + marca perfis_usuarios.senha_definida = true
//   4. Se NÃO existe: 404
//
// Variáveis de ambiente:
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_KEY

import corsHelper from './_cors.js';
const { aplicarCors } = corsHelper;

export default async function handler(req, res) {
  if (aplicarCors(req, res, { methods: 'POST, OPTIONS' })) return;
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

    // 1. Buscar usuário
    const user = await buscarUsuarioPorEmail(supabaseUrl, supabaseKey, email);

    if (!user) {
      return res.status(404).json({
        error: 'Email não encontrado. Verifique se é o mesmo da sua compra na Kiwify.'
      });
    }

    // 2. Atualizar senha no auth.users
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

    // 3. Marcar senha_definida = true em perfis_usuarios
    // Se a marcação falhar, NÃO devolvemos erro pro usuário — a senha já está
    // salva no Auth (que é o que importa). Logamos pra debug.
    try {
      const markRes = await fetch(
        `${supabaseUrl}/rest/v1/perfis_usuarios?user_id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ senha_definida: true }),
        }
      );

      if (!markRes.ok) {
        const errText = await markRes.text();
        console.warn('[criar-senha] Aviso: senha salva no Auth mas falhou ao marcar perfil:', markRes.status, errText);
      }
    } catch (e) {
      console.warn('[criar-senha] Aviso: exception ao marcar perfil:', e.message);
    }

    console.log('[criar-senha] Senha definida para:', email);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[criar-senha] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno', message: err.message });
  }
}

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
