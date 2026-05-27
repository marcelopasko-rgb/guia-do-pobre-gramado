// /api/admin-stats.js
// Endpoint do dashboard admin.
//
// MUDANÇA IMPORTANTE: em vez de baixar até 1000 eventos pro navegador,
// agora pedimos pro Postgres CONTAR e AGRUPAR. Suporta milhões de eventos
// sem travar.
//
// Aceita query string ?periodo=7|30|all (default: all)
//
// Exige o token retornado por /api/admin-login no header Authorization.

const crypto = require('crypto');

function tokenValido(token, secret) {
  if (!token || typeof token !== 'string') return false;
  const partes = token.split('.');
  if (partes.length !== 2) return false;
  const [payload, sig] = partes;
  const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const exp = parseInt(payload, 10);
  if (isNaN(exp) || exp < Date.now()) return false;
  return true;
}

// Helper: faz GET na REST do Supabase com headers padrão
async function sb(url, SERVICE_KEY, extraHeaders = {}) {
  const r = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: 'Bearer ' + SERVICE_KEY,
      Prefer: 'count=exact', // pra count sem trazer linhas
      ...extraHeaders
    }
  });
  return r;
}

// Helper: só retorna o count do header Content-Range (sem trazer linhas)
async function sbCount(url, SERVICE_KEY) {
  // Para count exato sem dados, usa header Prefer: count=exact + Range 0-0
  const r = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: 'Bearer ' + SERVICE_KEY,
      Prefer: 'count=exact',
      Range: '0-0'
    }
  });
  if (!r.ok && r.status !== 206) throw new Error('Count: ' + r.status);
  const contentRange = r.headers.get('content-range') || '';
  // Formato: "0-0/1234" → pegamos o número após a barra
  const total = parseInt((contentRange.split('/')[1] || '0'), 10);
  return isNaN(total) ? 0 : total;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Servidor mal configurado' });
  }

  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!tokenValido(token, SERVICE_KEY)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Filtro de período
  const periodo = (req.query?.periodo || 'all').toString();
  let dataMin = null;
  const agora = new Date();
  if (periodo === '7') {
    dataMin = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (periodo === '30') {
    dataMin = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  const filtroPeriodo = dataMin ? `&criado_em=gte.${encodeURIComponent(dataMin)}` : '';

  // Datas pros KPIs fixos (hoje/semana/mês são sempre relativos à data atual,
  // independente do filtro escolhido)
  const dHoje   = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).toISOString();
  const dSemana = new Date(agora.getTime() - 7  * 24 * 3600 * 1000).toISOString();
  const dMes    = new Date(agora.getTime() - 30 * 24 * 3600 * 1000).toISOString();

  try {
    // ════════════════════════════════════════════════════════════════════
    // 1) COUNTS DOS KPIs (não trazem linhas, só números)
    // ════════════════════════════════════════════════════════════════════
    const [totalCliques, cliquesHoje, cliquesSemana, cliquesMes, cliquesPeriodo] = await Promise.all([
      sbCount(`${SUPABASE_URL}/rest/v1/eventos?select=id`, SERVICE_KEY),
      sbCount(`${SUPABASE_URL}/rest/v1/eventos?select=id&criado_em=gte.${encodeURIComponent(dHoje)}`, SERVICE_KEY),
      sbCount(`${SUPABASE_URL}/rest/v1/eventos?select=id&criado_em=gte.${encodeURIComponent(dSemana)}`, SERVICE_KEY),
      sbCount(`${SUPABASE_URL}/rest/v1/eventos?select=id&criado_em=gte.${encodeURIComponent(dMes)}`, SERVICE_KEY),
      // Cliques no período selecionado (pra usar nos rankings)
      dataMin
        ? sbCount(`${SUPABASE_URL}/rest/v1/eventos?select=id${filtroPeriodo}`, SERVICE_KEY)
        : Promise.resolve(null) // se for "todos", já é o totalCliques
    ]);

    // ════════════════════════════════════════════════════════════════════
    // 2) Usuários únicos com clique (no período)
    //    Usa RPC se existir, senão paginação eficiente
    // ════════════════════════════════════════════════════════════════════
    let usersUnicos = 0;
    let appOpens = 0;
    let usersComDesconto = 0;

    // Tentativa de RPC otimizada (você cria as functions no Supabase — ver arquivo 4)
    try {
      const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_stats_extra`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: 'Bearer ' + SERVICE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data_min: dataMin })
      });
      if (rpcRes.ok) {
        const stats = await rpcRes.json();
        usersUnicos       = stats.users_unicos || 0;
        appOpens          = stats.app_opens || 0;
        usersComDesconto  = stats.users_com_desconto || 0;
      } else {
        throw new Error('RPC não disponível');
      }
    } catch(e) {
      // Fallback: pagina eventos pra contar (mais lento, mas funciona)
      console.warn('RPC admin_stats_extra falhou, usando fallback:', e.message);
      const { uniqueUsers, opens, withDesconto } = await contarManual(SUPABASE_URL, SERVICE_KEY, filtroPeriodo);
      usersUnicos = uniqueUsers;
      appOpens = opens;
      usersComDesconto = withDesconto;
    }

    // ════════════════════════════════════════════════════════════════════
    // 3) RANKINGS — top 10 de cada categoria via RPC (ou fallback)
    // ════════════════════════════════════════════════════════════════════
    let rankings = { parques: [], restaurantes: [], atracoes: [] };
    try {
      const rkRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_rankings`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: 'Bearer ' + SERVICE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data_min: dataMin })
      });
      if (rkRes.ok) rankings = await rkRes.json();
      else throw new Error('RPC rankings não disponível');
    } catch(e) {
      console.warn('RPC admin_rankings falhou, usando fallback:', e.message);
      rankings = await rankingsManual(SUPABASE_URL, SERVICE_KEY, filtroPeriodo);
    }

    // ════════════════════════════════════════════════════════════════════
    // 4) CLIQUES POR DIA (últimos 30 dias) — via RPC ou fallback
    // ════════════════════════════════════════════════════════════════════
    let cliquesPorDia = [];
    try {
      const cpdRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_cliques_por_dia`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: 'Bearer ' + SERVICE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dias: periodo === '7' ? 7 : 30 })
      });
      if (cpdRes.ok) cliquesPorDia = await cpdRes.json();
      else throw new Error('RPC por_dia não disponível');
    } catch(e) {
      console.warn('RPC admin_cliques_por_dia falhou:', e.message);
      // Fallback simples: traz os últimos N dias agrupados client-side
      cliquesPorDia = await cliquesDiaManual(SUPABASE_URL, SERVICE_KEY, periodo === '7' ? 7 : 30);
    }

    // ════════════════════════════════════════════════════════════════════
    // 5) FEED — últimos 100 eventos (não precisa de TODOS)
    // ════════════════════════════════════════════════════════════════════
    const feedRes = await sb(
      `${SUPABASE_URL}/rest/v1/eventos?select=*&order=criado_em.desc&limit=100`,
      SERVICE_KEY
    );
    const feed = feedRes.ok ? await feedRes.json() : [];

    // ════════════════════════════════════════════════════════════════════
    // 6) USUÁRIOS — pagina TODOS (não para nos 200)
    // ════════════════════════════════════════════════════════════════════
    const users = await todosUsuarios(SUPABASE_URL, SERVICE_KEY);

    // ════════════════════════════════════════════════════════════════════
    // 7) RETENÇÃO — usuários que abriram app em D, D+1, D+7
    //    (precisa de app_open; se não houver, fica zerado)
    // ════════════════════════════════════════════════════════════════════
    let retencao = { d1: 0, d7: 0, d30: 0, total_amostra: 0 };
    if (appOpens > 0) {
      try {
        const rtRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_retencao`, {
          method: 'POST',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: 'Bearer ' + SERVICE_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        if (rtRes.ok) retencao = await rtRes.json();
      } catch(e) { /* sem retenção se RPC não existe */ }
    }

    // ════════════════════════════════════════════════════════════════════
    // 8) RESPOSTA
    // ════════════════════════════════════════════════════════════════════
    const totalNoPeriodo = cliquesPeriodo !== null ? cliquesPeriodo : totalCliques;
    const usersCadastrados = users.length;
    const taxaConversao = appOpens > 0
      ? Math.round((usersComDesconto / appOpens) * 1000) / 10 // 1 casa decimal
      : null;

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    return res.status(200).json({
      kpis: {
        total_cliques: totalCliques,
        cliques_hoje: cliquesHoje,
        cliques_semana: cliquesSemana,
        cliques_mes: cliquesMes,
        cliques_periodo: totalNoPeriodo,
        users_unicos: usersUnicos,
        users_cadastrados: usersCadastrados,
        app_opens: appOpens,
        users_com_desconto: usersComDesconto,
        taxa_conversao: taxaConversao,
        media_cliques_user: usersUnicos > 0 ? Math.round((totalNoPeriodo / usersUnicos) * 10) / 10 : null,
        periodo: periodo
      },
      rankings,
      cliques_por_dia: cliquesPorDia,
      retencao,
      feed,
      users
    });

  } catch(e) {
    console.error('admin-stats error:', e);
    return res.status(500).json({ error: e.message || 'Erro ao buscar dados' });
  }
};

// ────────────────────────────────────────────────────────────────────────
// FALLBACKS (caso as RPCs ainda não estejam criadas no Supabase)
// ────────────────────────────────────────────────────────────────────────

async function contarManual(SUPABASE_URL, SERVICE_KEY, filtroPeriodo) {
  // Pagina até 50000 eventos pra contar localmente
  const PAGE = 1000;
  let offset = 0;
  const usuarios = new Set();
  let opens = 0;
  const usersComDesconto = new Set();

  while (offset < 50000) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/eventos?select=user_id,evento${filtroPeriodo}&order=criado_em.desc&limit=${PAGE}&offset=${offset}`,
      { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } }
    );
    if (!r.ok) break;
    const linhas = await r.json();
    if (!linhas.length) break;

    linhas.forEach(l => {
      if (l.user_id) usuarios.add(l.user_id);
      if (l.evento === 'app_open') opens++;
      if (l.evento === 'clique_desconto' || l.evento === 'clique_parque' ||
          l.evento === 'clique_restaurante' || l.evento === 'clique_atracao') {
        if (l.user_id) usersComDesconto.add(l.user_id);
      }
    });

    if (linhas.length < PAGE) break;
    offset += PAGE;
  }

  return { uniqueUsers: usuarios.size, opens, withDesconto: usersComDesconto.size };
}

async function rankingsManual(SUPABASE_URL, SERVICE_KEY, filtroPeriodo) {
  const PAGE = 1000;
  let offset = 0;
  const parques = {}, restaurantes = {}, atracoes = {};

  while (offset < 50000) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/eventos?select=evento,payload${filtroPeriodo}&order=criado_em.desc&limit=${PAGE}&offset=${offset}`,
      { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } }
    );
    if (!r.ok) break;
    const linhas = await r.json();
    if (!linhas.length) break;

    linhas.forEach(l => {
      const nome = l.payload?.nome;
      if (!nome) return;
      if (l.evento === 'clique_parque') parques[nome] = (parques[nome] || 0) + 1;
      else if (l.evento === 'clique_restaurante') restaurantes[nome] = (restaurantes[nome] || 0) + 1;
      else if (l.evento === 'clique_atracao') atracoes[nome] = (atracoes[nome] || 0) + 1;
    });

    if (linhas.length < PAGE) break;
    offset += PAGE;
  }

  const top10 = (obj) => Object.entries(obj)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 10)
    .map(([nome, cliques]) => ({ nome, cliques }));

  return {
    parques: top10(parques),
    restaurantes: top10(restaurantes),
    atracoes: top10(atracoes)
  };
}

async function cliquesDiaManual(SUPABASE_URL, SERVICE_KEY, dias) {
  const dataMin = new Date(Date.now() - dias * 24 * 3600 * 1000).toISOString();
  const PAGE = 1000;
  let offset = 0;
  const porDia = {};

  while (offset < 50000) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/eventos?select=criado_em&criado_em=gte.${encodeURIComponent(dataMin)}&order=criado_em.desc&limit=${PAGE}&offset=${offset}`,
      { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } }
    );
    if (!r.ok) break;
    const linhas = await r.json();
    if (!linhas.length) break;

    linhas.forEach(l => {
      const dia = (l.criado_em || '').slice(0, 10);
      if (dia) porDia[dia] = (porDia[dia] || 0) + 1;
    });

    if (linhas.length < PAGE) break;
    offset += PAGE;
  }

  // Preenche dias sem cliques com zero
  const out = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 3600 * 1000);
    const key = d.toISOString().slice(0, 10);
    out.push({ dia: key, cliques: porDia[key] || 0 });
  }
  return out;
}

async function todosUsuarios(SUPABASE_URL, SERVICE_KEY) {
  const all = [];
  let page = 1;
  const perPage = 200;
  while (page <= 50) { // máximo 10000 usuários (suficiente)
    const r = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?per_page=${perPage}&page=${page}`,
      { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } }
    );
    if (!r.ok) break;
    const data = await r.json();
    const users = data.users || [];
    all.push(...users);
    if (users.length < perPage) break;
    page++;
  }
  return all;
}
