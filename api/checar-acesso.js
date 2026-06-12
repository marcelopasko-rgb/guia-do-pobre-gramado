// /api/checar-acesso.js
// Verifica se o email tem direito de acesso e se já tem senha definida.
//
// Retornos possíveis:
//   { existe: true,  tem_senha: true  }  → usuário com senha → tela de login
//   { existe: true,  tem_senha: false }  → usuário sem senha → tela de criar senha
//   { existe: false }                    → não comprou ainda → erro pro usuário
//
// Fonte da verdade pro `tem_senha`: coluna `senha_definida` em `perfis_usuarios`.
// Mais confiável que adivinhar pelas identities do Supabase Auth.
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
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error('[checar-acesso] Faltam env vars');
      return res.status(500).json({ error: 'Servidor mal configurado' });
    }

    // 1. Buscar usuário no auth.users
    const user = await buscarUsuarioPorEmail(supabaseUrl, supabaseKey, email);

    if (!user) {
      console.log('[checar-acesso] Usuário não encontrado:', email);
      await new Promise(r => setTimeout(r, 400));
      return res.status(200).json({ existe: false });
    }

    // 2. Consultar a coluna senha_definida em perfis_usuarios
    let temSenha = false;
    try {
      const perfilRes = await fetch(
        `${supabaseUrl}/rest/v1/perfis_usuarios?user_id=eq.${user.id}&select=senha_definida`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }
      );

      if (perfilRes.ok) {
        const rows = await perfilRes.json();
        if (rows && rows.length > 0) {
          temSenha = !!rows[0].senha_definida;
        }
      } else {
        console.warn('[checar-acesso] Erro ao consultar perfil:', perfilRes.status);
      }
    } catch (e) {
      console.warn('[checar-acesso] Exception ao consultar perfil:', e.message);
    }

    console.log('[checar-acesso] OK:', { email, id: user.id, tem_senha: temSenha });

    return res.status(200).json({
      existe: true,
      tem_senha: temSenha,
    });

  } catch (err) {
    console.error('[checar-acesso] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno', message: err.message });
  }
}

/**
 * Busca usuário pelo email com fallback de paginação.
 */
async function buscarUsuarioPorEmail(supabaseUrl, supabaseKey, email) {
  const baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  };

  // 1. Tenta filtro server-side primeiro
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
    console.warn('[checar-acesso] Erro no filtro server-side:', e.message);
  }

  // 2. Fallback: paginação
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
      console.warn('[checar-acesso] Erro na página', page, ':', e.message);
      break;
    }
  }

  return null;
}
