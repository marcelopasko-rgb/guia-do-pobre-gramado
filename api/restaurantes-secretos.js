// /api/restaurantes-secretos.js
// Entrega o conteúdo PAGO "Restaurantes Secretos" — mas só pra quem comprou.
//
// Antes esse conteúdo vivia dentro de js/app.js, então qualquer pessoa lia
// no DevTools sem pagar. Agora:
//   1. O frontend manda o access_token do Supabase.
//   2. O servidor valida o token e descobre o email do usuário.
//   3. Checa se ele comprou "restaurantes_secretos" (ou o combo).
//   4. Só então busca os dados na tabela protegida por RLS e devolve.
//
// Sem compra → 403, e o conteúdo nunca chega ao navegador.
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
    return res.status(500).json({ error: 'Servidor mal configurado' });
  }

  try {
    // 1. Validar o token → descobrir quem é o usuário
    const user = await usuarioDoToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Não autorizado. Faça login de novo.' });
    }

    // 2. Conferir a compra (no servidor — não dá pra forjar)
    const compras = await comprasDoEmail(user.email);
    const temAcesso = compras.includes('restaurantes_secretos');
    if (!temAcesso) {
      return res.status(403).json({ error: 'Conteúdo exclusivo do Bônus do Pobre.', liberado: false });
    }

    // 3. Buscar o conteúdo na tabela protegida (service key ignora o RLS)
    const url = `${supabaseUrl}/rest/v1/restaurantes_secretos?select=cat,cat_icon,emoji,nome,selo,faixa,preco,descricao,publico,dica&order=ordem.asc`;
    const r = await fetch(url, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    if (!r.ok) {
      console.error('[restaurantes-secretos] erro Supabase:', r.status, await r.text());
      return res.status(500).json({ error: 'Erro ao carregar conteúdo' });
    }

    const rows = await r.json();

    // 4. Remapear pros nomes curtos que o frontend já espera (e, n, desc...)
    const itens = rows.map(row => ({
      cat: row.cat,
      catIcon: row.cat_icon,
      e: row.emoji,
      n: row.nome,
      selo: row.selo || undefined,
      faixa: row.faixa,
      preco: row.preco,
      desc: row.descricao,
      publico: row.publico,
      dica: row.dica || undefined,
    }));

    return res.status(200).json({ liberado: true, itens });
  } catch (err) {
    console.error('[restaurantes-secretos] erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
