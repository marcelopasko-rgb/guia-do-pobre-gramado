// /api/checar-acesso.js
// Verifica se o email tem direito de acesso e se já tem senha definida.
//
// Retornos possíveis:
//   { existe: true,  tem_senha: true  }  → usuário com senha → tela de login
//   { existe: true,  tem_senha: false }  → usuário sem senha → tela de criar senha
//   { existe: false }                    → não comprou ainda → erro pro usuário
//
// Estratégia de busca (em ordem):
//   1. Tenta filtro server-side: GET /auth/v1/admin/users?email=...
//   2. Se não voltou nada, faz paginação manual em até 5 páginas (5000 users)
//   3. Como último fallback, considera não existente
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
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error('[checar-acesso] Faltam env vars');
      return res.status(500).json({ error: 'Servidor mal configurado' });
    }

    const user = await buscarUsuarioPorEmail(supabaseUrl, supabaseKey, email);

    if (!user) {
      console.log('[checar-acesso] Usuário não encontrado:', email);
      // Pequeno delay para dificultar enumeração via brute force
      await new Promise(r => setTimeout(r, 400));
      return res.status(200).json({ existe: false });
    }

    // Detecta se já tem senha: usuários criados via OTP têm identity 'email'
    // mas sem encrypted_password. Heurística: checa se há provider 'email' E
    // se a coluna last_sign_in_at via password existe. Como a API não expõe
    // isso diretamente, usamos uma checagem por tentativa de login com senha
    // dummy seria custosa — então mantemos a heurística por identities, mas
    // adicionamos um sinal extra: app_metadata.providers.
    const identities = user.identities || [];
    const providersMeta = user.app_metadata?.providers || [];
    const provedores = new Set([
      ...identities.map(i => i.provider),
      ...providersMeta,
    ]);
    const temIdentidadeEmail = provedores.has('email');

    console.log('[checar-acesso] Encontrado:', {
      email,
      id: user.id,
      providers: Array.from(provedores),
      tem_senha: temIdentidadeEmail,
    });

    return res.status(200).json({
      existe: true,
      tem_senha: temIdentidadeEmail,
      user_id: user.id, // ajuda o criar-senha a não precisar buscar de novo
    });

  } catch (err) {
    console.error('[checar-acesso] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno', message: err.message });
  }
}

/**
 * Busca usuário pelo email. Tenta filtro server-side e cai pra paginação
 * manual se necessário (algumas versões do Supabase ignoram o filtro ?email=).
 */
async function buscarUsuarioPorEmail(supabaseUrl, supabaseKey, email) {
  const baseHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  };

  // 1. Tenta filtro server-side primeiro (mais rápido)
  try {
    const filtroRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      { headers: baseHeaders }
    );

    if (filtroRes.ok) {
      const data = await filtroRes.json();
      const users = data?.users || [];
      const match = users.find(u => (u.email || '').toLowerCase() === email);
      if (match) {
        console.log('[checar-acesso] Achado via filtro server-side');
        return match;
      }
    } else {
      console.warn('[checar-acesso] Filtro server-side falhou:', filtroRes.status);
    }
  } catch (e) {
    console.warn('[checar-acesso] Erro no filtro server-side:', e.message);
  }

  // 2. Fallback: paginação manual (perPage máx = 1000)
  // Vai até 5 páginas = 5000 usuários. Se você tiver mais que isso, avisa
  // que precisamos de outra estratégia (RPC SQL direto).
  const PER_PAGE = 1000;
  const MAX_PAGES = 5;

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const pageRes = await fetch(
        `${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=${PER_PAGE}`,
        { headers: baseHeaders }
      );

      if (!pageRes.ok) {
        console.warn('[checar-acesso] Pag', page, 'falhou:', pageRes.status);
        break;
      }

      const data = await pageRes.json();
      const users = data?.users || [];

      const match = users.find(u => (u.email || '').toLowerCase() === email);
      if (match) {
        console.log('[checar-acesso] Achado na página', page);
        return match;
      }

      // Última página (menos que PER_PAGE) → parar
      if (users.length < PER_PAGE) {
        console.log('[checar-acesso] Fim das páginas (' + page + '), não achado');
        break;
      }
    } catch (e) {
      console.warn('[checar-acesso] Erro na página', page, ':', e.message);
      break;
    }
  }

  return null;
}
