// /api/minhas-compras.js
// Consulta as compras do usuário LOGADO.
//
// MUDANÇA DE SEGURANÇA: antes aceitava ?email=qualquer@coisa.com e devolvia
// as compras daquele email, sem provar que o requisitante era o dono. Agora
// exige o access_token do Supabase no header Authorization. O email é extraído
// do TOKEN — ninguém consulta as compras de outra pessoa.
//
// Uso: GET /api/minhas-compras   (com header: Authorization: Bearer <token>)
// Retorna: { email, compras: ["roteiro_pdf", "restaurantes_secretos"] }
//
// Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY

const { aplicarCors } = require('./_cors');
const { usuarioDoToken, comprasDoEmail } = require('./_auth');

module.exports = async (req, res) => {
  if (aplicarCors(req, res, { methods: 'GET, OPTIONS' })) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('[minhas-compras] Variáveis de ambiente faltando');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Identidade vem do token, não da query string
    const user = await usuarioDoToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const compras = await comprasDoEmail(user.email);

    return res.status(200).json({ email: user.email, compras });
  } catch (err) {
    console.error('[minhas-compras] Erro inesperado:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};
