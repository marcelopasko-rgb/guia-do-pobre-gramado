// /api/admin-stats.js
// Endpoint que devolve eventos + lista de usuários do Supabase.
// Exige o token retornado por /api/admin-login no header Authorization.
// A SERVICE_KEY do Supabase NUNCA é exposta ao navegador — fica só aqui no servidor.

const crypto = require('crypto');

function tokenValido(token, secret) {
  if (!token || typeof token !== 'string') return false;
  const partes = token.split('.');
  if (partes.length !== 2) return false;
  const [payload, sig] = partes;

  // Verifica assinatura
  const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  // Verifica expiração
  const exp = parseInt(payload, 10);
  if (isNaN(exp) || exp < Date.now()) return false;

  return true;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Servidor mal configurado' });
  }

  // Valida token de sessão
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!tokenValido(token, SERVICE_KEY)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    // Busca eventos (últimos 1000) via REST API do Supabase
    const evRes = await fetch(
      `${SUPABASE_URL}/rest/v1/eventos?select=*&order=criado_em.desc&limit=1000`,
      { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } }
    );
    if (!evRes.ok) throw new Error('Eventos: ' + evRes.status);
    const eventos = await evRes.json();

    // Busca usuários via Admin API (precisa de service_role)
    const usRes = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?per_page=200`,
      { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } }
    );
    if (!usRes.ok) throw new Error('Users: ' + usRes.status);
    const usData = await usRes.json();
    const users = usData.users || [];

    // Cache curto pra reduzir custo se admin atualizar várias vezes seguidas
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    return res.status(200).json({ eventos, users });

  } catch(e) {
    console.error('admin-stats error:', e);
    return res.status(500).json({ error: e.message || 'Erro ao buscar dados' });
  }
};
