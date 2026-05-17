// /api/admin-login.js
// Endpoint que valida a senha do admin e retorna um token de sessão de 24h.
// A senha NUNCA vai pro frontend — fica em Environment Variable do Vercel.

const crypto = require('crypto');

// Gera um token simples assinado com HMAC. Não é JWT por simplicidade,
// mas funciona pro caso de uso (validar que o cliente passou pela senha).
function gerarToken(secret) {
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24h
  const payload = String(exp);
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return payload + '.' + sig;
}

module.exports = async (req, res) => {
  // CORS básico (caso futuramente o admin esteja em outro domínio)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const tokenSecret   = process.env.SUPABASE_SERVICE_KEY; // reaproveita como segredo do HMAC

  if (!adminPassword || !tokenSecret) {
    console.error('Faltam env vars ADMIN_PASSWORD ou SUPABASE_SERVICE_KEY');
    return res.status(500).json({ error: 'Servidor mal configurado' });
  }

  // Lê senha do body
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }
  const senhaDigitada = (body && body.senha) || '';

  // Comparação constant-time para evitar timing attacks
  const a = Buffer.from(senhaDigitada);
  const b = Buffer.from(adminPassword);
  const igual = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!igual) {
    // Pequeno delay artificial pra dificultar brute force (não é proteção real,
    // mas atrasa scripts ingênuos que mandam 1000 senhas/seg)
    await new Promise(r => setTimeout(r, 600));
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  const token = gerarToken(tokenSecret);
  return res.status(200).json({ token, expiresIn: 86400 });
};

