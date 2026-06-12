// /api/_auth.js
// Helpers de autenticação e checagem de compra — usados pelos endpoints
// que entregam conteúdo pago ou dados pessoais.
//
// IDEIA CENTRAL: o frontend manda o access_token do Supabase no header
// `Authorization: Bearer <token>`. Aqui o servidor PERGUNTA pro Supabase
// "esse token é válido? de quem é?". Assim o email vem do TOKEN, nunca da
// query string — ninguém consegue consultar as compras de outra pessoa só
// trocando o email na URL.

// Valida o access_token chamando o próprio Supabase Auth.
// Retorna o objeto `user` (com .id e .email) se válido, ou null se inválido.
async function usuarioDoToken(req) {
  const supabaseUrl = process.env.SUPABASE_URL;
  // O /auth/v1/user exige um apikey de projeto. A anon key é a ideal; se ela
  // não estiver configurada, caímos na service key (que sempre existe aqui).
  const apiKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !apiKey) return null;

  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  try {
    const r = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!r.ok) return null;
    const user = await r.json();
    if (!user || !user.id || !user.email) return null;
    return user;
  } catch (e) {
    console.warn('[_auth] falha ao validar token:', e.message);
    return null;
  }
}

// Retorna a lista de produtos comprados por um email (consulta a tabela
// `compras` com a SERVICE KEY). Expande "combo" nos itens individuais.
async function comprasDoEmail(email) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error('Servidor mal configurado');

  const url = `${supabaseUrl}/rest/v1/compras?email=eq.${encodeURIComponent(email)}&status=eq.aprovado&select=produto`;
  const r = await fetch(url, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!r.ok) throw new Error('Erro ao consultar compras: ' + r.status);

  const rows = await r.json();
  const set = new Set();
  for (const row of rows) {
    if (row.produto === 'combo') {
      set.add('roteiro_pdf');
      set.add('restaurantes_secretos');
    } else {
      set.add(row.produto);
    }
  }
  return Array.from(set);
}

module.exports = { usuarioDoToken, comprasDoEmail };
