// /api/_cors.js
// Helper de CORS com allowlist. Substitui o "Access-Control-Allow-Origin: *"
// que estava espalhado pelos endpoints sensíveis.
//
// Por que isso importa: com "*", QUALQUER site na internet podia disparar
// requisições aos seus endpoints a partir do navegador de um visitante.
// Aqui, só os domínios que VOCÊ controla são aceitos.
//
// Se um dia mudar de domínio, é só adicionar na lista (ou na env var
// ALLOWED_ORIGINS, separada por vírgula).

const ORIGENS_PADRAO = [
  'https://guiadopobre.com',
  'https://www.guiadopobre.com',
  'https://guia-do-pobre-gramado.vercel.app',
];

function origensPermitidas() {
  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return [...new Set([...ORIGENS_PADRAO, ...extra])];
}

// Aplica os headers de CORS. Retorna true se a requisição era um preflight
// OPTIONS (já respondido aqui) — nesse caso o handler deve dar `return`.
function aplicarCors(req, res, { methods = 'GET, OPTIONS' } = {}) {
  const origin = req.headers.origin || '';
  const lista = origensPermitidas();

  if (lista.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  // Se a origem não está na lista, NÃO mandamos o header — o navegador
  // bloqueia a resposta. Requisições server-to-server (sem Origin) seguem
  // funcionando normalmente, pois não passam pela checagem de CORS.

  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { aplicarCors, origensPermitidas };
