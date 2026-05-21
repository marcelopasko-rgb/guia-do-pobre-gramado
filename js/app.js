
/* ═══ ICON SYSTEM — SVG RICO + GRADIENTE POR CATEGORIA ═══ */
 
// Cada atração tem: svg path data, cor de fundo (gradiente), cor do stroke
const ATTR_ICONS = {
  // NEVE / FRIO
  snowland:    { d:'M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07', grad:['#001830','#0ea5e9'], stroke:'#7dd3fc' },
  // LAGO / ÁGUA
  lago:        { d:'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z', grad:['#002060','#3b82f6'], stroke:'#93c5fd' },
  // PARQUE / NATUREZA
  parque:      { d:'M17 14 12 3 7 14h10zM17 20H7l1.5-3h7L17 20zM12 14v3', grad:['#053220','#16a34a'], stroke:'#86efac' },
  // MONTANHA / AVENTURA
  montanha:    { d:'M3 20 9 10 13 14 17 9 21 20M2 20h20', grad:['#1c1028','#7c3aed'], stroke:'#c4b5fd' },
  // CHOCOLATE / CAFÉ
  chocolate:   { d:'M18 8h1a4 4 0 0 1 0 8h-1M2 8h14v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3', grad:['#2d0a00','#92400e'], stroke:'#fcd34d' },
  // VINHO / BEBIDA
  vinho:       { d:'M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5z', grad:['#3b0764','#9333ea'], stroke:'#e9d5ff' },
  // TREM / TRANSPORTE
  trem:        { d:'M4 11V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12l-2 2H6l-2-2V11zM4 11h16M12 3v8M8.5 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM15.5 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', grad:['#1a1a00','#ca8a04'], stroke:'#fde68a' },
  // CÂMERA / FOTO
  camera:      { d:'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', grad:['#0c1a2e','#2563eb'], stroke:'#93c5fd' },
  // RODA GIGANTE / PARQUE DIVERSÕES
  rodagigante: { d:'M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0', grad:['#1a0020','#db2777'], stroke:'#f9a8d4' },
  // MUSEU / CULTURA
  museu:       { d:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10', grad:['#0a1628','#1d4ed8'], stroke:'#93c5fd' },
  // GASTRONOMIA / RESTAURANTE
  garfo:       { d:'M3 2v6a4 4 0 0 0 4 4 4 4 0 0 0 4-4V2M7 2v20M21 2v8a3 3 0 0 1-3 3h-1v9', grad:['#1a0a00','#c2410c'], stroke:'#fdba74' },
  // CARRO / CORRIDA
  carro:       { d:'M5 17H3a2 2 0 0 1-2-2V9l3-6h14l3 6v6a2 2 0 0 1-2 2h-2M9 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM15 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', grad:['#0f0a00','#b45309'], stroke:'#fde68a' },
  // PRESENTE / BÔNUS
  presente:    { d:'M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z', grad:['#1a0030','#7c3aed'], stroke:'#ddd6fe' },
  // CRISTAL / DIAMANTE
  cristal:     { d:'M2 12l10-10 10 10-10 10zM12 2v20M2 12h20', grad:['#001a2e','#0891b2'], stroke:'#67e8f9' },
  // GLOBO / MUNDO
  globo:       { d:'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10A15 15 0 0 1 8 12a15 15 0 0 1 4-10z', grad:['#001428','#0369a1'], stroke:'#7dd3fc' },
  // FOGO / SHOW
  fogo:        { d:'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z', grad:['#1a0500','#dc2626'], stroke:'#fca5a5' },
  // CORAÇÃO / AMOR
  coracao:     { d:'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', grad:['#1a0010','#e11d48'], stroke:'#fda4af' },
  // MÚSICA
  musica:      { d:'M9 18V5l12-2v13M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', grad:['#0a0020','#6d28d9'], stroke:'#c4b5fd' },
  // BÚSSOLA / MAPA
  bussola:     { d:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z', grad:['#001a10','#065f46'], stroke:'#6ee7b7' },
  // GAMEPAD / GAMES
  gamepad:     { d:'M6 11h4M8 9v4M15 12h.01M17 10h.01M17.32 5H6.68a4 4 0 0 0-4 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.41.59L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.54-.6-6.58-.68-7.26A4 4 0 0 0 17.32 5z', grad:['#000d20','#1e40af'], stroke:'#93c5fd' },
  // Igreja / CATEDRAL
  catedral:    { d:'M18 7l4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2M14 22v-4a2 2 0 0 0-4 0v4M18 22V5l-6-3-6 3v17M12 7v5M10 9h4', grad:['#0a0a1e','#4338ca'], stroke:'#a5b4fc' },
  // PINGENTE / TAG DESCONTO
  tag:         { d:'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01', grad:['#1a0a00','#ea580c'], stroke:'#fdba74' },
  // BUS
  bus:         { d:'M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9 18h5M16 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', grad:['#000d20','#0369a1'], stroke:'#7dd3fc' },
  // PADRÃO
  estrela:     { d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', grad:['#1a1400','#ca8a04'], stroke:'#fde68a' },
};

function getIconKey(name, emoji) {
  const n = (name || '').toLowerCase();
  const e = emoji || '';
  if(n.includes('snow') || n.includes('neve') || n.includes('gelo') || n.includes('gelado')) return 'snowland';
  if(n.includes('lago') || n.includes('água') || n.includes('acqua') || n.includes('cachoeira') || n.includes('raft')) return 'lago';
  if(n.includes('caracol') && !n.includes('bondinho')) return 'parque';
  if(n.includes('garden') || n.includes('jardim') || n.includes('parque') || n.includes('ecoparque') || n.includes('mátria') || n.includes('matria') || n.includes('flores') || n.includes('lavanda') || n.includes('olivas') || n.includes('terra mágica') || n.includes('florybal') || n.includes('big land') || n.includes('dinos') || n.includes('zoo') || n.includes('knorr')) return 'parque';
  if(n.includes('skyglass') || n.includes('bondinho') || n.includes('aéreo') || n.includes('balão') || n.includes('canyon') || n.includes('alpen') || n.includes('montanha')) return 'montanha';
  if(n.includes('chocolate') || n.includes('fondue') || n.includes('café') || n.includes('cafe') || n.includes('colonial') || n.includes('doces') || n.includes('noel') || n.includes('forno') || n.includes('colono')) return 'chocolate';
  if(n.includes('vinho') || n.includes('viníc') || n.includes('jolimont') || n.includes('ravanello') || n.includes('cerveja') || n.includes('boemia') || n.includes('edelbrau') || n.includes('farol') || n.includes('campo') || n.includes('wine') || n.includes('museu do vinho')) return 'vinho';
  if(n.includes('maria fumaça') || n.includes('trem') || n.includes('ferrovia') || n.includes('vapor') || n.includes('bus') || n.includes('bondinho')) return 'trem';
  if(n.includes('selfie') || n.includes('foto') || n.includes('camera') || n.includes('forever') || n.includes('lumni') || n.includes('happy') || n.includes('dreams') || n.includes('wax') || n.includes('cera') || n.includes('hollywood') || n.includes('super carro') || n.includes('motor show') || n.includes('harley') || n.includes('automóvel')) return 'camera';
  if(n.includes('roda gigante') || n.includes('ferriswheel') || n.includes('alpen') || n.includes('exceed') || n.includes('gamepad') || n.includes('nba') || n.includes('lugano') || n.includes('kids') || n.includes('mundo lugano') || n.includes('fabulosa') || n.includes('escape') || n.includes('watson')) return 'rodagigante';
  if(n.includes('museu') || n.includes('palácio') || n.includes('festival') || n.includes('beatles') || n.includes('egípcio') || n.includes('pedras') || n.includes('silêncio') || n.includes('fragram') || n.includes('perfume') || n.includes('moda') || n.includes('espaço')) return 'museu';
  if(n.includes('restaurante') || n.includes('pizzaria') || n.includes('pizza') || n.includes('churrasco') || n.includes('steak') || n.includes('parrilla') || n.includes('bistrô') || n.includes('bistro') || n.includes('garfo') || n.includes('kongo') || n.includes('hector') || n.includes('rasen') || n.includes('hard rock') || n.includes('reino da boemia') || n.includes('hard')) return 'garfo';
  if(n.includes('carro') || n.includes('udrive') || n.includes('exotic') || n.includes('race') || n.includes('dream car')) return 'carro';
  if(n.includes('cristais') || n.includes('crystal') || n.includes('mundo gelado')) return 'cristal';
  if(n.includes('mini mundo') || n.includes('espaço') || n.includes('nasa') || n.includes('space') || n.includes('planetário')) return 'globo';
  if(n.includes('gatzz') || n.includes('show') || n.includes('espetáculo') || n.includes('bombacha') || n.includes('gaúcho') || n.includes('gramadense') || n.includes('era do fogo')) return 'fogo';
  if(n.includes('amor') || n.includes('jardim do amor') || n.includes('romântico') || n.includes('castelinho') || n.includes('saint') || n.includes('château') || n.includes('heilige')) return 'coracao';
  if(n.includes('música') || n.includes('music') || n.includes('rock') || n.includes('beatles') || n.includes('festival')) return 'musica';
  if(n.includes('catedral') || n.includes('igreja') || n.includes('matriz') || n.includes('são pedro')) return 'catedral';
  if(n.includes('rua') || n.includes('praça') || n.includes('pórtico') || n.includes('rotula') || n.includes('largo') || n.includes('etnias') || n.includes('borough') || n.includes('bairro') || n.includes('estação campos')) return 'bussola';
  if(n.includes('promoç') || n.includes('desconto') || n.includes('ticket') || n.includes('ingresso')) return 'tag';
  if(e === '❄️' || e === '🧊') return 'snowland';
  if(['🌊','💧','🏊'].includes(e)) return 'lago';
  if(['🌲','🌿','🌺','🌸','🌾','🦕','🦁'].includes(e)) return 'parque';
  if(['🏔️','🎢','🚡'].includes(e)) return 'montanha';
  if(['🍫','🫕','☕','🍬','🎅'].includes(e)) return 'chocolate';
  if(['🍷','🍾','🍺'].includes(e)) return 'vinho';
  if(['🚂','🚍','🚌','🚡'].includes(e)) return 'trem';
  if(['📸','📷','🎬','🗿'].includes(e)) return 'camera';
  if(['🎡','🎮','🎠','🏀','👶','🧚'].includes(e)) return 'rodagigante';
  if(['🏛','🏛️','🗺','🔭'].includes(e)) return 'museu';
  if(['🎭','🔥','🤠','🥩'].includes(e)) return 'fogo';
  if(['❤️','💑','🌹','💎'].includes(e)) return 'coracao';
  if(['🎸','🎵'].includes(e)) return 'musica';
  if(['⛪'].includes(e)) return 'catedral';
  if(['🏎️','🚗','🏍️'].includes(e)) return 'carro';
  if(['🎁','🎀','🎫','🏷'].includes(e)) return 'presente';
  return 'estrela';
}

function makeIconSVG(key, strokeOverride) {
  const icon = ATTR_ICONS[key] || ATTR_ICONS.estrela;
  const stroke = strokeOverride || icon.stroke;
  // Build gradient background style
  const bg = `linear-gradient(145deg, ${icon.grad[0]}, ${icon.grad[1]})`;
  const paths = icon.d.split('M').filter(Boolean).map(seg => {
    const full = 'M' + seg.trim();
    if(full.includes('a') || full.includes('A') || full.includes('z') || full.includes('Z') || full.match(/[Ll][^Mm]/) ) {
      return `<path d="${full}" stroke="${stroke}" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return `<path d="${full}" stroke="${stroke}" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
  return { bg, svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px;position:relative;z-index:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.5))">${paths}</svg>` };
}

function getIconHTML(name, emoji, size) {
  const key = getIconKey(name, emoji);
  const icon = ATTR_ICONS[key] || ATTR_ICONS.estrela;
  const s = size || 44;
  const r = Math.round(s * 0.32);
  const { bg, svg } = makeIconSVG(key);
  return `<div style="width:${s}px;height:${s}px;border-radius:${r}px;background:${bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.5);"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 55%);border-radius:inherit;pointer-events:none;"></div>${svg}</div>`;
}

function getParkIconSVG(emoji) { return getIconHTML('', emoji); }
function getRestIconSVG(emoji) { return getIconHTML('', emoji); }
function getAttrIconSVG(emoji, nome) { return getIconHTML(nome || '', emoji); }
function getFreeIconSVG(nome) { return getIconHTML(nome, '✨'); }



let toastT;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2300);
}
function openOverlay(id){
  ensureBuilt(id);
  document.getElementById(id).classList.add('open');
}

// ── LAZY BUILD: constrói o conteúdo de cada overlay apenas na primeira abertura
// Economiza ~80-90% do tempo de boot em celulares mais lentos.
const _builtOverlays = new Set();
function ensureBuilt(overlayId) {
  if (_builtOverlays.has(overlayId)) return;
  _builtOverlays.add(overlayId);
  try {
    switch (overlayId) {
      case 'overlay-roteiro':
        buildRoteiro();
        applyRoteiroChecked();
        break;
      case 'overlay-promocoes':
        buildPromocoes();
        break;
      case 'overlay-restaurantes':
        buildRestaurantes();
        break;
      case 'overlay-atracoes':
        buildAtracoes();
        break;
      case 'overlay-gratuitos':
        buildGratuitos();
        break;
      case 'overlay-relampago':
        buildRelampago();
        break;
      case 'overlay-bonus':
        buildBonus();
        break;
    }
  } catch(e) {
    // Build falhou — remove da lista pra tentar de novo na próxima abertura
    _builtOverlays.delete(overlayId);
    console.error('ensureBuilt(' + overlayId + '):', e);
  }
}
function closeOverlay(id){
  document.getElementById(id).classList.remove('open');
  const searches = {
    'overlay-roteiro':     'search-roteiro',
    'overlay-promocoes':   'search-promocoes',
    'overlay-restaurantes':'search-restaurantes',
    'overlay-atracoes':    'search-atracoes',
    'overlay-gratuitos':   'search-gratuitos',
  };
  if (searches[id]) {
    const inp = document.getElementById(searches[id]);
    if (inp && inp.value) { inp.value = ''; inp.dispatchEvent(new Event('input')); }
  }
}
function setClima(name,el){
  document.querySelectorAll('.clima-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.clima-panel').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('clima-'+name).classList.add('active');
}

/* ═══ ROTEIRO ═══ */
const roteiroData=[
  {dia:1,titulo:"Centro de Gramado a Pé",sub:"Caminhada pelos pontos icônicos da Av. Borges de Medeiros",
   atr:[
     {n:"Avenida Borges de Medeiros",d:"09:30 — Início da caminhada pela avenida principal de Gramado",v:"Grátis",free:true},
     {n:"Rua Coberta + Chocolate Prawer",d:"10:00 — Rua Coberta e degustação na unidade centro da Prawer",v:"Grátis",free:true},
     {n:"Igreja Matriz São Pedro + Fonte do Amor Eterno",d:"11:00 — Igreja histórica e ponto romântico da cidade",v:"Grátis",free:true},
     {n:"Rua Torta + Criamigos",d:"12:00 — Rua charmosa com parada na loja Criamigos",v:"Grátis",free:true},
     {n:"Almoço",d:"13:00 — Pastaciutta, Quintanilha ou Chama de Fogo",v:"~R$ 40–70",free:false},
     {n:"Casa do Colono",d:"15:00 — Pão com linguiça quentinho saindo do forno de barro",v:"Grátis",free:true},
     {n:"Rótula das Bandeiras + Lago Joaquina Rita Bier",d:"16:30 — Encerramento do dia com vista tranquila do lago",v:"Grátis",free:true},
   ],
   tip:"Dia 100% a pé no centro. Calçados confortáveis são obrigatórios. Economize o dinheiro do transporte para as atrações dos próximos dias!"},
  {dia:2,titulo:"Lago Negro, Mini Mundo e Olivas",sub:"Natureza pela manhã e o melhor pôr do sol à tarde",
   atr:[
     {n:"Lago Negro",d:"09:00 — Passeio de pedalinho nas águas escuras rodeadas de pinheiros",v:"R$ 50–60",free:false},
     {n:"Almoço",d:"12:00 — Alecrim Santo, Malbek ou Casa Muttoni",v:"~R$ 40–70",free:false},
     {n:"Mini Mundo",d:"14:00 — Réplicas de monumentos mundiais 24x menores que o real",v:"R$ 80",free:false},
     {n:"Olivas de Gramado",d:"16:30 — Chegada estratégica para o pôr do sol + degustação de azeites",v:"A partir de R$ 99",free:false},
   ],
   tip:"AVISO: Use carro ou app de transporte neste dia — Lago Negro, Mini Mundo e Olivas ficam em pontos distintos e afastados do centro."},
  {dia:3,titulo:"Chocolates, Natureza e Canela",sub:"Transição suave entre as duas cidades",
   atr:[
     {n:"Fábrica de Chocolates Prawer",d:"09:30 — Unidade da Av. das Hortênsias: tour guiado com degustação",v:"R$ 39–49",free:false},
     {n:"Garden Park",d:"11:00 — Jardins, alamedas e riachos em mata nativa",v:"R$ 50–110",free:false},
     {n:"Almoço",d:"13:00 — Bêrga Motta ou Cantibello (verifique dias de funcionamento)",v:"~R$ 45–80",free:false},
     {n:"Centro de Canela — Praça João Corrêa + Estação Campos",d:"15:30 — Praça histórica e centro cultural gastronômico de Canela",v:"Grátis",free:true},
     {n:"Sinos da Catedral + Café Cultura",d:"17:30 — Subida à torre da Catedral de Pedra e café especial",v:"Grátis + café",free:true},
   ],
   tip:"A Catedral de Pedra é eleita uma das 7 Maravilhas do Brasil — não pule! Vá de carro: Gramado → Canela são apenas 7km."},
  {dia:4,titulo:"Aventura e Cultura",sub:"Vistas de tirar o fôlego e tecnologia",
   atr:[
     {n:"Skyglass Canela",d:"09:00 — Plataforma de vidro 35m suspensa sobre o Vale da Ferradura",v:"A partir de R$ 90",free:false},
     {n:"Bondinhos Aéreos Canela",d:"11:30 — Vista aérea da Cascata do Caracol",v:"A partir de R$ 60",free:false},
     {n:"Almoço",d:"13:30 — Otto Bistrô, Containner Bistrot ou Garfo e Bombacha",v:"~R$ 50–90",free:false},
     {n:"Space Adventure (Museu da NASA)",d:"15:30 — Retorno a Gramado: 270+ itens originais da NASA + planetário",v:"A partir de R$ 59,90",free:false},
     {n:"Roda Gigante + Mundo a Vapor",d:"17:30 — 52m de altura na Roda Gigante e máquinas históricas a vapor",v:"R$ 65 + R$ 90",free:false},
   ],
   tip:"AVISO: Use carro neste dia. Skyglass e Bondinhos ficam no lado de Canela; Space Adventure e Roda Gigante de volta em Gramado. Planeje a logística!"},
  {dia:5,titulo:"Cristais, Lavandas e Vinhos",sub:"Um dia sensorial e sofisticado",
   atr:[
     {n:"Cristais de Gramado",d:"09:30 — 2.000m² de experiência sobre cristal artístico produzido ao vivo",v:"R$ 44–78",free:false},
     {n:"Le Jardin Parque de Lavanda",d:"11:30 — Campos de lavanda, jardins ornamentais e almoço no bistrô incluso",v:"A partir de R$ 20",free:false},
     {n:"Vinícola Ravanello",d:"15:00 — Visita guiada da videira ao envase + degustação de vinhos",v:"R$ 150",free:false},
   ],
   tip:"AVISO: Reserva antecipada obrigatória na Vinícola Ravanello: (54) 2700-0102. Os horários são fixos (10h ou 15h na semana). Não apareça sem reserva!"},
  {dia:6,titulo:"Tour Linha Bella",sub:"Imersão total na cultura imigrante italiana",
   atr:[
     {n:"Tour Linha Bella",d:"08:30 às 15:30 — Casarões históricos, moinhos e paisagens do interior de Gramado",v:"R$ 300",free:false},
     {n:"Almoço típico na Cantina Linha Bella",d:"Almoço incluso no tour — culinária italiana colonial autêntica",v:"Incluso",free:true},
     {n:"Compras no Centro de Gramado",d:"Noite livre — chocolates, geleias, embutidos e lembranças",v:"Variável",free:false},
   ],
   tip:"AVISO: Reserva antecipada obrigatória para o Tour Linha Bella. Funciona Seg/Qua/Sex na baixa temporada e todos os dias em julho e nov–jan."},
  {dia:7,titulo:"Neve e Despedida",sub:"Fechar a viagem com a experiência da neve",
   atr:[
     {n:"Snowland",d:"09:00 — Chegue cedo! Pistas de esqui, patinação no gelo e show. 1º parque de neve indoor das Américas",v:"A partir de R$ 164,50",free:false},
     {n:"Almoço",d:"13:00 — Rodízio de massas ou pizzas temáticas no centro",v:"~R$ 40–65",free:false},
     {n:"Passeios finais pelo centro",d:"14:00 — Despedida de Gramado: últimas compras, fotos e memórias",v:"Grátis",free:true},
   ],
   tip:"Snowland fecha às quartas-feiras — ajuste o planejamento se o Dia 7 cair numa quarta. Chegue até as 10h para pegar as melhores pistas sem fila!"},
];

function toggleDay(header){
  const block=header.parentElement;
  const isOpen=block.classList.contains('open');
  block.classList.toggle('open',!isOpen);
  header.querySelector('.day-chevron').textContent=isOpen?'▼':'▲';
}

function buildRoteiro(dados){
  const data = dados || roteiroData;
  window._roteiroAtual = data;
  const body=document.getElementById('roteiro-content') || document.getElementById('roteiro-body');
  body.innerHTML=data.map((d,i)=>`
    <div class="day-block ${i===0?'open':''}">
      <div class="day-header" onclick="toggleDay(this)">
        <div class="day-num">
          ${d.dia || d.dia}
          <span class="day-num-label">dia</span>
        </div>
        <div class="day-info"><h4>${d.titulo}</h4><p>${d.sub || ''}</p></div>
        <div class="day-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
      </div>
      <div class="day-content">
        ${(d.atr || buildAtividadesDoDia(d)).map((a,j)=>{
          const discountUrl = !a.free ? findParksnetLink(a.n) : null;
          const itemId = 'd' + d.dia + '-' + j;
          const discountBtn = discountUrl
            ? `<a href="${discountUrl}" target="_blank" rel="noopener" class="btn-roteiro-desconto"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><line x1="6" y1="18" x2="18" y2="6"/></svg>Ver com Desconto</a>`
            : '';
          return `
          <div class="attraction-item" data-id="${itemId}">
            <div class="attr-num">${j+1}</div>
            <div class="attr-info">
              <h5>${a.n}</h5>
              <p>${a.d}</p>
            </div>
            <button class="item-check" onclick="toggleRoteiroItem(this,'${itemId}')" title="Marcar como concluído">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <div class="attr-price ${a.free?'free':'paid'}">${a.v || ''}</div>
            ${discountBtn}
          </div>
        `}).join('')}
        ${d.tip ? `<div class="day-tip">
          <div class="day-tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg></div>
          <div class="day-tip-text"><strong>Dica do pobre:</strong> ${d.tip}</div>
        </div>` : ''}
      </div>
    </div>
  `).join('');

  body.innerHTML += `
    <div style="margin:14px 16px;background:linear-gradient(135deg,#0f1e0f,#1a2e1a);border:1px solid #2a3a2a;border-radius:14px;padding:14px 16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0;"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
        <h5 style="font-size:13px;font-weight:800;color:var(--green);">Dicas do Pobre para Gramado</h5>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">🧥</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Roupa:</strong> Sempre leve um casaco, mesmo no verão. O frio aparece do nada em Gramado — e casaco na cidade custa o dobro.</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">☂️</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Chuva:</strong> Guarda-chuva na bagagem é obrigatório. Em Gramado vende por R$ 50, na sua cidade por R$ 15. Vai preparado!</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">🥾</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Calçado:</strong> Traga tênis confortável. Gramado tem muitas ladeiras e você vai caminhar muito mais do que imagina.</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">🍽️</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Fondue:</strong> Experimente ao menos uma vez — é o prato símbolo da cidade. Prefira dias frios para a experiência completa.</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">📅</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Timing:</strong> Viaje em dias de semana sempre que possível. Filas somem e preços caem até 40% comparado ao fim de semana.</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">🎟️</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Ingressos:</strong> Compre sempre online e com antecedência — além de mais barato, você evita fila e garante vaga nos horários melhores.</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">🚗</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Transporte:</strong> Muitas atrações ficam fora do centro. Use Uber ou alugue carro — o transporte público é limitado.</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:15px;flex-shrink:0;">🍫</span>
          <p style="font-size:11px;color:#ccc;line-height:1.6;font-weight:600;"><strong style="color:var(--green);">Chocolate:</strong> Compre chocolate na Prawer ou Lugano — são as melhores da cidade. Evite as lojas de rua que vendem marca genérica com embalagem bonita.</p>
        </div>
      </div>
    </div>
  `;
  // Recalcula progresso com os novos itens renderizados
  applyRoteiroChecked();
}

/* ═══ PARQUES ═══ */
// de: preço cheio | por: preço com desconto | feriado: aviso de feriado (ou null)
const parques=[
  {e:"❄️",n:"Snowland",d:"Parque de neve indoor — experiência única no Brasil",de:"R$ 329,00",por:"a partir de R$ 164,50",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/snowland?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏔️",n:"Skyglass Canela",d:"Plataforma de vidro 35m sobre o Vale da Ferradura",de:"R$ 180,00",por:"a partir de R$ 90,00",feriado:"FERIADO 5% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/skyglass?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🚡",n:"Bondinhos Aéreos Canela",d:"Passeio aéreo com vista para a Cascata do Caracol",de:"R$ 150,00",por:"a partir de R$ 60,00",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/bondinhos-canela?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🚀",n:"Space Adventure",d:"Experiência NASA com 270+ itens originais e planetário",de:"R$ 129,90",por:"a partir de R$ 59,90",feriado:"FERIADO 5% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/space-adventure?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🧚",n:"Parque Terra Mágica Florybal",d:"Magia, natureza e chocolate para toda a família",de:"R$ 180,00",por:"a partir de R$ 90,00",feriado:"FERIADO 30% OFF + Pipoca Grátis",url:"https://parksnet.com.br/destino/serra-gaucha/parque-terra-magica-florybal?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🚂",n:"Mundo a Vapor",d:"Máquinas e cenários do século XIX em Canela",de:"R$ 229,00",por:"a partir de R$ 99,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/mundo-a-vapor?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏀",n:"NBA Park",d:"Maior experiência da NBA no Brasil — 15+ atrações",de:"R$ 249,00",por:"a partir de R$ 124,50",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/nba-park?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎢",n:"Alpen Park",d:"Montanha russa, tirolesa, cinema 4D e muito mais",de:"R$ 260,00",por:"a partir de R$ 67,50",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/alpen-park?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎨",n:"Oficina Criamigos",d:"Experiência criativa e educativa para toda a família",de:"R$ 297,00",por:"a partir de R$ 119,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/oficina-criamigos?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏰",n:"Mini Mundo",d:"Réplicas 24x menores de monumentos mundiais",de:"R$ 128,00",por:"a partir de R$ 108,00",feriado:"FERIADO 5% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/mini-mundo?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"👧",n:"Vila da Mônica",d:"Parque temático da Turma da Mônica — diversão garantida",de:"R$ 358,00",por:"a partir de R$ 129,00",feriado:"FERIADO 5% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/vila-da-monica?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🫒",n:"Olivas de Gramado",d:"Fazenda com animais, vista incrível e cenários instagramáveis",de:null,por:"a partir de R$ 99,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/olivas?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏊",n:"Acquamotion",d:"Primeiro parque aquático indoor da América Latina",de:"R$ 179,90",por:"a partir de R$ 129,50",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/acquamotion?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"✨",n:"Lumni Experience",d:"Experiência imersiva de luz e arte interativa",de:"R$ 109,90",por:"a partir de R$ 54,90",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/lumni?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🌲",n:"Parque do Caracol",d:"25 hectares com Cascata de 131m e trilhas na mata",de:"R$ 179,90",por:"a partir de R$ 57,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/caracol?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎮",n:"Exceed Park",d:"5 andares, 20 atrações, VR e simuladores profissionais",de:"R$ 219,99",por:"a partir de R$ 109,99",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/exceed-park?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎫",n:"Passaporte Dreams (7 atrações)",d:"Combo com 7 atrações: Museu de Cera, Dream Cars e mais",de:"R$ 1.079,93",por:"a partir de R$ 309,99",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/passaporte-grupo-dreams-7-atracoes?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🌺",n:"Garden Park",d:"Jardins, trilhas e riachos em mata nativa — refúgio total",de:"R$ 110,00",por:"a partir de R$ 50,00",feriado:"FERIADO 5% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/garden-park?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🌸",n:"Mátria Parque das Flores",d:"Parque botânico com flores exuberantes e jardins temáticos",de:"R$ 129,00",por:"a partir de R$ 59,50",feriado:"FERIADO 5% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/matria-parque-das-flores?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🦕",n:"Vale dos Dinossauros Canela",d:"30+ dinossauros animatrônicos que se movem e emitem sons",de:null,por:"a partir de R$ 149,99",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/vale-dos-dinossauros-canela?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎅",n:"Aldeia do Papai Noel",d:"Pista de gelo, Trenó Voador e Laboratório de Doces",de:"R$ 100,00",por:"a partir de R$ 50,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/aldeia-do-papai-noel?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"💎",n:"Cristais de Gramado",d:"2.000m² de experiências sobre o cristal artístico",de:"R$ 78,00",por:"a partir de R$ 44,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/cristais-de-gramado?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍫",n:"Reino do Chocolate",d:"Loja, restaurante e vista para o Vale do Quilombo",de:"R$ 39,90",por:"a partir de R$ 19,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/reino-do-chocolate?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎠",n:"Mundo Lugano",d:"3 andares de atrações: VR, escalada e muito mais",de:"R$ 139,90",por:"a partir de R$ 99,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/mundo-lugano?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏎️",n:"UDrive Exotic Cars",d:"Dirija carros exóticos de luxo em circuito exclusivo",de:"R$ 1.150,00",por:"a partir de R$ 390,00",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/udrive-exotic?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"📸",n:"Selfie Gramado",d:"65+ cenários instagramáveis inspirados no Japão e no mundo",de:"R$ 149,99",por:"a partir de R$ 74,99",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/selfie-gramado?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎬",n:"Hollywood Dream Cars",d:"30+ veículos clássicos da era de ouro do cinema",de:"R$ 149,99",por:"a partir de R$ 74,99",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/hollywood-dream-cars?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🚗",n:"Museu do Automóvel de Canela",d:"Veículos restaurados em pleno funcionamento",de:null,por:"a partir de R$ 74,50",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/museu-do-automovel-de-canela?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏍️",n:"Dreams Motor Show",d:"Dezenas de motocicletas restauradas de marcas consagradas",de:"R$ 149,99",por:"a partir de R$ 74,99",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/dreams-motor-show?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"💑",n:"Jardim do Amor",d:"Chapel romântico com arcos de coração e jardins temáticos",de:null,por:"a partir de R$ 149,99",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/jardim-do-amor?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎪",n:"Big Land",d:"Brinquedos gigantes — único parque de gigantismo do mundo",de:"R$ 99,90",por:"a partir de R$ 59,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/big-land?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"👶",n:"Espaço Kids Sky Palace",d:"Espaço kids completo com brinquedos e atrações infantis",de:null,por:"a partir de R$ 70,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/sky-kids?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍬",n:"Fabulosa Máquina de Doces",d:"Piscina gigante de bolinha e atrações em cores vibrantes",de:null,por:"a partir de R$ 199,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/fabulosa-maquina-de-doces?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍫",n:"Chocoland",d:"Mundo do chocolate com degustações e atrações temáticas",de:"R$ 49,90",por:"a partir de R$ 10,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/chocoland-experiencias?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍾",n:"Vitivinícola Jolimont",d:"Tour pelos parreirais com vista do Morro do Calçado",de:null,por:"a partir de R$ 90,00",feriado:"FERIADO 10% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/jolimont?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🗿",n:"Museu de Cera Dreamland",d:"1º museu de cera da América Latina — Elvis, Marilyn e mais",de:"R$ 179,99",por:"a partir de R$ 89,99",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/museu-de-cera?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏎️",n:"Super Carros",d:"Carros esportivos, de luxo e de corrida com simuladores",de:"R$ 149,99",por:"a partir de R$ 74,99",feriado:"FERIADO 30% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/super-carros?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍷",n:"Museu do Vinho",d:"História e cultura da vitivinicultura gaúcha",de:"R$ 69,90",por:"a partir de R$ 30,75",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/museu-do-vinho?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🪨",n:"Pedras do Silêncio",d:"Área natural de contemplação com formações rochosas únicas",de:"R$ 70,00",por:"a partir de R$ 35,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/parque-pedras-do-silencio?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎈",n:"Canyons e Balões",d:"Voo de balão sobre os cânions da Serra Gaúcha",de:null,por:"a partir de R$ 439,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/canyons-e-baloes?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"📷",n:"Forever in Gramado (fotografia)",d:"Sessão fotográfica profissional em cenários deslumbrantes",de:null,por:"a partir de R$ 299,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/forever-in-gramado-fotografia?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🚂",n:"Tour Uva e Vinho - Maria Fumaça",d:"Percurso de trem histórico pela região vinícola gaúcha",de:"R$ 399,00",por:"a partir de R$ 391,84",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/maria-fumaca?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍕",n:"Kongo Pizzaria",d:"Pizzas artesanais com ingredientes da Serra Gaúcha",de:null,por:"a partir de R$ 89,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/kongo-pizzaria?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍺",n:"Cervejaria Farol",d:"Tour, almoço e vista 360º na Serra Gaúcha",de:null,por:"a partir de R$ 139,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/cervejaria-farol?bookingAgency=5248&cupom=PARKSNETEXTRA"},
];

function buildPromocoes(){
  const body=document.getElementById('promocoes-body');
  body.innerHTML=`
    <div style="padding:12px 18px 10px;background:#1a1a00;border-bottom:1px solid #2a2800;border-top:1px solid #2a2800;">
      <p style="font-size:11px;color:#c0a820;font-weight:700;">Desconto exclusivo do Guia do Pobre. Clique e garanta antes que acabe!</p>
    </div>
    ${parques.map(p=>{
      const temDe = p.de !== null;
      const temFeriado = p.feriado !== null;
      // Busca os dados completos da atração na lista todasAtracoes pelo nome
      const atr = todasAtracoes.find(a => {
        const an = a.nome.toLowerCase(), pn = p.n.toLowerCase();
        return an === pn || an.includes(pn) || pn.includes(an) ||
          an.split(' ').filter(w=>w.length>3).some(w=>pn.includes(w)) &&
          pn.split(' ').filter(w=>w.length>3).some(w=>an.includes(w));
      });
      const btnDesconto = p.url
        ? `<a href="${p.url}" target="_blank" rel="noopener" class="btn-comprar" style="display:inline-flex;text-decoration:none;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;stroke:#fff;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Comprar com Desconto</a>`
        : `<button class="btn-comprar" onclick="showToast('Buscando desconto...')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;stroke:#fff;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Comprar com Desconto</button>`;
      return `
      <div class="attr-card">
        <div class="attr-card-header" onclick="toggleAttrCard(this)">
          <div class="park-icon" style="flex-shrink:0;">${getParkIconSVG(p.e)}</div>
          <div class="attr-main">
            <h5>${p.n}</h5>
            <p>${p.d}</p>
          </div>
          <div class="attr-right">
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
              ${temDe ? `<span style="font-size:9px;color:#555;font-weight:700;"><s>${p.de}</s></span>` : ''}
              <span style="font-size:10px;font-weight:800;color:var(--yellow);">${p.por}</span>
              ${temFeriado ? `<span style="font-size:8px;font-weight:800;color:#fb923c;letter-spacing:0.3px;">${p.feriado}</span>` : ''}
            </div>
            <div class="attr-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
          </div>
        </div>
        <div class="attr-details">
          ${atr ? `
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><span class="attr-detail-text">${atr.desc}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><span class="attr-detail-text"><strong>Horários:</strong> ${atr.horario}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><span class="attr-detail-text"><strong>Preço normal:</strong> ${atr.preco.replace(/\n/g,'<br>')} · <strong style="color:var(--yellow);">Com desconto: ${p.por}</strong></span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><span class="attr-detail-text"><strong>Faixa etária:</strong> ${atr.faixa}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><span class="attr-detail-text"><strong>Endereço:</strong> ${atr.endereco}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg></div><span class="attr-detail-text">${atr.dicas}</span></div>
          ` : `
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><span class="attr-detail-text">${temDe ? `De <s style="color:#555">${p.de}</s> → ` : ''}<strong style="color:var(--yellow);">Por ${p.por}</strong></span></div>
          ${temFeriado ? `<div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><span class="attr-detail-text" style="color:#fb923c;font-weight:700;">${p.feriado}</span></div>` : ''}
          `}
          <div style="padding:12px 0 4px;">
            ${btnDesconto}
          </div>
        </div>
      </div>
    `}).join('')}
  `;
}

/* ═══ CONSULTA DE COMPRAS DO USUÁRIO ═══ */
let _minhasCompras = []; // cache local: ['roteiro_pdf', 'restaurantes_secretos']
let _comprasCarregadas = false;

async function verificarCompras() {
  try {
    // Pega o email do usuário logado (do Supabase Auth)
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user || !user.email) {
      _minhasCompras = [];
      _comprasCarregadas = true;
      return [];
    }

    const res = await fetch(`/api/minhas-compras?email=${encodeURIComponent(user.email)}`);
    if (!res.ok) {
      console.warn('[verificarCompras] Falha:', res.status);
      _minhasCompras = [];
      _comprasCarregadas = true;
      return [];
    }

    const data = await res.json();
    _minhasCompras = data.compras || [];
    _comprasCarregadas = true;
    console.log('[verificarCompras] Compras do usuário:', _minhasCompras);
    return _minhasCompras;
  } catch (err) {
    console.error('[verificarCompras] Erro:', err);
    _minhasCompras = [];
    _comprasCarregadas = true;
    return [];
  }
}

function jaComprou(produto) {
  return _minhasCompras.includes(produto);
}

/* ═══ BÔNUS DO POBRE (UPSELLS) ═══ */
const bonusUpsells = [
  {
    icon: 'livro',
    titulo: 'Roteiro Versão PDF',
    desc: 'Tenha uma versão completa do seu Roteiro Personalizado em PDF para mandar no grupo da família ou para utilizar em locais onde a internet não pega em Gramado.',
    preco: 'R$ 17,00',
    url: 'pay.kiwify.com.br/...',
    destaque: false
  },
  {
    icon: 'livro',
    titulo: 'Restaurantes Secretos Custo-Benefício',
    desc: 'Lista completa dos melhores restaurantes custo-benefício que te farão economizar até R$ 500 por dia em Gramado.',
    preco: 'R$ 17,00',
    url: 'pay.kiwify.com.br/...',
    destaque: false
  },
  {
    icon: 'economia',
    titulo: 'Combo: Roteiro PDF + Restaurantes Secretos',
    desc: 'Os dois bônus acima juntos por um preço especial. Economize comprando o combo.',
    preco: 'R$ 24,00',
    de: 'R$ 34,00',
    url: 'pay.kiwify.com.br/...',
    destaque: true
  }
];

function bonusIconSVG(tipo) {
  if (tipo === 'economia') {
    // ícone de cofrinho / economia
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-7.5-1-10 1-3 2.5-3 6.5-1 9 1 1 1 3 0 4h6v-2c.5 0 1 0 1.5-.2.5 1.2 2 2.2 3.5 2.2v-3.5c1-.5 2-1.5 2-3 0-2-1-3-2-3.5V5z"/><circle cx="16" cy="10" r="0.5" fill="currentColor"/></svg>`;
  }
  // ícone de livro (default)
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
}

async function buildBonus() {
  const body = document.getElementById('bonus-body');

  // Mostra estado de "carregando" enquanto consulta as compras
  body.innerHTML = `
    <div style="padding:40px 18px;text-align:center;color:#71717a;font-size:13px;">
      <div style="width:32px;height:32px;border:2px solid #2a2a2a;border-top-color:var(--yellow);border-radius:50%;margin:0 auto 12px;animation:spin 0.8s linear infinite;"></div>
      Carregando seus bônus...
    </div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;

  // Garante que sabemos quais compras o usuário tem
  if (!_comprasCarregadas) {
    await verificarCompras();
  }

  // Filtra: se já comprou um item individual, esconde o combo
  // (não faz sentido oferecer combo pra quem já tem parte)
  const jaTemAlgo = jaComprou('roteiro_pdf') || jaComprou('restaurantes_secretos');
  const itensVisiveis = bonusUpsells.filter(item => {
    if (item.titulo.toLowerCase().includes('combo') && jaTemAlgo) return false;
    return true;
  });

     body.innerHTML = `
    <div style="padding:14px 18px 12px;background:#1a1500;border-bottom:1px solid #2a2200;border-top:1px solid #2a2200;">
      <p style="font-size:11px;color:#f0c020;font-weight:700;line-height:1.5;">✨ Bônus exclusivos pra quem quer economizar de verdade em Gramado.</p>
    </div>
    <div style="padding:14px;display:flex;flex-direction:column;gap:12px;">
    
      ${itensVisiveis.map(item => {
        // Decidir qual botão mostrar baseado no que o usuário já comprou
        let botaoHTML = '';

        // Item 1: Roteiro PDF
        if (item.titulo.includes('Roteiro Versão PDF')) {
          if (jaComprou('roteiro_pdf')) {
            botaoHTML = `
              <button class="bonus-btn bonus-btn-liberado" onclick="baixarRoteiroPDF()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Baixar meu Roteiro PDF
              </button>`;
          } else {
            botaoHTML = `
              <a href="${item.url}" target="_blank" rel="noopener" class="bonus-btn" onclick="track && track('bonus_click',{item:'roteiro_pdf'});">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Quero esse bônus
              </a>`;
          }
        }
        // Item 2: Restaurantes Secretos
        else if (item.titulo.includes('Restaurantes Secretos')) {
          if (jaComprou('restaurantes_secretos')) {
            botaoHTML = `
              <button class="bonus-btn bonus-btn-liberado" onclick="openOverlay('overlay-restaurantes-secretos')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Ver restaurantes secretos
              </button>`;
          } else {
            botaoHTML = `
              <a href="${item.url}" target="_blank" rel="noopener" class="bonus-btn" onclick="track && track('bonus_click',{item:'restaurantes_secretos'});">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Quero esse bônus
              </a>`;
          }
        }
        // Item 3: Combo (só aparece se ainda não comprou nada)
        else {
          botaoHTML = `
            <a href="${item.url}" target="_blank" rel="noopener" class="bonus-btn" onclick="track && track('bonus_click',{item:'combo'});">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Quero esse bônus
            </a>`;
        }

        return `
        <div class="bonus-card${item.destaque ? ' bonus-card-destaque' : ''}">
          ${item.destaque ? '<div class="bonus-badge">MAIS ESCOLHIDO</div>' : ''}
          <div class="bonus-card-top">
            <div class="bonus-icon">${bonusIconSVG(item.icon)}</div>
            <div class="bonus-info">
              <h4 class="bonus-titulo">${item.titulo}</h4>
              <p class="bonus-desc">${item.desc}</p>
            </div>
          </div>
          <div class="bonus-card-bottom">
            <div class="bonus-preco-wrap">
              ${item.de ? `<span class="bonus-preco-de"><s>${item.de}</s></span>` : ''}
              <span class="bonus-preco-por">${item.preco}</span>
            </div>
            ${botaoHTML}
          </div>
        </div>
      `}).join('')}
    </div>
    <div style="padding:6px 18px 24px;">
      <p style="font-size:10.5px;color:#71717a;line-height:1.6;text-align:center;">🔒 Pagamento seguro via Kiwify · Acesso imediato após a compra</p>
    </div>
  `;
}

// Placeholder das funções que vamos criar nas próximas etapas
async function baixarRoteiroPDF() {
  console.log('[PDF] Iniciando...');

  if (!window._roteiroAtual || !Array.isArray(window._roteiroAtual) || window._roteiroAtual.length === 0) {
    showToast('Abra seu Roteiro Personalizado primeiro!');
    setTimeout(() => openOverlay('overlay-roteiro'), 800);
    return;
  }

  if (typeof html2pdf === 'undefined') {
    showToast('Erro: biblioteca de PDF não carregou');
    return;
  }

  showToast('Gerando seu PDF, aguarde...');

  let nomeUsuario = 'Viajante';
  try {
    const sb = window.supabase || window.supabaseClient;
    if (sb) {
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        nomeUsuario = user.user_metadata?.full_name || user.user_metadata?.display_name || user.user_metadata?.name || 'Viajante';
      }
    }
  } catch(e) {}

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const totalDias = window._roteiroAtual.length;

  // HTML simples sem SVGs
  let html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#222;width:680px;background:#fff;">
  <div style="text-align:center;padding:320px 40px;background:#0a0a0a;color:#fff;">
    <div style="font-size:13px;color:#f0c020;font-weight:700;letter-spacing:4px;margin-bottom:24px;">GUIA DO POBRE EM GRAMADO</div>
    <div style="width:60px;height:3px;background:#f0c020;margin:0 auto 40px;"></div>
    <div style="font-size:38px;font-weight:800;line-height:1.2;margin-bottom:20px;color:#fff;">Seu Roteiro<br>Personalizado</div>
    <div style="font-size:17px;color:#bbb;margin-bottom:60px;">Gramado e Canela</div>
     <table style="margin:20px auto;border-collapse:collapse;">
      <tr><td style="background:#1a1500;border:1px solid #3a2f08;border-radius:12px;padding:30px 40px;text-align:center;">
        <div style="font-size:12px;color:#aaaaaa;margin-bottom:10px;letter-spacing:1px;font-family:Arial,sans-serif;">PREPARADO PARA</div>
        <div style="font-size:26px;font-weight:700;color:#f0c020;margin-bottom:18px;font-family:Arial,sans-serif;">${nomeUsuario}</div>
        <div style="font-size:14px;color:#dddddd;margin-bottom:6px;font-family:Arial,sans-serif;">${totalDias} ${totalDias === 1 ? 'dia' : 'dias'} de roteiro</div>
        <div style="font-size:14px;color:#dddddd;font-family:Arial,sans-serif;">Gerado em ${dataAtual}</div>
      </td></tr>
    </table>
  </div>
  ${window._roteiroAtual.map(dia => `
    <div class="pdf-page-break" style="padding:50px 40px;background:#fff;">
      <div style="border-bottom:3px solid #f0c020;padding-bottom:20px;margin-bottom:30px;">
        <div style="font-size:12px;color:#f0c020;font-weight:700;letter-spacing:3px;">DIA ${dia.dia}</div>
        <div style="font-size:26px;font-weight:800;color:#0a0a0a;margin-top:8px;">${dia.titulo}</div>
        ${dia.sub ? `<div style="font-size:13px;color:#666;margin-top:8px;font-style:italic;">${dia.sub}</div>` : ''}
      </div>
      ${dia.atr.map((atracao, idx) => `
        <table style="width:100%;border-collapse:collapse;margin-bottom:14px;border-bottom:1px solid #eee;">
          <tr>
            <td style="width:40px;vertical-align:top;padding:14px 0;">
              <div style="background:${atracao.free ? '#22c55e' : '#f0c020'};color:${atracao.free ? '#fff' : '#1a1500'};width:32px;height:32px;border-radius:16px;text-align:center;line-height:32px;font-weight:800;font-size:15px;">${idx + 1}</div>
            </td>
            <td style="vertical-align:top;padding:14px 0 14px 12px;">
              <div style="font-weight:700;font-size:15px;color:#0a0a0a;margin-bottom:4px;">${atracao.n}</div>
              <div style="font-size:12px;color:#666;line-height:1.5;margin-bottom:8px;">${atracao.d}</div>
              <span style="background:${atracao.free ? '#dcfce7' : '#fef3c7'};color:${atracao.free ? '#166534' : '#92400e'};font-size:11px;font-weight:700;padding:5px 12px;border-radius:6px;white-space:nowrap;">${atracao.v}</span>
            </td>
          </tr>
        </table>
      `).join('')}
      ${dia.tip ? `
        <div style="margin-top:24px;background:#fef3c7;border-left:4px solid #f0c020;padding:16px 18px;border-radius:6px;">
          <div style="font-size:11px;font-weight:800;color:#92400e;letter-spacing:1.5px;margin-bottom:8px;">DICA DO POBRE</div>
          <div style="font-size:12.5px;color:#451a03;line-height:1.6;">${dia.tip}</div>
        </div>
      ` : ''}
    </div>
  `).join('')}
  <div class="pdf-page-break" style="text-align:center;padding:100px 40px;background:#0a0a0a;color:#fff;">
    <div style="font-size:30px;font-weight:800;color:#f0c020;margin-bottom:20px;">Boa viagem!</div>
    <div style="font-size:14px;color:#bbb;line-height:1.7;max-width:420px;margin:0 auto 40px;">Esperamos que esse roteiro torne sua viagem a Gramado inesquecivel e economica.</div>
    <div style="width:40px;height:2px;background:#f0c020;margin:0 auto 40px;"></div>
    <div style="font-size:11px;color:#888;letter-spacing:3px;">GUIA DO POBRE EM GRAMADO</div>
    <div style="font-size:10px;color:#666;margin-top:8px;">Roteiros personalizados</div>
  </div>
</div>
`;

  // ⭐ ABORDAGEM NOVA: criar um IFRAME isolado pra renderizar o PDF
  // Isso evita que o html2canvas pegue SVGs e estilos do app principal
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '600px';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-9999';
  iframe.style.opacity = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#fff;">' + html + '</body></html>');
  iframeDoc.close();

  console.log('[PDF] Iframe criado, aguardando renderização...');
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    const targetElement = iframeDoc.body.firstElementChild;
    console.log('[PDF] Chamando html2pdf no elemento do iframe...');

    await html2pdf()
      .set({
        margin: 0,
        filename: `Roteiro-Gramado-${nomeUsuario.replace(/\s/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'], before: '.pdf-page-break' }
      })
      .from(targetElement)
      .save();

    console.log('[PDF] PDF gerado com sucesso!');
    showToast('PDF baixado!');
    if (typeof track === 'function') track('pdf_baixado', {});
  } catch (err) {
    console.error('[PDF] Erro:', err);
    showToast('Erro ao gerar PDF: ' + err.message);
  } finally {
    document.body.removeChild(iframe);
  }
}

/* ═══ RESTAURANTES ═══ */
const restaurantes=[
  {e:"🎭",n:"Gatzz (fondue e espetáculo)",d:"Fondue com show ao vivo — experiência gastronômica completa",de:"R$ 398,00",por:"a partir de R$ 98,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/gatzz?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🫕",n:"Chalezinho Fondue",d:"O fondue mais aconchegante da Serra Gaúcha",de:null,por:"a partir de R$ 239,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/chalezinho?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍕",n:"Kongo Pizzaria",d:"Pizzas artesanais com ingredientes da Serra Gaúcha",de:null,por:"a partir de R$ 89,90",feriado:"FERIADO 10% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/kongo-pizzaria?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍷",n:"MLBK Fondue Malbec",d:"Fondue harmonizado com vinhos selecionados",de:"R$ 232,00",por:"a partir de R$ 58,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/malbec-restaurante?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🔭",n:"RF Vision Fondue",d:"Fondue com vista privilegiada da Serra",de:"R$ 269,00",por:"a partir de R$ 239,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/rf-vision?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍕",n:"Hector Pizzaria (rodízio)",d:"Rodízio de pizzas clássicas e napolitanas irresistíveis",de:"R$ 269,90",por:"a partir de R$ 89,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/hector-pizzaria?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🫕",n:"Versoi Fondue",d:"Fondue em ambiente sofisticado com culinária refinada",de:"R$ 119,90",por:"a partir de R$ 50,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/versoi-fondue?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🥩",n:"Cacique Steak Ember",d:"Brasa artesanal, defumação e sabores únicos",de:"R$ 269,90",por:"a partir de R$ 179,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/restaurante-cacique?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🚂",n:"Hector Ferrovia Secreta",d:"Experiência gastronômica temática inspirada na era dos trens",de:null,por:"a partir de R$ 199,90",feriado:null,url:"https://parksnet.com.br/passeios-e-ingressos-serra-gaucha-com-a-parksnet/ingresso-ferrovia-secreta?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🔥",n:"Era do Fogo Fondue",d:"Fondue clássico em ambiente rústico com lenha e brasa",de:"R$ 299,90",por:"a partir de R$ 249,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/era-do-fogo?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🤠",n:"Churrascaria Gramadense",d:"Churrasco gaúcho tradicional com cortes nobres",de:"R$ 139,90",por:"a partir de R$ 79,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/churrascaria-gramadense?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🚂",n:"Tour Uva e Vinho - Maria Fumaça",d:"Percurso de trem histórico pela região vinícola gaúcha",de:"R$ 399,00",por:"a partir de R$ 391,84",feriado:null,url:null},
  {e:"🏠",n:"Casa Di Pietro Fondue",d:"Fondue em ambiente acolhedor com sabor autêntico",de:"R$ 198,00",por:"a partir de R$ 49,50",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/casa-di-pietro?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🫕",n:"Tchê Pierre Fondue",d:"Fondue com tempero gaúcho e atendimento caloroso",de:"R$ 249,90",por:"a partir de R$ 124,95",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/tche-pierre?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🫕",n:"Chaplins Fondue",d:"Fondue com charme e culinária de qualidade",de:"R$ 99,00",por:"a partir de R$ 59,50",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/chaplins-fondue?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🫕",n:"Caquelon Fondue",d:"O clássico caquelon suíço em Gramado",de:null,por:"a partir de R$ 79,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/caquelon-fondue?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏰",n:"Château Allemand",d:"Gastronomia europeia em ambiente de castelo temático",de:null,por:"a partir de R$ 60,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/chateau-allemand?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍫",n:"Fondue do Chocoland",d:"Fondue de chocolate com atrações temáticas inclusas",de:"R$ 209,90",por:"a partir de R$ 85,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/chocoland?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🥩",n:"Rasen Braza Parrilla e Fondue",d:"Combinação perfeita de parrilla argentina e fondue suíço",de:"R$ 139,90",por:"a partir de R$ 129,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/rasen-braza?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍺",n:"Reino da Boêmia",d:"Cerveja artesanal com gastronomia de boteco premium",de:null,por:"a partir de R$ 50,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/reino-da-boemia?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🤠",n:"Garfo e Bombacha",d:"Culinária gaúcha autêntica com show cultural",de:"R$ 325,00",por:"a partir de R$ 162,50",feriado:"FERIADO 10% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/garfo-e-bombacha?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍕",n:"Herois da Pizza",d:"Pizzas artesanais de dar orgulho — heróis da massa",de:null,por:"a partir de R$ 159,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/herois-da-pizza?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍕",n:"La Bella Notte (rodízio de pizza)",d:"Rodízio de pizza italiana em ambiente aconchegante",de:null,por:"a partir de R$ 49,50",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/la-bella-notte?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍷",n:"Campo & Vinho",d:"Harmonização de vinhos com gastronomia regional",de:"R$ 99,90",por:"a partir de R$ 65,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/campo-vinho?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🏰",n:"Castelo Saint Andrews",d:"Jantar temático em castelo com culinária europeia",de:"R$ 250,00",por:"a partir de R$ 100,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/saint-andrews?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"☕",n:"Tour Raízes Coloniais - Café della Nonna",d:"Tour gastronômico pela cultura italiana da Serra",de:null,por:"a partir de R$ 119,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/tour-raizes-coloniais?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"☕",n:"Hora do Café Criamigos",d:"Café da manhã temático com experiência criativa",de:null,por:"a partir de R$ 150,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/cafe-criamigos?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🔍",n:"Jantar Caça ao Tesouro Criamigos",d:"Jantar com caça ao tesouro — diversão para toda a família",de:null,por:"a partir de R$ 129,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/jantar-caca-ao-tesouro?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍷",n:"Rodízio Mangiare no Museu do Vinho",d:"Rodízio de massas harmonizado com vinhos gaúchos",de:null,por:"a partir de R$ 69,90",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/museu-do-vinho?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍺",n:"Cervejaria Farol",d:"Cervejas artesanais premiadas com petiscos caprichados",de:null,por:"a partir de R$ 139,00",feriado:"FERIADO 10% OFF",url:"https://parksnet.com.br/destino/serra-gaucha/cervejaria-farol?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🍺",n:"Experiência Edelbrau",d:"Imersão na cultura cervejeira alemã em Gramado",de:null,por:"a partir de R$ 79,00",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/experiencia-edelbrau?bookingAgency=5248&cupom=PARKSNETEXTRA"},
  {e:"🎸",n:"Hard Rock Cafe",d:"Hambúrgueres e ambiente rock n' roll no coração de Gramado",de:"R$ 249,00",por:"a partir de R$ 104,50",feriado:null,url:"https://parksnet.com.br/destino/serra-gaucha/hard-rock-cafe?bookingAgency=5248&cupom=PARKSNETEXTRA"},
];

function buildRestaurantes(){
  const body=document.getElementById('restaurantes-body');
  body.innerHTML=`
    <div style="padding:12px 18px 10px;background:#0f1a0f;border-bottom:1px solid #1a2a1a;border-top:1px solid #1a2a1a;">
      <p style="font-size:11px;color:#2ecc71;font-weight:700;">Desconto exclusivo do Guia do Pobre. Clique e garanta sua mesa!</p>
    </div>
    ${restaurantes.map(r=>{
      const temDe = r.de !== null;
      const temFeriado = r.feriado !== null;
      return `
      <div class="attr-card">
        <div class="attr-card-header" onclick="toggleAttrCard(this)">
          <div class="park-icon" style="background:rgba(34,197,94,0.08);border-color:rgba(34,197,94,0.15);flex-shrink:0;">${getRestIconSVG(r.e)}</div>
          <div class="attr-main">
            <h5>${r.n}</h5>
            <p>${r.d}</p>
          </div>
          <div class="attr-right">
            <span style="font-size:10px;font-weight:800;color:var(--green);">${r.por}</span>
            <div class="attr-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
          </div>
        </div>
        <div class="attr-details">
          ${temDe ? `<div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><span class="attr-detail-text">De <s style="color:#555">${r.de}</s> → <strong style="color:var(--green);">Por ${r.por}</strong></span></div>` : `<div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><span class="attr-detail-text"><strong style="color:var(--green);">Por ${r.por}</strong></span></div>`}
          ${temFeriado ? `<div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><span class="attr-detail-text" style="color:#fb923c;font-weight:700;">${r.feriado}</span></div>` : ''}
          ${r.url
            ? `<a href="${r.url}" target="_blank" rel="noopener" class="btn-comprar" style="display:inline-flex;text-decoration:none;margin-top:12px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;stroke:#fff;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Ver com Desconto</a>`
            : `<button class="btn-comprar" onclick="showToast('Desconto em breve!')" style="margin-top:12px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;stroke:#fff;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Desconto em breve</button>`
          }
        </div>
      </div>
    `}).join('')}
  `;
}


/* ═══ ATRAÇÕES ═══ */
function getEmoji(nome, preco) {
  const n = nome.toLowerCase();
  if(n.includes('lago')) return '🌊';
  if(n.includes('mini mundo')) return '🏰';
  if(n.includes('snowland')) return '❄️';
  if(n.includes('jardin') || n.includes('le jardin')) return '🌸';
  if(n.includes('acqua')) return '🏊';
  if(n.includes('igreja') || n.includes('catedral')) return '⛪';
  if(n.includes('castelinho')) return '🏯';
  if(n.includes('rua coberta') || n.includes('largo') || n.includes('praça') || n.includes('rótula')) return '🛍️';
  if(n.includes('colono') || n.includes('etnias')) return '🌾';
  if(n.includes('viníc')) return '🍷';
  if(n.includes('vapor')) return '🚂';
  if(n.includes('roda gigante')) return '🎡';
  if(n.includes('caracol')) return '🌲';
  if(n.includes('bondinhos') || n.includes('aéreo')) return '🚡';
  if(n.includes('space') || n.includes('nasa')) return '🚀';
  if(n.includes('terra mágica') || n.includes('florybal')) return '🧚';
  if(n.includes('alpen')) return '🎢';
  if(n.includes('sky')) return '🏔️';
  if(n.includes('jolimont')) return '🍾';
  if(n.includes('dinos')) return '🦕';
  if(n.includes('caminhão')) return '🚛';
  if(n.includes('zoo')) return '🦁';
  if(n.includes('seganfredo') || n.includes('casa seg')) return '🍷';
  if(n.includes('olivas')) return '🫒';
  if(n.includes('mônica')) return '👧';
  if(n.includes('amor eterno') || n.includes('fonte')) return '❤️';
  if(n.includes('hollywood') || n.includes('dream cars')) return '🎬';
  if(n.includes('palácio') || n.includes('festival')) return '🎭';
  if(n.includes('fragram') || n.includes('perfume')) return '🌹';
  if(n.includes('selfie')) return '📸';
  if(n.includes('fabulosa') || n.includes('doces')) return '🍬';
  if(n.includes('super carro')) return '🏎️';
  if(n.includes('pórtico')) return '🚪';
  if(n.includes('garden')) return '🌺';
  if(n.includes('cera')) return '🗿';
  if(n.includes('exceed')) return '🎮';
  if(n.includes('chocolate') || n.includes('reino')) return '🍫';
  if(n.includes('papai noel') || n.includes('aldeia')) return '🎅';
  if(n.includes('dreams motor') || n.includes('moto')) return '🏍️';
  if(n.includes('major') || n.includes('nicoletti')) return '🏛️';
  if(n.includes('museo') || n.includes('museu')) return '🏛️';
  if(n.includes('automóvel')) return '🚗';
  if(n.includes('caro watson') || n.includes('escape')) return '🔍';
  if(n.includes('lugano')) return '🎠';
  if(n.includes('alemanha')) return '🍺';
  if(n.includes('largo da borges')) return '🌆';
  if(n.includes('cristais')) return '💎';
  if(n.includes('nba')) return '🏀';
  if(n.includes('maria fumaça') || n.includes('trem')) return '🚂';
  if(n.includes('bus tour') || n.includes('bustour')) return '🚍';
  if(n.includes('egípcio') || n.includes('egipcio')) return '🏺';
  if(n.includes('jardim do amor') || n.includes('jardim amor')) return '💑';
  if(n.includes('prawer') || n.includes('fábrica')) return '🍫';
  if(n.includes('linha bella') || n.includes('linha bonita') || n.includes('tour linha')) return '🌿';
  if(n.includes('ecoparque') || n.includes('sperry')) return '🌳';
  if(n.includes('beatles')) return '🎸';
  if(n.includes('gelado') || n.includes('mundo gelado')) return '🧊';
  if(n.includes('moda')) return '👗';
  if(n.includes('big land')) return '🎪';
  if(n.includes('estação campos')) return '🏙️';
  if(preco === 'Grátis') return '✨';
  return '📍';
}

const todasAtracoes = [
  {nome:"Lago Negro",horario:"Pedalinhos das 8h30 às 18h.",desc:"Lago Artificial de Águas profundas, o nome vem porque as árvores que o cercam vieram da Floresta Negra na Alemanha. Acesso gratuito — pedalinhos opcionais pagos no local.",duracao:"1 a 2 horas",preco:"Grátis (pedalinhos opcionais: Cisne R$ 50; Caravela R$ 60)",faixa:"Todas",endereco:"Gramado - Centro",dicas:"A entrada ao redor do lago é gratuita. Pedalinhos pagos diretamente no local.",pago:false},
  {nome:"Mini Mundo",horario:"9h às 17h",desc:"Parque de Miniaturas com réplicas 24 vezes menores que o tamanho real, oferecendo uma experiência interativa e educativa.",duracao:"1 a 2 horas",preco:"R$ 80",faixa:"Todas",endereco:"R. Horácio Cardoso, 219 - Planalto",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Snowland",horario:"10h às 17h. Fechado às quartas-feiras.",desc:"Parque de neve indoor com pistas de esqui, patinação e atrações em gelo. Experiência única no Brasil.",duracao:"3 a 4 horas",preco:"R$ 199",faixa:"Todas",endereco:"Rodovia RS-235, 9009 - Carazal",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Le Jardin",horario:"Terça a domingo das 09h30 às 17h30.",desc:"Parque de lavandas com jardins ornamentais, loja de produtos à base de lavanda e ambiente tranquilo para relaxamento.",duracao:"1 a 2 horas",preco:"Kids (00-06): Isento\nKids (07-12): R$ 20\nAdulto: R$ 30 (promocional)\nSênior (60+): R$ 20",faixa:"Todas",endereco:"RS-115, 37700 - Várzea Grande",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Acquamotion",horario:"10h às 18h. Fechado às segundas-feiras.",desc:"O primeiro parque aquático indoor da América Latina. Piscinas de água quente, loja e restaurante.",duracao:"4 a 5 horas",preco:"R$ 150",faixa:"Todas",endereco:"Estrada Municipal Linha Ávila, 501",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Igreja Matriz De São Pedro",horario:"8h às 18h30. Missas: Dom 8h, 10h30 e 18h30 / Seg a Sex 18h30",desc:"Uma das igrejas mais belas de Gramado, com arquitetura típica da colonização alemã.",duracao:"15 a 30 minutos",preco:"Grátis",faixa:"Todas",endereco:"Av. Borges de Medeiros, 2659 - Centro",dicas:"Verifique horários de missas.",pago:false},
  {nome:"Castelinho Do Caracol",horario:"9h30 às 13h e das 14h20 às 17h30",desc:"Casa histórica com mobiliário vintage preservado, loja de presentes e 2 salas de chá que servem torta de maçã. Foi uma das primeiras residências de Canela.",duracao:"50 minutos",preco:"Adulto: R$ 20\nSênior/Escolar: R$ 10\nCriança até 6 anos: Isento",faixa:"Todas",endereco:"RS-466, Estrada Parque dos Pinheiros, s/n - Km 03, Canela",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Rua Coberta",horario:"24h (maioria das lojas até 19h, restaurantes até mais tarde)",desc:"Espaço com restaurantes, cafeterias e lojas. Palco de apresentações culturais e do Festival de Cinema.",duracao:"30 minutos",preco:"Grátis",faixa:"Todas",endereco:"Rua Madre Verônica, s/nº, Centro",dicas:"Verifique horários dos estabelecimentos.",pago:false},
  {nome:"Fornos e Casa Do Colono",horario:"9h às 18h30",desc:"Na Praça das Etnias: pães e cucas nos fornos de barro, produtos coloniais, verduras e muito mais.",duracao:"45 minutos",preco:"Grátis",faixa:"Todas",endereco:"Praça das Etnias - Av. Borges de Medeiros, s/n - Centro",dicas:"Verifique horários dos estabelecimentos.",pago:false},
  {nome:"Catedral De Pedra",horario:"Seg-Sex: 08h-11h30 e 13h30-18h / Sáb: 08h-11h30",desc:"Eleita uma das 7 maravilhas do Brasil em 2010. Missas: Seg-Sex 18h30, Sáb 18h, Dom 8h, 10h30 e 18h.",duracao:"30 a 40 minutos",preco:"Grátis",faixa:"Todas",endereco:"Praça Matriz, 69 - Centro, Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:false},
  {nome:"Vinícola Ravanello",horario:"Seg-Sex: 10h ou 15h / Sáb: 11h ou 15h30",desc:"Experiência completa da vinha ao envase, passando por recepção e seleção de uvas, prensagem e fermentação. Inclui degustação.",duracao:"2 horas",preco:"R$ 150\nConsultar: (54) 2700-0102",faixa:"Apenas maiores de 8 anos",endereco:"Rodovia ERS-235 Pórtico, Gramado",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Mundo A Vapor",horario:"9h às 17h. Fechado às quartas.",desc:"Parque temático de máquinas movidas a vapor, com réplicas em miniatura de máquinas industriais históricas.",duracao:"1 a 1,5 horas",preco:"R$ 90",faixa:"Todas",endereco:"Avenida Don Luiz Guanella, 1247 – Carniel – Canela",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Roda Gigante",horario:"10h às 19h",desc:"Roda Gigante de 52 metros de altura. Percurso de 20 minutos com capacidade para 6 por cabine.",duracao:"20 minutos",preco:"R$ 65",faixa:"Todas",endereco:"Avenida Don Luiz Guanella, 1247 – Carniel – Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Parque Do Caracol",horario:"10h as 17h",desc:"Unidade de conservação com 25 hectares a 7 km de Canela. Na Serra Gaúcha, abriga a famosa Cascata do Caracol.",duracao:"4h a 5h",preco:"R$ 115 adulto (criança meia)",faixa:"Todas",endereco:"Rodovia RS 466, km 0 - Caracol, Canela",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Bondinhos Aéreos Canela",horario:"09h às 17h",desc:"Passeio aéreo com início na estação central. No local há lanchonete, lojas e mirante para a Cascata do Caracol.",duracao:"1 hora",preco:"R$ 100",faixa:"Maiores de 6 anos",endereco:"Rua Constante Félix Orsolin, 699 - Caracol, Canela",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Space Adventure (Parque Da Nasa)",horario:"10h às 17h. Fechado às quartas.",desc:"Salas interativas, cinema de introdução à viagem do homem à Lua, mais de 270 itens originais da NASA e planetário.",duracao:"2 horas",preco:"Combo (Space + Planetário): R$ 129,90\nSpace Adventure: R$ 99,90\nPlanetário: R$ 60,00",faixa:"Todas",endereco:"Av. Don Luiz Guanella, 960 - Vila Suica, Canela",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Terra Mágica Florybal",horario:"9h30 às 16h30",desc:"Magos, duendes, fadas, dinossauros, chocolate e natureza. Um parque mágico para toda a família.",duracao:"3 a 4 horas",preco:"Adulto: R$ 160\n0-3 anos: Isento\n4-15 anos: R$ 80\nIdoso/Prof/Bombeiro: R$ 80",faixa:"Todas",endereco:"Rodovia RS-466, 1630 - Jardim dos Pinheiros II, Canela",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Alpen Park",horario:"9h às 17h20",desc:"Montanha russa, trenó, torre de queda livre, cinema 4D e 5D, bate-bate, piscina de bolinha, arvorismo e quadriciclo.",duracao:"3 a 4 horas",preco:"Kids: R$ 50\nAdulto: R$ 120",faixa:"Todas",endereco:"Rodovia Arnaldo Oppitz, 901 - São João, Canela",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Skyglass",horario:"10h às 18h. Fechado às quartas.",desc:"Plataforma de vidro que avança 35m sobre o Vale da Ferradura. Brinquedo 'Abusado' com cadeiras suspensas abaixo da plataforma.",duracao:"2 a 3 horas",preco:"R$ 110",faixa:"Maiores de 6 anos",endereco:"R. Constante Félix Orsolin, 9800 - Caracol, Canela",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Vinícola Jolimont",horario:"09h às 17h",desc:"Parreirais, deck com vista do Morro do Calçado e passeios guiados pela vinícola.",duracao:"1 a 2 horas",preco:"Tour Premium: R$ 238\nTour Jolimont (sem guia): R$ 129",faixa:"Adultos",endereco:"Estrada Morro Calçado, 1420 - Morro Calçado, Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Vale Dos Dinossauros",horario:"9h às 17h30",desc:"Mais de 30 espécies de dinossauros animatrônicos que se movem e emitem sons. Loja com souvenirs.",duracao:"1 a 1,5 horas",preco:"Adulto: R$ 99 (promo)\nCriança (4-12): R$ 49,50\nMelhor Idade (+60): R$ 49,50\nAté 3 anos: Isento",faixa:"Infantil",endereco:"RS 466 - Bosque Sinoserra, Canela",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Museu Do Caminhão",horario:"9h às 18h",desc:"American Old Trucks — único museu de caminhões do Brasil, com mais de 60 veículos antigos.",duracao:"1 hora",preco:"Adulto: R$ 80 (promo)\nCriança (4-12): R$ 45\nMelhor Idade (+60): R$ 40",faixa:"Todas",endereco:"Rodovia ERS-466, 1620 - Caracol, Canela",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Gramado Zoo",horario:"10h às 16h de quarta a domingo",desc:"Animais da fauna brasileira em percurso de 1.800 metros com informações educativas.",duracao:"2 a 2,5 horas",preco:"R$ 95",faixa:"Todas",endereco:"ERS-115, km-35 - Várzea Grande",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Casa Seganfredo",horario:"9h às 17h",desc:"Boutique de vinhos com capacidade para 10.000 garrafas. Degustação em região turística de Gramado.",duracao:"1h30",preco:"R$ 90 (6 rótulos)\nR$ 110 (8 rótulos + queijos)\nAgende: (54) 9 9677-2255",faixa:"Adultos",endereco:"Linha Belvedere, 600 – Estrada Serra Grande – Gramado",dicas:"Use calçados confortáveis e leve água.",pago:true},
  {nome:"Parque Olivas De Gramado",horario:"10h30 às 18h",desc:"Parque de Olivas com fazenda com animais, vista incrível, cenários instagramáveis e lanche.",duracao:"4 horas",preco:"A partir de R$ 110",faixa:"Todas",endereco:"Rua Vereador José Alexandre Benetti, 1808 - Linha Nova",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Vila Da Mônica Gramado",horario:"10h às 17h30",desc:"Parque infantil com brinquedos e atrações temáticos da Turma da Mônica. Opções de lanche.",duracao:"4 horas",preco:"R$ 190",faixa:"Infantil",endereco:"R. Germano Boff, 611 - Carazal",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Fonte Amor Eterno",horario:"24h",desc:"Inspirada na Fontana di Trevi, ponto romântico entre a Igreja São Pedro e o Boulevard São Pedro. Casais prendem cadeados coloridos.",duracao:"15 minutos",preco:"Grátis",faixa:"Todas",endereco:"Av. Borges de Medeiros, 2659",dicas:"Ótimo para fotos ao amanhecer.",pago:false},
  {nome:"Hollywood Dream Cars",horario:"9h às 18h",desc:"Mais de 30 veículos clássicos da era de ouro do cinema. Ambiente inspirado em Hollywood.",duracao:"45 min a 1 hora",preco:"Adulto (+13): R$ 99\nCriança (4-12): R$ 49,50\nMelhor Idade (+60): R$ 49,50",faixa:"Todas",endereco:"Avenida das Hortênsias, R. Vigilante, 4151",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Praça Das Etnias",horario:"24h",desc:"Próxima ao Centro de Gramado, reúne casas que representam os povos colonizadores: alemão, italiano e açoriano.",duracao:"1h a 2h",preco:"Grátis",faixa:"Todas",endereco:"Av. Borges de Medeiros, 1848 - Centro",dicas:"Verifique horários dos fornos e loja colonial.",pago:false},
  {nome:"Pórtico",horario:"24h",desc:"Construções que marcam a chegada em Gramado, tanto pela via Taquara quanto por Nova Petrópolis.",duracao:"30 minutos",preco:"Grátis",faixa:"Todas",endereco:"Entrada de Gramado",dicas:"Parada obrigatória para fotos na chegada.",pago:false},
  {nome:"Garden Park",horario:"10h às 18h",desc:"Jardins, alamedas de Carvalhos Canadenses, trilhas e riachos em mata nativa. Refúgio de contemplação.",duracao:"3 a 4 horas",preco:"R$ 110 (ou R$ 130 no dia)",faixa:"Todas",endereco:"Estr. Profa. Elvira Apolo Benetti, 1699 - Jardim Bela Vista",dicas:"Use calçados confortáveis e leve água.",pago:true},
  {nome:"Museu De Cera",horario:"8h às 18h30",desc:"Primeiro museu de cera voltado ao entretenimento da América Latina. Elvis, Marilyn Monroe, Jack Sparrow e muito mais.",duracao:"1h a 1h30",preco:"Adulto: R$ 155\nCriança (4-12): R$ 77,50\nMelhor Idade (+60): R$ 77,50",faixa:"Todas",endereco:"Av. das Hortênsias, 5507 - Ipê Amarelo",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Exceed",horario:"11h às 18h30",desc:"5 andares, 20 atrações e 50+ jogos. Arenas VR, simuladores, PlayStation 5 com telões e muito mais.",duracao:"3 horas",preco:"Baixa temporada: R$ 90\nAlta temporada: R$ 190",faixa:"Crianças acima de 3 anos",endereco:"Av. das Hortênsias, 4510",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"O Reino Do Chocolate",horario:"9h às 19h",desc:"Espaço da fábrica Caracol com loja, restaurante e vista para o Vale do Quilombo.",duracao:"1 a 2 horas",preco:"R$ 40",faixa:"Todas",endereco:"Av. das Hortênsias, 5382 - Carniel",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Aldeia Do Papai Noel",horario:"11h às 20h",desc:"Trenó Virtual, Trenó Voador, Bosque Gelado com pista de gelo e Laboratório de Doces. Temática de Natal o ano todo.",duracao:"1 a 2 horas",preco:"R$ 48",faixa:"Infantil",endereco:"Av. Borges de Medeiros, 2300 - Centro",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Dreams Motor Show Gramado",horario:"8h às 18h30",desc:"Museu de motocicletas incríveis de marcas consagradas. Dezenas de máquinas restauradas.",duracao:"1 a 1h30",preco:"Adulto (+13): R$ 99\nCriança (4-12): R$ 49,50\nMelhor Idade (+60): R$ 49,50",faixa:"Todas",endereco:"Av. das Hortênsias, 5507 - Subsolo",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Praça Major Nicoletti",horario:"24h",desc:"Praça rodeada de lojas, restaurantes e cafés. Ideal para um chocolate quente no inverno.",duracao:"15 a 30 minutos",preco:"Grátis",faixa:"Todas",endereco:"Avenida Borges de Medeiros s/nº, Centro",dicas:"Visite ao entardecer para o melhor movimento.",pago:false},
  {nome:"Palácio Dos Festivais",horario:"11h às 19h",desc:"Local do acendimento das luzes no Natal. Frente tem o 'Caminho das Estrelas' inspirado na calçada da fama. Sede do Festival de Cinema.",duracao:"45 a 60 minutos",preco:"Meia-entrada: R$ 10\nNormal: R$ 20",faixa:"Todas",endereco:"Av. Borges de Medeiros, 2697 - Centro",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Fragram - Museu Do Perfume",horario:"09h às 17h",desc:"Museu gratuito com história da perfumaria mundial desde a Antiguidade, com destaques para civilizações e personagens históricos.",duracao:"30 a 45 minutos",preco:"Grátis",faixa:"Adultos",endereco:"Loteamento Tirol, RS-235, 33230 - Pórtico",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:false},
  {nome:"Selfie Gramado",horario:"09h às 18h",desc:"Mais de 65 cenários inspirados em locais famosos do Japão e do mundo, pensado para criação de conteúdo.",duracao:"1 hora",preco:"Adulto (+13): R$ 99\nCriança (4-12): R$ 49,50\nMelhor Idade (+60): R$ 49,50",faixa:"Todas",endereco:"Av. das Hortênsias, 5855 - Carniel",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"A Fabulosa Máquina de Doces",horario:"10h às 20h",desc:"Piscina gigante de bolinha, Garra Humana suspensa por cabos, muitas cores e atrações. Entrada gratuita, algumas atrações pagas.",duracao:"1h30 a 2h",preco:"Entrada Gratuita (algumas atrações são pagas)",faixa:"Infantil",endereco:"Av. das Hortênsias, 4953 - Carniel",dicas:"Chegue na abertura para aproveitar melhor.",pago:false},
  {nome:"Super Carros",horario:"09h às 18h",desc:"Museu com carros esportivos, de luxo e de corrida, simuladores e loja de roupas esportivas.",duracao:"1h a 1h30",preco:"Salão: R$ 99\nCombo Premium (simulador + passeio + ingresso + foto): R$ 150",faixa:"Todas",endereco:"Av. das Hortênsias, 4635 - Estrada Gramado/Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Rótula Das Bandeiras",horario:"24h",desc:"Praça com as bandeiras de todos os estados brasileiros hasteadas. Homenagem simbólica à diversidade brasileira.",duracao:"20 a 30 minutos",preco:"Grátis",faixa:"Todas",endereco:"Entrada de Gramado",dicas:"Boa parada para fotos.",pago:false},
  {nome:"Caro Watson - Escape Game",horario:"12h às 20h",desc:"Aventura onde você tem 60 minutos para roubar o Maior Diamante do Mundo ou Salvar Gramado de um atentado terrorista.",duracao:"1 hora",preco:"R$ 80",faixa:"Todas",endereco:"Av. das Hortênsias, 3607 - Vila Suica",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Mundo Lugano",horario:"10h às 23h",desc:"Três andares com máquinas de pelúcia, simuladores de realidade virtual, parede de escalada e sala exclusiva.",duracao:"4h a 5h",preco:"R$ 120",faixa:"Infantil",endereco:"Av. Borges de Medeiros, 2497 - Centro",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Parque Alemanha Encantada",horario:"10h às 18h",desc:"Inspirada nos contos dos Irmãos Grimm. Chopes e pratos alemães em parque temático. Entrada gratuita, algumas atrações pagas.",duracao:"1 hora",preco:"Entrada Gratuita (algumas atrações são pagas)",faixa:"Todas",endereco:"R. Vinte e Cinco de Julho, 713 - Planalto",dicas:"Chegue na abertura para aproveitar melhor.",pago:false},
  {nome:"Largo Da Borges",horario:"24h",desc:"Centro de convivência com praça, espaço gourmet, lojas e restaurantes. Valoriza a gastronomia local.",duracao:"1h a 1h30",preco:"Grátis",faixa:"Todas",endereco:"Av. Borges de Medeiros, 2727 - Centro",dicas:"Verifique horários dos restaurantes.",pago:false},
  {nome:"Cristais De Gramado",horario:"8h30 às 17h",desc:"Mais de 2.000m² de experiências sobre o cristal artístico. Jornada do conhecimento imersiva.",duracao:"30 min a 1 hora",preco:"R$ 50",faixa:"Todas",endereco:"Rod. RS 115, Km 36 - Várzea Grande",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"NBA Park",horario:"10h às 17h",desc:"Maior experiência da NBA no Brasil. 15+ atrações, restaurante temático, museu, NBA Store, café e espaço gamer.",duracao:"3 a 4 horas",preco:"Adulto (+12): R$ 159\nCriança (4-11): R$ 99,50\nMelhor Idade (+60)/Estudante: R$ 99,50",faixa:"Todas",endereco:"Av. das Hortênsias, 4795 - Carniel",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Trem Maria Fumaça",horario:"Saídas: 09h, 11h, 14h, 16h e 18h40",desc:"Percurso de 23km de Gramado a Bento Gonçalves, Garibaldi e Carlos Barbosa em trem histórico.",duracao:"1h30",preco:"R$ 220",faixa:"Adultos",endereco:"Estação de Gramado",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Bus Tour",horario:"Passa em frente ao Mini Mundo: 09h24, 10h23, 11h12, 12h12, 13h02, 14h02, 14h52, 15h52, 16h42, 17h42",desc:"Ônibus que passa por diversas atrações em Gramado e Canela. Passageiros ganham desconto especial nas atrações.",duracao:"Dia inteiro",preco:"R$ 98",faixa:"Todas",endereco:"Diversas paradas em Gramado e Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Museu Egipcio",horario:"9h às 18h",desc:"Visão ampla da história egípcia com mais de 400 peças, apresentando três milênios de civilização.",duracao:"1 hora",preco:"R$ 70",faixa:"Todas",endereco:"Rodovia ERS-466, 5201 - Caracol, Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Jardim do Amor",horario:"9h às 18h",desc:"Chapel e jardim romântico com arcos em forma de coração e fonte. Inspirado no Jardim do Amor da Itália.",duracao:"45 min a 1 hora",preco:"Adulto (+13): R$ 99\nCriança (4-12): R$ 49,50\nMelhor Idade (+60): R$ 49,50",faixa:"Adultos",endereco:"Av. das Hortênsias, 765 - Centro",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Fábrica Prawer",horario:"Manhã: 9h30, 10h10, 10h50 / Tarde: 13h20 às 16h00",desc:"Passeio guiado pelo processo artesanal de produção de chocolates com degustação ao final.",duracao:"30 minutos",preco:"Seg-Sex: R$ 49\nSáb/Dom/Feriado: R$ 39\nWhatsApp: 54 99919-8213",faixa:"Todas",endereco:"Av. das Hortênsias, 4100 - Estrada Gramado/Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Tour Linha Bella",horario:"Seg/Qua/Sex (baixa temp.) e todos os dias (julho e nov-jan). Embarque às 07h45",desc:"Tour pelo interior de Gramado passando por vinícola, Casa Centenária, Cantina Italiana e experiência cultural.",duracao:"6 horas",preco:"R$ 300",faixa:"Adultos",endereco:"Linha Bonita, Gramado",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Museu do Automóvel",horario:"09h às 18h",desc:"Veículos restaurados em pleno funcionamento, vasto acervo e publicidade de todas as épocas.",duracao:"1 hora",preco:"R$ 72",faixa:"Todas",endereco:"Praça das Nações, 281 - Q.ta da Serra, Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Big Land",horario:"13h às 18h",desc:"Brinquedos interativos gigantes — primeiro parque com temática de gigantismo no mundo. Totalmente coberto.",duracao:"1h a 1h30",preco:"R$ 85",faixa:"Crianças",endereco:"Após último vagão do trem, R. Ernesto Urbani, 7 - Canela",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Estação Campos Canela",horario:"10h às 20h",desc:"Centro cultural, gastronômico e comercial com 25 operações em funcionamento. A 'Rua Coberta de Canela'.",duracao:"30 min a 1 hora",preco:"Grátis",faixa:"Todas",endereco:"Largo Benito Urbani - Centro, Canela",dicas:"Verifique horários dos estabelecimentos.",pago:false},
  {nome:"Ecoparque Sperry",horario:"Terça a domingo, das 9h às 17h",desc:"Área de preservação com Mata Atlântica, riachos, cachoeiras e cânions para ecoturismo.",duracao:"1h a 1h30",preco:"Adultos: R$ 45\nCrianças: R$ 22,50\nIngressos no parque",faixa:"Todas",endereco:"Vale do Quilombo - Linha 28, Estrada Profa. Elvira A. Benetti, km 05",dicas:"Ideal para famílias; vá cedo para evitar filas.",pago:true},
  {nome:"Museu dos Beatles",horario:"10h às 17h",desc:"Único Museu dos Beatles do Brasil. Tour cronológico pela vida e obra dos 4 garotos de Liverpool.",duracao:"1h a 1h30",preco:"R$ 30",faixa:"Todas",endereco:"Av. Don Luiz Guanella, 521 - São José, Canela",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Mundo Gelado",horario:"9h às 18h",desc:"Caverna com esculturas de gelo: sofá, mesa, cama e trenó. Interação total com as peças.",duracao:"1h a 1h30",preco:"R$ 65",faixa:"Todas",endereco:"Rodovia RS-466, 3915, Bairro Caracol",dicas:"Verifique horários e compre ingressos antecipadamente.",pago:true},
  {nome:"Museu da Moda",horario:"9h30 às 18h",desc:"Acervo de peças originais com 3.500m² e 4.000 anos da história do vestuário feminino. Viagem no tempo.",duracao:"1h a 1h30",preco:"Individual: R$ 98\nCasal: R$ 180\nMenores de 7 anos: Isento\nIngressos no parque",faixa:"12+",endereco:"Av. Ernani Kroeff Fleck, 1810 - Vila Suica, Canela",dicas:"Chegue na abertura para aproveitar melhor.",pago:true},
  {nome:"Lumni Experience",horario:"18h às 00h (todos os dias)",desc:"Primeiro parque noturno de Gramado com mais de 500 mil luzes em 12 hectares. Campo Iluminado, Jardim das Tulipas, Túnel das Luzes e Floresta Encantada em experiência sensorial única.",duracao:"2 a 3 horas",preco:"Adulto: R$ 139\nCriança/Idoso: R$ 70\nAté 3 anos: Isento",faixa:"Todas",endereco:"Rua Semilda Fisch Riegel, 2900 - Linha Tapera, Gramado",dicas:"Vista experiência noturna. Leve casaco pois é ao ar livre.",pago:true},
  {nome:"Oficina da Diversão - Mundo Criamigos",horario:"10h às 17h (fechado quartas na baixa temporada)",desc:"Parque temático indoor com mais de 7.000m² e 50 atrações interativas inspiradas nos personagens do Clubinho Criamigos. Tobogã gigante, carrossel de unicórnios, piscina de ursos e muito mais.",duracao:"3 a 4 horas",preco:"A partir de R$ 120\nCriança 1-3 anos: R$ 19,90\nAté 11 meses: Isento",faixa:"Infantil",endereco:"Rua São Pedro, 663 - Centro, Gramado",dicas:"Ingresso inclui par de meias. Chegue cedo para aproveitar todas as atrações.",pago:true},
  {nome:"Sky Kids Mega Park",horario:"10h às 20h (todos os dias)",desc:"Maior espaço kids indoor da Serra Gaúcha com mais de 230m². Brinquedão, jogos eletrônicos, mini quadra de basquete e futebol, casinha na árvore e área baby.",duracao:"2 a 3 horas",preco:"A partir de R$ 39,90",faixa:"Infantil",endereco:"Rodovia RS-115, Km 38 - Bairro Três Pinheiros, Gramado",dicas:"Ótimo para dias de chuva. Localizado junto ao Sky Palace Hotel.",pago:true},
  {nome:"RF Vision - Restaurante Giratório",horario:"Almoço e Jantar (confirme horários no site)",desc:"Primeiro e único restaurante panorâmico giratório de Gramado. Torre de 30m com vista 360° para o Vale do Quilombo. Culinária mediterrânea e sequência de fondue com show de neve.",duracao:"1h30 a 2h",preco:"Almoço: R$ 80 por pessoa (convertido em consumo)\nJantar com fondue: a partir de R$ 150",faixa:"Adultos",endereco:"Rua Arthur Raimann, 87 - Jardim Bela Vista, Gramado",dicas:"Reserve com antecedência. No jantar têm show de neve. Vistas incríveis.",pago:true},
  {nome:"Pedras do Silêncio",horario:"9h30 às 18h (todos os dias)",desc:"Museu a céu aberto em Nova Petrópolis com mais de 80 esculturas em arenito contando a história da imigração germânica ao longo de 400 metros em meio à natureza.",duracao:"1 hora",preco:"Adulto: R$ 50\nMeia entrada: R$ 25\nAté 6 anos: Isento",faixa:"Todas",endereco:"Rua Emílio Dinnebier Filho, 560 - Linha Brasil, Nova Petrópolis",dicas:"Percurso totalmente acessível. Ótimo dia de sol. A 13km de Gramado.",pago:true},
  {nome:"Canyons e Balões",horario:"Nascer do sol (horário confirmado no dia anterior)",desc:"Voo de balão a gás sobrevoando os deslumbrantes Cânions de Cambará do Sul. Experiência com espumante, fotos e vídeos inclusos. Transporte saindo de Gramado e Canela.",duracao:"Dia inteiro (inclui deslocamento)",preco:"R$ 999 por pessoa (com transporte)\nConsulte para grupos",faixa:"Adultos",endereco:"Partida dos hotéis de Gramado/Canela até Praia Grande-SC",dicas:"Sujeito a condições climáticas. Reserve com antecedência. Experiência inesquecível!",pago:true},
  {nome:"Chocoland Experiências",horario:"Todos os dias às 17h (Alquimia) / Ter-Dom 18h30 às 23h (Fondue)",desc:"Experiências no Hotel Chocoland: Alquimia Chocolover (crie sua própria barra de chocolate), Tour pelo Castelo e Fondue Temático com show no primeiro hotel temático de chocolate do Brasil.",duracao:"1 a 2 horas",preco:"Alquimia Chocolover: a partir de R$ 49\nTour pelo Castelo: a partir de R$ 40\nFondue Temático: a partir de R$ 85",faixa:"Todas",endereco:"Av. Borges de Medeiros, 4877 - Centro, Gramado",dicas:"Reserve com antecedência. Ótimo para crianças e adultos.",pago:true},
  {nome:"Mátria Parque das Flores",horario:"9h30 às 17h (todos os dias)",desc:"50 hectares com 30 jardins temáticos a céu aberto em São Francisco de Paula. Lago Azul com passeio de barco gratuito, gastronomia especial, arquitetura impressionante e mais de 300 espécies vegetais.",duracao:"4 horas",preco:"A partir de R$ 70\nAté 5 anos: Isento",faixa:"Todas",endereco:"RS-235, Km 68 - São Francisco de Paula (entre Canela e SFP)",dicas:"Use roupas e calçados confortáveis. Verifique clima. A ~30km de Canela.",pago:true},
  {nome:"Passaporte Grupo Dreams 7 Atrações",horario:"Conforme cada atração do grupo",desc:"Passaporte que dá acesso a 7 atrações do Grupo Dreams: Museu de Cera, Harley Motor Show, Hollywood Dream Cars, Dreams Motor Show, Super Carros, Selfie Gramado e Jardim do Amor. Máximo custo-benefício.",duracao:"Dia inteiro",preco:"Consulte preço na Parksnet",faixa:"Todas",endereco:"Diversas atrações da Av. das Hortênsias - Gramado",dicas:"Ideal para quem quer visitar múltiplas atrações. Economize comprando o combo.",pago:true},
  {nome:"UDrive Exotic",horario:"9h às 18h",desc:"Dirija carros exóticos e esportivos de luxo pelas estradas da Serra Gaúcha. Experiência de condução com carros especiais em um cenário deslumbrante.",duracao:"30 min a 1 hora",preco:"A partir de R$ 150 (consulte combos)",faixa:"Habilitados (+18 anos)",endereco:"Gramado, RS (consulte ponto de encontro)",dicas:"Necessário CNH válida. Experiência única para apreciadores de carros esportivos.",pago:true},
  {nome:"Happy Valen",horario:"10h às 18h",desc:"Parque interativo com atrações lúdicas e fotográficas temáticas de romance e amor. Cenários encantadores para fotos, experiências imersivas e momentos únicos.",duracao:"1h a 1h30",preco:"Consulte preço na Parksnet",faixa:"Adultos e casais",endereco:"Gramado, RS",dicas:"Ótimo para casais. Compre com desconto pela Parksnet.",pago:true},
  {nome:"Parque Gasper",horario:"10h às 17h",desc:"Parque temático com atrações para toda a família na Serra Gaúcha. Experiências interativas e diversão garantida.",duracao:"2 a 3 horas",preco:"Consulte preço na Parksnet",faixa:"Todas",endereco:"Serra Gaúcha, RS",dicas:"Compre com desconto pela Parksnet.",pago:true},
  {nome:"Forever in Gramado Fotografia",horario:"10h às 19h",desc:"Estúdio fotográfico com cenários incríveis de Gramado. Ensaio profissional em locações únicas da Serra Gaúcha para eternizar sua visita com fotos de qualidade.",duracao:"1 a 2 horas",preco:"Consulte preço na Parksnet",faixa:"Todas",endereco:"Gramado, RS",dicas:"Reserve com antecedência. Ótimo para casais, famílias e grupos.",pago:true},
  {nome:"Brasil Raft",horario:"Conforme condições do rio (consulte)",desc:"Rafting radical nas corredeiras da Serra Gaúcha. Esporte de aventura com guias especializados, equipamentos de segurança e adrenalina garantida nas águas do Rio.",duracao:"2 a 3 horas",preco:"Consulte preço na Parksnet",faixa:"Maiores de 12 anos",endereco:"Serra Gaúcha, RS",dicas:"Não é necessário experiência prévia. Use roupas que possam molhar.",pago:true},
];

function toggleAttrCard(el) {
  const card = el.parentElement;
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.attr-card.open').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}

const parksnetLinks = {
  "Snowland": "https://parksnet.com.br/destino/serra-gaucha/snowland?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Skyglass": "https://parksnet.com.br/destino/serra-gaucha/skyglass?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Bondinhos Aéreos Canela": "https://parksnet.com.br/destino/serra-gaucha/bondinhos-canela?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Space Adventure (Parque Da Nasa)": "https://parksnet.com.br/destino/serra-gaucha/space-adventure?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Terra Mágica Florybal": "https://parksnet.com.br/destino/serra-gaucha/parque-terra-magica-florybal?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Mundo A Vapor": "https://parksnet.com.br/destino/serra-gaucha/mundo-a-vapor?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "NBA Park": "https://parksnet.com.br/destino/serra-gaucha/nba-park?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Alpen Park": "https://parksnet.com.br/destino/serra-gaucha/alpen-park?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Acquamotion": "https://parksnet.com.br/destino/serra-gaucha/acquamotion?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Mini Mundo": "https://parksnet.com.br/destino/serra-gaucha/mini-mundo?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Vila Da Mônica Gramado": "https://parksnet.com.br/destino/serra-gaucha/vila-da-monica?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Parque Olivas De Gramado": "https://parksnet.com.br/destino/serra-gaucha/olivas?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Garden Park": "https://parksnet.com.br/destino/serra-gaucha/garden-park?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Parque Do Caracol": "https://parksnet.com.br/destino/serra-gaucha/caracol?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Exceed": "https://parksnet.com.br/destino/serra-gaucha/exceed-park?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Vale Dos Dinossauros": "https://parksnet.com.br/destino/serra-gaucha/vale-dos-dinossauros-canela?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Aldeia Do Papai Noel": "https://parksnet.com.br/destino/serra-gaucha/aldeia-do-papai-noel?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Cristais De Gramado": "https://parksnet.com.br/destino/serra-gaucha/cristais-de-gramado?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "O Reino Do Chocolate": "https://parksnet.com.br/destino/serra-gaucha/reino-do-chocolate?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Mundo Lugano": "https://parksnet.com.br/destino/serra-gaucha/mundo-lugano?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Selfie Gramado": "https://parksnet.com.br/destino/serra-gaucha/selfie-gramado?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Hollywood Dream Cars": "https://parksnet.com.br/destino/serra-gaucha/hollywood-dream-cars?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Museu De Cera": "https://parksnet.com.br/destino/serra-gaucha/museu-de-cera?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Dreams Motor Show Gramado": "https://parksnet.com.br/destino/serra-gaucha/dreams-motor-show?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Jardim do Amor": "https://parksnet.com.br/destino/serra-gaucha/jardim-do-amor?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Big Land": "https://parksnet.com.br/destino/serra-gaucha/big-land?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Super Carros": "https://parksnet.com.br/destino/serra-gaucha/super-carros?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Vinícola Jolimont": "https://parksnet.com.br/destino/serra-gaucha/jolimont?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Museu do Automóvel": "https://parksnet.com.br/destino/serra-gaucha/museu-do-automovel-de-canela?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Trem Maria Fumaça": "https://parksnet.com.br/destino/serra-gaucha/maria-fumaca?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Lumni Experience": "https://parksnet.com.br/destino/serra-gaucha/lumni?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Oficina da Diversão - Mundo Criamigos": "https://parksnet.com.br/destino/serra-gaucha/oficina-criamigos?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Sky Kids Mega Park": "https://parksnet.com.br/destino/serra-gaucha/sky-kids?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "RF Vision - Restaurante Giratório": "https://parksnet.com.br/destino/serra-gaucha/rf-vision?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Museu do Vinho Gramado": "https://parksnet.com.br/destino/serra-gaucha/museu-do-vinho?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Pedras do Silêncio": "https://parksnet.com.br/destino/serra-gaucha/parque-pedras-do-silencio?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Canyons e Balões": "https://parksnet.com.br/destino/serra-gaucha/canyons-e-baloes?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Chocoland Experiências": "https://parksnet.com.br/destino/serra-gaucha/chocoland-experiencias?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Mátria Parque das Flores": "https://parksnet.com.br/destino/serra-gaucha/matria-parque-das-flores?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Passaporte Grupo Dreams 7 Atrações": "https://parksnet.com.br/destino/serra-gaucha/passaporte-grupo-dreams-7-atracoes?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "UDrive Exotic": "https://parksnet.com.br/destino/serra-gaucha/udrive-exotic?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Happy Valen": "https://parksnet.com.br/destino/serra-gaucha/happy-valen?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Parque Gasper": "https://parksnet.com.br/destino/serra-gaucha/parque-gasper?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Forever in Gramado Fotografia": "https://parksnet.com.br/destino/serra-gaucha/forever-in-gramado-fotografia?bookingAgency=5248&cupom=PARKSNETEXTRA",
  "Brasil Raft": "https://parksnet.com.br/destino/serra-gaucha/brasil-raft?bookingAgency=5248&cupom=PARKSNETEXTRA",
};

function findParksnetLink(nome) {
  if (parksnetLinks[nome]) return parksnetLinks[nome];
  const nl = nome.toLowerCase();
  for (const [key, url] of Object.entries(parksnetLinks)) {
    const kl = key.toLowerCase();
    if (nl.includes(kl) || kl.includes(nl)) return url;
    const nWords = nl.split(/\s+/);
    const kWords = kl.split(/\s+/);
    const overlap = nWords.filter(w => w.length > 3 && kWords.some(kw => kw.includes(w) || w.includes(kw)));
    if (overlap.length >= 2) return url;
  }
  const match = parques.find(p => {
    const pl = p.n.toLowerCase();
    return nl.includes(pl) || pl.includes(nl) ||
      nl.split(/\s+/).filter(w=>w.length>3).some(w=>pl.includes(w));
  });
  return match ? match.url : null;
}

// ── CONVERTE FORMATO SUPABASE → FORMATO DO APP ──────────────────────────
function buildAtividadesDoDia(dia) {
  var atividades = [];
  (dia.manha || []).forEach(function(m) { atividades.push({ n: m, d: '🌅 Manhã', v: '', free: false }); });
  (dia.tarde || []).forEach(function(t) { atividades.push({ n: t, d: '☀️ Tarde', v: '', free: false }); });
  (dia.noite || []).forEach(function(n) { atividades.push({ n: n, d: '🌙 Noite', v: '', free: false }); });
  if (dia.restaurantes) {
    if (dia.restaurantes.manha) atividades.push({ n: '☕ Café da manhã', d: dia.restaurantes.manha, v: '', free: false });
    if (dia.restaurantes.almoco) atividades.push({ n: '🍽️ Almoço', d: dia.restaurantes.almoco, v: '', free: false });
  }
  if (dia.dicas && dia.dicas.length) {
    atividades.push({ n: '💡 Dicas', d: dia.dicas.join(' • '), v: '', free: true });
  }
  return atividades;
}

function converterRoteiroSupabase(conteudo) {
  return conteudo.map(function(dia) {
    var sub = [];
    if (dia.manha && dia.manha.length) sub.push('🌅 ' + dia.manha[0]);
    if (dia.tarde && dia.tarde.length) sub.push('☀️ ' + dia.tarde[0]);
    return {
      dia: dia.dia,
      titulo: dia.titulo,
      sub: sub.join(' · ') || dia.titulo,
      atr: buildAtividadesDoDia(dia),
      tip: dia.dicas ? dia.dicas.join(' | ') : ''
    };
  });
}

// ── CONVERTE linhas roteiro_atracoes → formato do app ─────────────────────
function formatarHorario(h) {
  if (!h) return '';
  // Remove segundos: "09:00:00" → "09:00"
  return String(h).replace(/^(\d{2}:\d{2}):\d{2}$/, '$1');
}

function converterRoteiroPorSlug(linhas, atracoes) {
  var dias = {};
  linhas.forEach(function(linha) {
    var d = linha.dia;
    if (!dias[d]) dias[d] = { dia: d, manha: [], tarde: [], noite: [], almoco: [], observacoes: [] };
    var at = (linha.atracao_slug && atracoes[linha.atracao_slug]) ? atracoes[linha.atracao_slug] : null;
    var nomeAtracao = at ? (at.nome || linha.atracao_nome_livre || '') : (linha.atracao_nome_livre || '');
    if (!nomeAtracao) return;
    var horario = formatarHorario(linha.horario);
    var item = {
      n: (horario ? horario + ' - ' : '') + nomeAtracao,
      d: at ? (at.descricao || '') : '',
      v: at ? (at.preco || '') : '',
      free: at ? !(at.pago === true || at.pago === 'true') : true,
      slug: linha.atracao_slug || '',
      link: at ? (at.link_desconto || '') : '',
      dica: at ? (at.dica || '') : '',
      obs: linha.observacao || ''
    };
    var turno = (linha.turno || '').toLowerCase()
      .replace(/ã/g,'a').replace(/ç/g,'c').replace(/é/g,'e')
      .replace(/á/g,'a').replace(/ó/g,'o').trim();
    if (turno === 'manha') dias[d].manha.push(item);
    else if (turno === 'tarde') dias[d].tarde.push(item);
    else if (turno === 'noite') dias[d].noite.push(item);
    else if (turno === 'almoco' || turno === 'almo\u00e7o') dias[d].almoco.push(item);
    else dias[d].tarde.push(item);
    if (linha.observacao) dias[d].observacoes.push(linha.observacao);
  });

  return Object.keys(dias).sort(function(a,b){ return parseInt(a)-parseInt(b); }).map(function(d) {
    var dia = dias[d];
    var todasAtividades = [];
    dia.manha.forEach(function(a){ todasAtividades.push(a); });
    if (dia.almoco.length) {
      dia.almoco.forEach(function(a){ todasAtividades.push({ n: '🍽️ ' + a.n, d: a.d || 'Sugestão de almoço', v: a.v, free: true, slug: a.slug }); });
    }
    dia.tarde.forEach(function(a){ todasAtividades.push(a); });
    dia.noite.forEach(function(a){ todasAtividades.push(a); });

    // Dicas únicas — só adiciona uma vez, sem duplicar
    var dicas = dia.observacoes.filter(function(o,i,arr){ return o && arr.indexOf(o) === i; });
    if (dicas.length) {
      todasAtividades.push({ n: '💡 Dica do Pobre', d: dicas.join(' • '), v: '', free: true, slug: '' });
    }

    var primeiraAtiv = todasAtividades[0] ? todasAtividades[0].n.replace(/^\d+:\d+ - /, '') : '';
    var segundaAtiv = todasAtividades[1] ? todasAtividades[1].n.replace(/^\d+:\d+ - /, '') : '';
    return {
      dia: parseInt(d),
      titulo: 'Dia ' + d,
      sub: [primeiraAtiv, segundaAtiv].filter(Boolean).join(' · '),
      atr: todasAtividades,
      tip: '' // Não passa tip para evitar duplicar a dica no buildRoteiro
    };
  });
}

function _adicionarBadgePerfil(perfil) {
  // Atualiza card de dias na home (stats)
  var heroDias = document.getElementById('hero-dias-val');
  if (heroDias && perfil.dias_viagem) {
    heroDias.textContent = perfil.dias_viagem + (perfil.dias_viagem === 1 ? ' dia' : ' dias');
  }

  // Atualiza banner "Roteiro Completo — X Dias" na home
  var perfilLabel = { familia:'Família', casal:'Casal', melhor_idade:'Melhor Idade', viajante_solo:'Viajante Solo' }[perfil.perfil_viagem] || perfil.perfil_viagem;
  var bannerTitulo = document.getElementById('rota-banner-titulo');
  if (bannerTitulo && perfil.dias_viagem) {
    bannerTitulo.textContent = 'Roteiro ' + perfilLabel + ' — ' + perfil.dias_viagem + (perfil.dias_viagem === 1 ? ' Dia' : ' Dias');
  }
  var bannerSub = document.getElementById('rota-banner-sub');
  if (bannerSub && currentUser) {
    var fullName = (currentUser.user_metadata && currentUser.user_metadata.full_name) || '';
    var nome = fullName ? fullName.split(' ')[0] : 'você';
    bannerSub.textContent = 'Personalizado com carinho para ' + nome + ' ✨';
  }

  // Subtítulo dentro do overlay do roteiro
  var subtitulo = document.getElementById('roteiro-subtitulo');
  if (subtitulo && currentUser) {
    var fullName2 = (currentUser.user_metadata && currentUser.user_metadata.full_name) || '';
    var nome2 = fullName2 ? fullName2.split(' ')[0] : 'você';
    subtitulo.textContent = '✨ Personalizado com carinho para ' + nome2;
    subtitulo.style.display = 'block';
  }

  // Label "Personalizado para [nome]" no cabeçalho do overlay
  var labelEl = document.getElementById('roteiro-personalizado-label');
  if (labelEl && currentUser) {
    var fullName3 = (currentUser.user_metadata && currentUser.user_metadata.full_name) || '';
    var nomeLabel = fullName3 ? fullName3.split(' ')[0] : 'você';
    labelEl.textContent = '✨ Personalizado para ' + nomeLabel;
    labelEl.style.display = 'block';
  }

  var progWrap = document.getElementById('roteiro-progress-wrap');
  if (progWrap && !document.getElementById('roteiro-badge-personalizado')) {
    var badge = document.createElement('div');
    badge.id = 'roteiro-badge-personalizado';
    badge.style.cssText = 'margin:10px 16px 10px;background:rgba(20,184,166,0.1);border:1px solid rgba(20,184,166,0.25);border-radius:10px;padding:8px 12px;font-size:11px;color:var(--teal);font-weight:700;display:flex;align-items:center;gap:6px;';
    badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:13px;height:13px;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg> Roteiro personalizado · ' + perfilLabel + ' · ' + perfil.dias_viagem + ' dias';
    progWrap.parentNode.insertBefore(badge, progWrap);
  }
}

// ── CARREGA ROTEIRO PERSONALIZADO DO SUPABASE ────────────────────────────
async function carregarRoteiroPersonalizado() {
  // Independente do que vier do backend, ao terminar essa função o overlay-roteiro
  // estará construído — marca aqui pra evitar rebuild quando o usuário abrir.
  _builtOverlays.add('overlay-roteiro');

  if (!_supabase || !currentUser) { buildRoteiro(); applyRoteiroChecked(); return; }

  var body = document.getElementById('roteiro-content') || document.getElementById('roteiro-body');
  if (body) body.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);font-size:13px;">⏳ Carregando seu roteiro personalizado...</div>';

  try {
    var perfilRes = await _supabase
      .from('perfis_usuarios')
      .select('roteiro_id, perfil_viagem, dias_viagem')
      .eq('user_id', currentUser.id)
      .single();

    var perfil = perfilRes.data;
    if (!perfil) { buildRoteiro(); return; }

    // Monta ID no formato das novas tabelas (ex: casal-7)
    var perfilMap = { casal:'casal', familia:'familia', melhor_idade:'melhor-idade', viajante_solo:'solo' };
    var perfilKey = perfilMap[perfil.perfil_viagem] || perfil.perfil_viagem;
    var roteiroIdV2 = perfilKey + '-' + perfil.dias_viagem;

    var roteiroV2Res = await _supabase
      .from('roteiros_v2')
      .select('id, titulo, duracao_dias')
      .eq('id', roteiroIdV2)
      .single();

    if (roteiroV2Res.data) {
      // ✅ Usa novas tabelas com slugs
      var rotV2 = roteiroV2Res.data;
      var linhasRes = await _supabase
        .from('roteiro_atracoes')
        .select('dia, turno, horario, atracao_slug, atracao_nome_livre, observacao, atracoes(nome, descricao, preco, dica, link_desconto, pago)')
        .eq('roteiro_id', roteiroIdV2)
        .order('dia')
        .order('horario');

      var linhas = linhasRes.data || [];
      var atracoes = {};
      linhas.forEach(function(l) {
        if (l.atracao_slug && l.atracoes) atracoes[l.atracao_slug] = l.atracoes;
      });

      var header = document.querySelector('#overlay-roteiro .overlay-header h2');
      if (header) header.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg> ' + rotV2.titulo;

      _adicionarBadgePerfil(perfil);
      buildRoteiro(converterRoteiroPorSlug(linhas, atracoes));
      return;
    }

    // Fallback: tabela roteiros antiga (JSON)
    if (perfil.roteiro_id) {
      var roteiroRes = await _supabase.from('roteiros').select('titulo, conteudo').eq('id', perfil.roteiro_id).single();
      if (roteiroRes.data) {
        var header2 = document.querySelector('#overlay-roteiro .overlay-header h2');
        if (header2) header2.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg> ' + roteiroRes.data.titulo;
        _adicionarBadgePerfil(perfil);
        buildRoteiro(converterRoteiroSupabase(roteiroRes.data.conteudo));
        return;
      }
    }

    buildRoteiro();
  } catch(e) {
    console.error('Erro ao carregar roteiro personalizado:', e);
    buildRoteiro();
  }
}


// (Removido: buildRoteiro/buildPromocoes/buildRestaurantes eager.
//  Agora são construídos sob demanda via ensureBuilt() ao abrir overlay.)


// Atrações sem botão de comprar ingresso
const semBotaoComprar = new Set([
  'le jardin','castelinho do caracol','vinícola ravanello','casa seganfredo',
  'bus tour','museu egipcio','tour linha bella','ecoparque sperry',
  'museu dos beatles','mundo gelado','museu da moda'
]);

function semBotao(nome) {
  const n = nome.toLowerCase();
  return semBotaoComprar.has(n) ||
    [...semBotaoComprar].some(k => n.includes(k) || k.includes(n));
}

function buildAtracoes() {
  const body = document.getElementById('atracoes-body');
  const pagas = todasAtracoes.filter(a => a.pago);
  const gratis = todasAtracoes.filter(a => !a.pago);
  
  const renderGroup = (arr, titulo, cor) => `
    <div style="padding:10px 16px 6px;background:#111;border-bottom:1px solid #1e1e1e;">
      <span style="font-size:10px;font-weight:800;color:${cor};letter-spacing:1px;text-transform:uppercase;">${titulo}</span>
    </div>
    ${arr.map(a => {
      const emoji = getEmoji(a.nome, a.preco);
      const linkDesconto = parksnetLinks[a.nome];
      return `
      <div class="attr-card">
        <div class="attr-card-header" onclick="toggleAttrCard(this)">
          <div class="attr-emoji-wrap">${getAttrIconSVG(emoji, a.nome)}</div>
          <div class="attr-main">
            <h5>${a.nome}</h5>
            <p>${a.duracao} · ${a.faixa}</p>
          </div>
          <div class="attr-right">
            ${a.pago ? `<span style="font-size:10px;font-weight:800;color:var(--yellow);">${a.preco.split('\n')[0]}</span>` : `<span style="font-size:10px;font-weight:800;color:var(--green);">Grátis</span>`}
            <div class="attr-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
          </div>
        </div>
        <div class="attr-details">
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><span class="attr-detail-text">${a.desc}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><span class="attr-detail-text"><strong>Horários:</strong> ${a.horario}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><span class="attr-detail-text"><strong>Preço:</strong> ${a.preco.replace(/\n/g,'<br>')}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><span class="attr-detail-text"><strong>Faixa etária:</strong> ${a.faixa}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><span class="attr-detail-text"><strong>Endereço:</strong> ${a.endereco}</span></div>
          <div class="attr-detail-row"><div class="attr-detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg></div><span class="attr-detail-text">${a.dicas}</span></div>
          ${a.pago && !semBotao(a.nome) ? `<div style="padding:12px 0 4px;">${linkDesconto
            ? `<a href="${linkDesconto}" target="_blank" rel="noopener" class="btn-comprar" style="display:inline-flex;text-decoration:none;"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:12px;height:12px;flex-shrink:0;stroke:#fff;\"><path d=\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\"/><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\"/></svg> Comprar com Desconto</a>`
            : `<button class="btn-comprar" onclick="showToast('Buscando desconto...')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;stroke:#fff;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Comprar com Desconto</button>`}</div>` : ''}
        </div>
      </div>
    `}).join('')}
  `;
  
  body.innerHTML = renderGroup(pagas, 'Atrações Pagas', 'var(--yellow)') + renderGroup(gratis, 'Entrada Gratuita', 'var(--green)');
}

function buildGratuitos() {
  const body = document.getElementById('gratuitos-body');
  const gratuitos = todasAtracoes.filter(a => !a.pago);
  
  // icons handled by getFreeIconSVG
  
  body.innerHTML = `
    <div style="padding:12px 18px 8px;background:#0a1a0a;border-bottom:1px solid #1a2a1a;">
      <p style="font-size:11px;color:#2ecc71;font-weight:700;">${gratuitos.length} atrações gratuitas disponíveis</p>
    </div>
    ${gratuitos.map(a => `
      <div class="free-item">
        <div class="free-icon-wrap">${getFreeIconSVG(a.nome)}</div>
        <div class="free-info">
          <h5>${a.nome}</h5>
          <p>${a.desc.length > 100 ? a.desc.substring(0,100)+'...' : a.desc}</p>
          <p class="free-meta"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${a.horario.split('\n')[0]} · <svg viewBox="0 0 24 24" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${a.endereco.split(' - ')[0]}</p>
          <span class="free-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:9px;height:9px;"><polyline points="20 6 9 17 4 12"/></svg>Grátis</span>
        </div>
      </div>
    `).join('')}
  `;
}

function showTab(name) {
  // Fecha todos os overlays abertos
  document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));

  // Atualiza tab ativa
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const el = document.getElementById('tab-' + name);
  if (el) el.classList.add('active');
}

// (Removido: buildAtracoes/buildGratuitos eager — usam ensureBuilt sob demanda.)

/* ═══ SEARCH ═══ */
function handleSearch(input) {
  const val = input.value.trim().toLowerCase();
  const clearBtn = document.getElementById(input.id + '-clear');
  if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';

  const overlayMap = {
    'search-roteiro':     filterRoteiro,
    'search-promocoes':   filterPromocoes,
    'search-restaurantes':filterRestaurantes,
    'search-atracoes':    filterAtracoes,
    'search-gratuitos':   filterGratuitos,
  };
  if (overlayMap[input.id]) overlayMap[input.id](val);
}

function clearSearch(inputId) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.value = '';
  inp.dispatchEvent(new Event('input'));
  inp.focus();
}


function showEmpty(containerId, show) {
  let el = document.getElementById(containerId + '-empty');
  if (!el) {
    el = document.createElement('div');
    el.id = containerId + '-empty';
    el.className = 'search-empty';
    el.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Nenhum resultado encontrado';
    const body = document.getElementById(containerId);
    if (body) body.appendChild(el);
  }
  el.style.display = show ? 'block' : 'none';
}

function filterRoteiro(q) {
  const blocks = document.querySelectorAll('#roteiro-content .day-block');
  let found = 0;
  blocks.forEach(block => {
    const text = block.textContent.toLowerCase();
    const match = !q || text.includes(q);
    block.style.display = match ? '' : 'none';
    if (match) found++;
  });
  // Show tips box always
  const tips = document.querySelector('#roteiro-content > div:last-child');
  if (tips && !tips.classList.contains('day-block')) tips.style.display = '';
  showEmpty('roteiro-content', found === 0 && q);
}

function filterPromocoes(q) {
  const items = document.querySelectorAll('#promocoes-body .park-item');
  let found = 0;
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = !q || text.includes(q);
    item.style.display = match ? '' : 'none';
    if (match) found++;
  });
  showEmpty('promocoes-body', found === 0 && q);
}

function filterRestaurantes(q) {
  const items = document.querySelectorAll('#restaurantes-body .park-item');
  let found = 0;
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = !q || text.includes(q);
    item.style.display = match ? '' : 'none';
    if (match) found++;
  });
  showEmpty('restaurantes-body', found === 0 && q);
}

function filterAtracoes(q) {
  const cards = document.querySelectorAll('#atracoes-body .attr-card');
  const headers = document.querySelectorAll('#atracoes-body [style*="border-bottom"]');
  let found = 0;
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const match = !q || text.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) found++;
  });
  showEmpty('atracoes-body', found === 0 && q);
}

function filterGratuitos(q) {
  const items = document.querySelectorAll('#gratuitos-body .free-item');
  let found = 0;
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = !q || text.includes(q);
    item.style.display = match ? '' : 'none';
    if (match) found++;
  });
  showEmpty('gratuitos-body', found === 0 && q);
}




/* ═══ ROTEIRO PROGRESS ═══ */
const ROTEIRO_KEY = 'gramado_roteiro_v1';

function getRoteiroChecked() {
  try { return JSON.parse(localStorage.getItem(ROTEIRO_KEY) || '[]'); } catch(e) { return []; }
}
function saveRoteiroChecked(arr) {
  try { localStorage.setItem(ROTEIRO_KEY, JSON.stringify(arr)); } catch(e) {}
}

function countRoteiroTotal() {
  // Conta os itens realmente renderizados no DOM (funciona para qualquer roteiro)
  return document.querySelectorAll('#roteiro-content .attraction-item[data-id], #roteiro-body .attraction-item[data-id]').length;
}

function updateRoteiroProgress() {
  const checked = getRoteiroChecked();
  const total = countRoteiroTotal();

  // Só conta IDs que estão realmente renderizados no DOM atual
  const renderedIds = new Set(
    Array.from(document.querySelectorAll('#roteiro-content .attraction-item[data-id], #roteiro-body .attraction-item[data-id]'))
      .map(el => el.dataset.id)
  );
  const done = checked.filter(id => renderedIds.has(id)).length;

  const pct = total ? Math.round((done / total) * 100) : 0;

  const fill  = document.getElementById('roteiro-fill');
  const count = document.getElementById('roteiro-count');
  if (fill)  { fill.style.width = pct + '%'; fill.classList.toggle('complete', pct === 100); }
  if (count) count.textContent = done + ' / ' + total;
}

function applyRoteiroChecked() {
  const checked = getRoteiroChecked();
  document.querySelectorAll('.attraction-item[data-id]').forEach(item => {
    const id = item.dataset.id;
    const isDone = checked.includes(id);
    item.classList.toggle('done', isDone);
    const btn = item.querySelector('.item-check');
    if (btn) btn.classList.toggle('checked', isDone);
  });
  updateRoteiroProgress();
}

function toggleRoteiroItem(btn, id) {
  let checked = getRoteiroChecked();
  const idx = checked.indexOf(id);
  if (idx === -1) {
    checked.push(id);
    showToast('Concluído! ✓');
    // Gatilho PWA — primeiro item marcado = engajamento confirmado
    if (checked.length === 1) pwaTrigger();
  } else {
    checked.splice(idx, 1);
  }
  saveRoteiroChecked(checked);
  applyRoteiroChecked();
}

// Apply checked state whenever roteiro overlay opens — patch via event delegation
document.addEventListener('click', function(e) {
  const trigger = e.target.closest('[onclick*="overlay-roteiro"]');
  if (trigger) setTimeout(applyRoteiroChecked, 50);
});

/* ═══ OFERTAS RELÂMPAGO ═══ */
const ofertasRelampago = [
  { nome:'Bondinhos Aéreos', tag:'A MELHOR VISTA DA CASCATA!', tempo:'2-3 horas', cupom:'COPA26', desc:'-5%', de:'R$ 150,00', por:'R$ 60,00', emoji:'🚡' },
  { nome:'Snowland Gramado', tag:'O MAIOR PARQUE DE NEVE DO BRASIL!', tempo:'+4 horas', cupom:'COPA26', desc:'-5%', de:'R$ 329,00', por:'R$ 129,50', emoji:'❄️' },
  { nome:'Space Adventure', tag:'A MAIOR EXPERIÊNCIA DA NASA NO BRASIL!', tempo:'2-3 horas', cupom:'COPA26', desc:'-20%', de:'R$ 129,90', por:'R$ 59,90', emoji:'🚀' },
  { nome:'Lumni Experience', tag:'O 1º PARQUE NOTURNO DE LUZES!', tempo:'2-3 horas', cupom:'COPA26', desc:'-10%', de:'R$ 109,90', por:'R$ 54,90', emoji:'✨' },
  { nome:'Oficina da Diversão', tag:'7.000M² + CRIANÇA GRÁTIS!', tempo:'3-4 horas', cupom:'COPA26', desc:'-15%', de:'R$ 297,00', por:'R$ 119,90', emoji:'🎡' },
  { nome:'Mundo a Vapor', tag:'Atrações em Canela + Pipoca Grátis', tempo:'1-2 horas', cupom:'COPA26', desc:'-20%', de:'R$ 229,00', por:'R$ 99,00', emoji:'🚂' },
  { nome:'FLORYBAL', tag:'O PARQUE TEMÁTICO MAIS ENCANTADOR!', tempo:'+4 horas', cupom:'COPA26', desc:'-5%', de:'R$ 180,00', por:'R$ 90,00', emoji:'🌸' },
  { nome:'Olivas de Gramado', tag:'NATUREZA, FAZENDINHA E SUNSET!', tempo:'2-3 horas', cupom:'COPA26', desc:'-15%', de:null, por:'R$ 99,00', emoji:'🌿' },
  { nome:'Vitivinícola Jolimont', tag:'O TOUR DE VINHOS MAIS PREMIADO!', tempo:'1-2 horas', cupom:'COPA26', desc:'-10%', de:null, por:'R$ 90,00', emoji:'🍷' },
  { nome:'Vila da Mônica', tag:'DIVERSÃO NO BAIRRO DO LIMOEIRO!', tempo:'3-4 horas', cupom:'COPA26', desc:'-5%', de:'R$ 358,00', por:'R$ 129,00', emoji:'🎠' },
  { nome:'MÁTRIA Parque de Flores', tag:'ARTE NATURAL!', tempo:'3-4 horas', cupom:'COPA26', desc:'-5%', de:'R$ 129,00', por:'R$ 59,50', emoji:'🌺' },
  { nome:'Museu de Cera Dreamland', tag:'O 1º DA AMÉRICA LATINA!', tempo:'1-2 horas', cupom:'COPA26', desc:'-30%', de:'R$ 179,99', por:'R$ 89,99', emoji:'🗿' },
  { nome:'Super Carros', tag:'Salão com mais de 40 máquinas', tempo:'2-4 horas', cupom:'COPA26', desc:'-30%', de:'R$ 149,99', por:'R$ 74,99', emoji:'🏎️' },
  { nome:'Selfie Gramado', tag:'O MAIOR PARQUE INSTAGRAMÁVEL!', tempo:'2-3 horas', cupom:'COPA26', desc:'-30%', de:'R$ 149,99', por:'R$ 74,99', emoji:'📸' },
  { nome:'GATZZ', tag:'Fondue e Espetáculos', tempo:'2-3 horas', cupom:'COPA26', desc:'-15%', de:'R$ 398,00', por:'R$ 98,00', emoji:'🎭' },
  { nome:'Kongo Pizzaria', tag:'AVENTURA SELVAGEM EM GRAMADO!', tempo:'2-3 horas', cupom:'COPA26', desc:'-15%', de:null, por:'R$ 89,90', emoji:'🍕' },
  { nome:'Cervejaria Farol', tag:'Tour, Almoço e Vista 360º!', tempo:'2-4 horas', cupom:'COPA26', desc:'-10%', de:null, por:'R$ 139,00', emoji:'🍺' },
];

function buildRelampago() {
  const body = document.getElementById('relampago-body');
  if (!body) return;
  body.innerHTML = ofertasRelampago.map((o, i) => {
    const iconKey = getIconKey(o.nome, o.emoji);
    const iconH = getIconHTML(o.nome, o.emoji, 48);
    const discPct = parseInt(o.desc);
    const discColor = discPct <= -25 ? '#ef4444' : discPct <= -15 ? '#f97316' : '#f0b429';

    // Busca URL base nos arrays parques[] e restaurantes[], troca o cupom pelo correto
    const todosItens = [...parques, ...restaurantes];
    const match = todosItens.find(p => {
      const pn = (p.n || '').toLowerCase();
      const on = o.nome.toLowerCase();
      return pn === on || pn.includes(on) || on.includes(pn) ||
        on.split(' ').filter(w => w.length > 3).some(w => pn.includes(w));
    });
    const urlBase = match?.url || null;
    const urlCupom = urlBase
      ? urlBase.replace('cupom=PARKSNETEXTRA', `cupom=${o.cupom}`)
      : null;

    return `
    <div class="park-item" style="position:relative;padding:14px 16px;">
      ${iconH}
      <div style="flex:1;min-width:0;padding-right:4px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:4px;">
          <div>
            <h5 style="font-size:12.5px;font-weight:800;color:var(--text);line-height:1.3;">${o.nome}</h5>
            <p style="font-size:10px;color:var(--muted);margin-top:2px;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;line-height:1.3;">${o.tag}</p>
          </div>
          <span style="background:${discColor}22;color:${discColor};font-size:10px;font-weight:800;padding:3px 8px;border-radius:100px;white-space:nowrap;border:1px solid ${discColor}44;flex-shrink:0;">${o.desc}</span>
        </div>
        <div style="margin-top:7px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--muted);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:10px;height:10px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${o.tempo}
          </span>
          <span onclick="copiarCupom('${o.cupom}')" style="display:flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;color:#f0b429;background:rgba(240,180,41,0.1);padding:3px 9px;border-radius:100px;border:1px dashed rgba(240,180,41,0.3);cursor:pointer;">
            🎟️ ${o.cupom}
          </span>
        </div>
        <div style="margin-top:8px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div>
            ${o.de ? `<span style="font-size:10px;color:#555;text-decoration:line-through;">De ${o.de}</span> ` : ''}
            <span style="font-size:13px;font-weight:800;color:var(--green);">A partir de ${o.por}</span>
          </div>
          ${urlCupom
            ? `<a href="${urlCupom}" target="_blank" rel="noopener" style="background:linear-gradient(135deg,var(--orange),var(--yellow));color:#0d0a00;border:none;padding:8px 14px;border-radius:10px;font-size:10px;font-weight:800;cursor:pointer;white-space:nowrap;font-family:'Space Grotesk',sans-serif;flex-shrink:0;text-decoration:none;display:inline-block;">
                Usar Cupom
              </a>`
            : `<button onclick="copiarCupom('${o.cupom}')" style="background:linear-gradient(135deg,var(--orange),var(--yellow));color:#0d0a00;border:none;padding:8px 14px;border-radius:10px;font-size:10px;font-weight:800;cursor:pointer;white-space:nowrap;font-family:'Space Grotesk',sans-serif;flex-shrink:0;">
                Usar Cupom
              </button>`
          }
        </div>
      </div>
    </div>`;
  }).join('');
}

function copiarCupom(cupom) {
  navigator.clipboard.writeText(cupom).catch(() => {});
  showToast('Cupom ' + cupom + ' copiado! 🎟️');
}

// (Removido: buildRelampago eager — agora sob demanda via ensureBuilt.)


/* ═══ PERFIL ═══ */
function renderPerfil() {
  const body = document.getElementById('perfil-body');
  if (!body) return;

  const logado = !!currentUser;
  const meta   = (currentUser && currentUser.user_metadata) || {};
  const fullName = (meta.full_name || meta.name || '').trim();
  // Sem fallback pro email: se não tem nome customizado, mostra "Membro" + sugestão de definir
  const nome   = logado ? (fullName || 'Membro') : 'Visitante';
  const email  = logado ? currentUser.email : '—';
  const cor    = logado ? getAvatarColor(nome) : '#52525b';
  const ini    = logado ? getInitials(nome)    : '?';
  const semNome = logado && !fullName;

  body.innerHTML = `
  <!-- Hero do perfil -->
  <div style="background:linear-gradient(160deg,var(--bg2),var(--bg3));padding:32px 20px 24px;text-align:center;border-bottom:1px solid var(--border);">
    <div style="width:72px;height:72px;border-radius:50%;background:${cor};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff;margin:0 auto 12px;box-shadow:0 6px 24px ${cor}55;">${ini}</div>
    <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text);letter-spacing:-0.5px;">${nome}</div>
    <div style="font-size:11px;color:var(--muted);margin-top:4px;">${email}</div>
    ${semNome ? `<button onclick="editarNomePublico()" style="margin-top:10px;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.3);color:var(--purple);border-radius:100px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Space Grotesk',sans-serif;display:inline-flex;align-items:center;gap:5px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      Escolher meu nome
    </button>` : (logado ? `<button onclick="editarNomePublico()" style="margin-top:10px;background:transparent;border:1px solid var(--border);color:var(--muted);border-radius:100px;padding:5px 12px;font-size:10px;font-weight:600;cursor:pointer;font-family:'Space Grotesk',sans-serif;">
      Editar nome
    </button>` : '')}
    ${logado ? `<div style="display:inline-flex;align-items:center;gap:5px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:100px;padding:4px 12px;margin-top:10px;font-size:10px;font-weight:700;color:#4ade80;margin-left:8px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px;"><polyline points="20 6 9 17 4 12"/></svg>
      Membro ativo
    </div>` : `<div style="display:inline-flex;align-items:center;gap:5px;background:rgba(113,113,122,0.15);border:1px solid var(--border);border-radius:100px;padding:4px 12px;margin-top:10px;font-size:10px;font-weight:700;color:var(--muted);">Visitante</div>`}
  </div>

  <!-- Seção: Minha viagem -->
  <div style="padding:20px 16px 0;">
    <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px;">Minha viagem</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
      <div onclick="closeOverlay('overlay-perfil');openOverlay('overlay-roteiro')" style="background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:16px 14px;cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='var(--teal)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(20,184,166,0.15);display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px;"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text);">Roteiro</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px;">Ver meu roteiro</div>
      </div>

      <div onclick="closeOverlay('overlay-perfil');openOverlay('overlay-atracoes')" style="background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:16px 14px;cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='var(--yellow)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(240,180,41,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px;"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/></svg>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text);">Atrações</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px;">Com desconto</div>
      </div>

      <div onclick="closeOverlay('overlay-perfil');openOverlay('overlay-restaurantes')" style="background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:16px 14px;cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='var(--orange)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(232,116,12,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px;"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text);">Restaurantes</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px;">Ver parceiros</div>
      </div>

      <div onclick="closeOverlay('overlay-perfil');openOverlay('overlay-comunidade');renderComunidadeInit()" style="background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:16px 14px;cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='var(--purple)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(168,85,247,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text);">Comunidade</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px;">Ver discussões</div>
      </div>
    </div>

    <!-- Seção: Conta -->
    <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px;">Conta</div>

    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:20px;">

      <!-- Email -->
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);">
        <div style="width:32px;height:32px;border-radius:9px;background:var(--bg4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:10px;color:var(--muted);font-weight:600;">E-mail</div>
          <div style="font-size:12px;color:var(--text);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${email}</div>
        </div>
      </div>

      <!-- Suporte -->
      <a href="mailto:suporte@guiadopobre.com" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);text-decoration:none;">
        <div style="width:32px;height:32px;border-radius:9px;background:var(--bg4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div style="flex:1;">
          <div style="font-size:12px;color:var(--text);font-weight:600;">Suporte</div>
          <div style="font-size:10px;color:var(--muted);">suporte@guiadopobre.com</div>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;"><polyline points="9 18 15 12 9 6"/></svg>
      </a>

      <!-- Sair / Entrar -->
      ${logado
        ? `<button onclick="handleLogout()" style="width:100%;display:flex;align-items:center;gap:12px;padding:14px 16px;background:none;border:none;cursor:pointer;text-align:left;">
            <div style="width:32px;height:32px;border-radius:9px;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <div style="font-size:12px;color:var(--red);font-weight:700;">Sair da conta</div>
          </button>`
        : `<button onclick="closeOverlay('overlay-perfil');showLoginOverlay()" style="width:100%;display:flex;align-items:center;gap:12px;padding:14px 16px;background:none;border:none;cursor:pointer;text-align:left;">
            <div style="width:32px;height:32px;border-radius:9px;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            </div>
            <div style="font-size:12px;color:var(--green);font-weight:700;">Fazer login</div>
          </button>`
      }
    </div>

    <!-- Versão -->
    <div style="text-align:center;padding:8px 0 24px;">
      <div style="font-size:10px;color:var(--muted);">Guia do Pobre em Gramado · v1.0</div>
      <div style="font-size:10px;color:var(--muted);margin-top:2px;">Feito com 💛 para viajantes econômicos</div>
    </div>
  </div>`;
}



/* ═══ COMUNIDADE — SUPABASE REALTIME ═══ */

const tagLabels = { dica:'💡 Dica', foto:'📸 Foto', restaurante:'🍽️ Restaurante', hotel:'🏨 Hotel', 'atração':'🎢 Atração', economia:'💰 Economia' };
const reacaoEmojis = ['❤️','😍','👏','😂','🔥','🤩'];

let selectedPhoto    = null;
let _chatChannel     = null;
let _postsCache      = [];

// ── AVATAR ────────────────────────────────────────────────────────────────
function getAvatarColor(str) {
  const cores = ['#a855f7','#3b82f6','#22c55e','#ef4444','#f0b429','#14b8a6','#e8740c','#e11d48'];
  let h = 0; for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return cores[Math.abs(h) % cores.length];
}
function getInitials(name) {
  return (name || 'V').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}
// ── DISPLAY NAME ──────────────────────────────────────────────────────────
// Retorna o nome PÚBLICO do usuário (usado em posts, comentários).
// IMPORTANTE: NÃO usa o email como fallback — emails revelam dados pessoais
// (sobrenome, número de telefone, ano de nascimento, etc.). Se o usuário ainda
// não escolheu um nome customizado, retorna null para o caller decidir o que fazer.
function getPublicDisplayName() {
  if (!currentUser) return null;
  var meta = currentUser.user_metadata || {};
  var nome = (meta.full_name || meta.name || meta.display_name || '').trim();
  return nome || null;
}

// Versão "qualquer coisa serve" — usada em locais NÃO públicos, como saudação
// no toast de bem-vindo ou avatar do composer (que só você vê).
function getDisplayName() {
  return getPublicDisplayName() || 'Visitante';
}

// Salva o nome público escolhido pelo usuário no user_metadata do Supabase.
// O nome persiste entre sessões e fica vinculado à conta.
async function setPublicDisplayName(nome) {
  if (!_supabase || !currentUser) return false;
  nome = String(nome || '').trim().slice(0, 40);
  if (!nome) return false;
  try {
    const { data, error } = await _supabase.auth.updateUser({
      data: { full_name: nome }
    });
    if (error) { console.warn('setPublicDisplayName:', error.message); return false; }
    if (data && data.user) {
      currentUser = data.user;
      // Atualiza o chip do header com o novo nome (estava mostrando "Membro")
      try { updateHeaderForUser(currentUser); } catch(e) {}
    }
    return true;
  } catch(e) {
    console.warn('setPublicDisplayName exception:', e);
    return false;
  }
}

// Abre a sheet pedindo o nome público. Retorna uma Promise que resolve com o nome
// digitado (string) ou null se o usuário cancelar.
function pedirNomePublico() {
  return new Promise(function(resolve) {
    const sheet = document.getElementById('nome-sheet');
    const panel = document.getElementById('nome-panel');
    const input = document.getElementById('nome-input');
    const btn   = document.getElementById('nome-confirm-btn');
    const cancelBtn = document.getElementById('nome-cancel-btn');
    if (!sheet || !panel || !input || !btn || !cancelBtn) { resolve(null); return; }

    input.value = '';
    sheet.style.display = 'block';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        panel.style.transform = 'translateY(0)';
        setTimeout(function() { input.focus(); }, 250);
      });
    });

    function close(valor) {
      panel.style.transform = 'translateY(100%)';
      setTimeout(function() {
        sheet.style.display = 'none';
        btn.onclick = null;
        input.onkeydown = null;
        cancelBtn.onclick = null;
        resolve(valor);
      }, 350);
    }

    btn.onclick = function() {
      const v = input.value.trim();
      if (!v) { showToast('Digite um nome para aparecer.'); return; }
      if (v.length < 2) { showToast('Nome muito curto.'); return; }
      close(v);
    };
    input.onkeydown = function(e) {
      if (e.key === 'Enter') btn.click();
    };
    cancelBtn.onclick = function() { close(null); };
  });
}

// Botão "Editar nome" / "Escolher meu nome" no perfil
async function editarNomePublico() {
  if (!currentUser) { showToast('Faça login primeiro.'); return; }
  const novo = await pedirNomePublico();
  if (!novo) return;
  const ok = await setPublicDisplayName(novo);
  if (ok) {
    showToast('Nome atualizado! ✨');
    // Re-renderiza o perfil pra mostrar o novo nome
    if (typeof renderPerfil === 'function') renderPerfil();
  } else {
    showToast('Não foi possível salvar. Tente de novo.');
  }
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────────────────
function triggerPhotoUpload() {
  document.getElementById('photo-input').click();
}

// ── CONSTANTES DE UPLOAD DE FOTO ─────────────────────────────────────────
const FOTO_TIPOS_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const FOTO_TAMANHO_MAX_BYTES = 15 * 1024 * 1024; // 15 MB no arquivo bruto (antes da compressão)
const FOTO_MAX_LARGURA = 1280; // px — qualquer foto maior é redimensionada
const FOTO_QUALIDADE = 0.82;   // 0..1 para JPEG/WebP

// Comprime e redimensiona a imagem via canvas. Retorna um dataURL (string).
// Aceita File ou Blob. Sempre devolve JPEG (compressão melhor para fotos).
function comprimirImagem(fileOrBlob) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onerror = function() { reject(new Error('Falha ao ler arquivo.')); };
    reader.onload  = function(ev) {
      const img = new Image();
      img.onerror = function() { reject(new Error('Arquivo não é uma imagem válida.')); };
      img.onload  = function() {
        // Calcula novas dimensões mantendo aspect ratio
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > FOTO_MAX_LARGURA) {
          h = Math.round(h * (FOTO_MAX_LARGURA / w));
          w = FOTO_MAX_LARGURA;
        }
        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        // Fundo branco (caso PNG com transparência vire JPEG)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', FOTO_QUALIDADE);
          resolve(dataUrl);
        } catch(e) { reject(e); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(fileOrBlob);
  });
}

async function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  // 1. Valida tipo (file.type pode vir vazio em alguns cenários iOS — então só rejeita se vier preenchido e for proibido)
  if (file.type && !FOTO_TIPOS_PERMITIDOS.includes(file.type.toLowerCase())) {
    showToast('Formato não permitido. Use JPG, PNG ou WebP.');
    e.target.value = '';
    return;
  }

  // 2. Valida tamanho do arquivo bruto
  if (file.size > FOTO_TAMANHO_MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    showToast('Foto muito grande (' + mb + ' MB). Máximo: 15 MB.');
    e.target.value = '';
    return;
  }

  // 3. Comprime no cliente antes de subir
  showToast('Otimizando foto...');
  try {
    selectedPhoto = await comprimirImagem(file);
  } catch(err) {
    console.error('comprimirImagem:', err);
    showToast('Erro ao processar foto. Tente outra imagem.');
    e.target.value = '';
    return;
  }

  // 4. Exibe preview
  const wrap = document.getElementById('photo-preview-wrap');
  const img  = document.getElementById('photo-preview');
  img.src = selectedPhoto;
  wrap.style.display = 'block';
}
function removePhoto() {
  selectedPhoto = null;
  document.getElementById('photo-preview-wrap').style.display = 'none';
  document.getElementById('photo-input').value = '';
}

// ── UPLOAD FOTO PARA SUPABASE STORAGE ────────────────────────────────────
async function uploadFotoStorage(dataUrl) {
  if (!_supabase || !dataUrl) return null;
  try {
    const res  = await fetch(dataUrl);
    const blob = await res.blob();

    // Defesa em profundidade: revalida tipo do blob final
    // (após compressão sempre vira image/jpeg, mas guardamos a verificação)
    const tipo = (blob.type || '').toLowerCase();
    if (!FOTO_TIPOS_PERMITIDOS.includes(tipo)) {
      console.error('Upload foto: tipo inválido após compressão:', tipo);
      showToast('Formato de imagem inválido.');
      return null;
    }

    // Defesa em profundidade: o blob comprimido nunca deveria passar do limite,
    // mas se passar (foto enorme + qualidade alta) abortamos.
    if (blob.size > FOTO_TAMANHO_MAX_BYTES) {
      console.error('Upload foto: blob excedeu limite após compressão:', blob.size);
      showToast('Foto muito grande mesmo após otimização.');
      return null;
    }

    const ext  = tipo.includes('png') ? 'png' : (tipo.includes('webp') ? 'webp' : 'jpg');
    const path = `comunidade/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await _supabase.storage.from('fotos').upload(path, blob, {
      contentType: tipo,
      cacheControl: '31536000' // 1 ano — fotos são imutáveis (path único)
    });
    if (error) { console.error('Upload foto:', error.message); return null; }
    const { data } = _supabase.storage.from('fotos').getPublicUrl(path);
    return data.publicUrl;
  } catch(e) { console.error(e); return null; }
}

// ── PUBLISH POST ──────────────────────────────────────────────────────────
async function publishPost() {
  if (!currentUser) { showToast('Faça login para publicar! 🔒'); return; }
  let texto = document.getElementById('post-text').value.trim();
  let tag   = document.getElementById('post-tag').value;
  if (!texto && !selectedPhoto) { showToast('Escreva algo para publicar! ✍️'); return; }

  // Validação defensiva
  if (texto.length > 2000) { showToast('Texto muito longo (máx 2000 caracteres).'); return; }
  // Garante que a tag seja uma das permitidas (não confia no DOM)
  const tagsValidas = ['dica','foto','restaurante','hotel','atração','economia'];
  if (!tagsValidas.includes(tag)) tag = 'dica';

  // Se ainda não tem nome público, pede agora. Isso evita que partes do email
  // virem nome visível ('marcelo.silva' → todo mundo vê o sobrenome).
  if (!getPublicDisplayName()) {
    const escolhido = await pedirNomePublico();
    if (!escolhido) { showToast('Escolha um nome para publicar.'); return; }
    const ok = await setPublicDisplayName(escolhido);
    if (!ok) { showToast('Não foi possível salvar seu nome. Tente de novo.'); return; }
  }

  const btn = document.querySelector('[onclick="publishPost()"]');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }

  let fotoUrl = null;
  if (selectedPhoto) { fotoUrl = await uploadFotoStorage(selectedPhoto); }

  const nome = (getPublicDisplayName() || 'Membro').slice(0, 80); // limite de 80 chars no nome
  const post = {
    autor:    nome,
    avatar:   getInitials(nome),
    cor:      getAvatarColor(nome),
    tag,
    texto,
    foto_url: fotoUrl,
    user_id:  currentUser.id,
    tempo:    new Date().toISOString()
  };

  if (_supabase) {
    const { error } = await _supabase.from('comunidade_posts').insert([post]);
    if (error) {
      showToast('Erro ao publicar: ' + (error.message || error.code || 'tente novamente'));
      console.error('publishPost error:', error);
      track('post_publish_failed', {
        erro_msg: error.message || null,
        erro_code: error.code || null,
        tem_foto: !!fotoUrl,
        texto_length: texto.length,
        tag: tag
      });
      if (btn) { btn.disabled = false; btn.textContent = 'Publicar'; }
      return;
    }
    showToast('Post publicado! 🎉');
    track('post_publish_success', { tem_foto: !!fotoUrl, tag: tag });
    // Recarrega o feed explicitamente (não depende só do realtime)
    await loadPosts();
  } else {
    // fallback local
    post.id = 'local_' + Date.now();
    post.foto = fotoUrl;
    _postsCache.unshift(post);
    renderComunidade();
    showToast('Post publicado! 🎉');
  }

  document.getElementById('post-text').value = '';
  removePhoto();
  if (btn) { btn.disabled = false; btn.textContent = 'Publicar'; }
}

// ── TOGGLE REAÇÃO ─────────────────────────────────────────────────────────
async function toggleReacao(postId, emoji) {
  if (!currentUser) { showToast('Faça login para reagir! 🔒'); return; }
  if (!_supabase) return;

  const post = _postsCache.find(p => p.id === postId);
  if (!post) return;
  if (!post.reacoes) post.reacoes = {};
  if (!post.minhasReacoes) post.minhasReacoes = {};

  const jaReagi = !!post.minhasReacoes[emoji];

  // Atualização otimista (UI responde imediatamente)
  if (jaReagi) {
    post.reacoes[emoji] = Math.max(0, (post.reacoes[emoji] || 1) - 1);
    if (post.reacoes[emoji] === 0) delete post.reacoes[emoji];
    delete post.minhasReacoes[emoji];
  } else {
    post.reacoes[emoji] = (post.reacoes[emoji] || 0) + 1;
    post.minhasReacoes[emoji] = true;
  }
  renderComunidade();

  // Persiste no banco
  let error;
  if (jaReagi) {
    const res = await _supabase
      .from('comunidade_reacoes')
      .delete()
      .match({ post_id: postId, user_id: currentUser.id, emoji: emoji });
    error = res.error;
  } else {
    const res = await _supabase
      .from('comunidade_reacoes')
      .insert([{ post_id: postId, user_id: currentUser.id, emoji: emoji }]);
    error = res.error;
  }

  // Se der erro, reverte e mostra
  if (error) {
    console.error('toggleReacao error:', error);
    if (jaReagi) {
      post.reacoes[emoji] = (post.reacoes[emoji] || 0) + 1;
      post.minhasReacoes[emoji] = true;
    } else {
      post.reacoes[emoji] = Math.max(0, (post.reacoes[emoji] || 1) - 1);
      if (post.reacoes[emoji] === 0) delete post.reacoes[emoji];
      delete post.minhasReacoes[emoji];
    }
    renderComunidade();
    showToast('Erro ao reagir: ' + (error.message || 'tente novamente'));
  }
}

// ── COMMENT BOX ───────────────────────────────────────────────────────────
function showReacaoPicker(postId) {
  const existing = document.getElementById('picker-' + postId);
  if (existing) { existing.remove(); return; }
  document.querySelectorAll('.reacao-picker').forEach(p => p.remove());
  const picker = document.createElement('div');
  picker.id = 'picker-' + postId;
  picker.className = 'reacao-picker';
  picker.style.cssText = 'position:absolute;bottom:44px;left:0;background:var(--bg3);border:1px solid var(--border2);border-radius:14px;padding:8px 12px;display:flex;gap:10px;z-index:10;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
  picker.innerHTML = reacaoEmojis.map(e => `<span onclick="toggleReacao('${postId}','${e}');this.closest('.reacao-picker').remove()" style="font-size:22px;cursor:pointer;transition:transform 0.15s;" onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">${e}</span>`).join('');
  const postEl = document.getElementById('post-' + postId);
  if (postEl) { postEl.style.position = 'relative'; postEl.appendChild(picker); }
}

function showCommentBox(postId) {
  const existing = document.getElementById('comment-box-' + postId);
  if (existing) { existing.remove(); return; }
  document.querySelectorAll('.comment-box').forEach(b => b.remove());
  const box = document.createElement('div');
  box.id = 'comment-box-' + postId;
  box.className = 'comment-box';
  box.style.cssText = 'padding:8px 12px 12px;border-top:1px solid var(--border);background:var(--bg2);';
  const nome = getDisplayName();
  box.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center;">
      <div style="width:28px;height:28px;border-radius:50%;background:${getAvatarColor(nome)};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;">${getInitials(nome)}</div>
      <input id="comment-input-${postId}" placeholder="Adicionar comentário..." style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:20px;color:var(--text);font-family:'Space Grotesk',sans-serif;font-size:11px;padding:8px 14px;outline:none;" onkeydown="if(event.key==='Enter')submitComment('${postId}')" />
      <button onclick="submitComment('${postId}')" style="background:var(--purple);color:#fff;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">➤</button>
    </div>`;
  const postEl = document.getElementById('post-' + postId);
  if (postEl) postEl.appendChild(box);
  setTimeout(() => { const inp = document.getElementById('comment-input-' + postId); if (inp) inp.focus(); }, 50);
}

async function submitComment(postId) {
  if (!currentUser) { showToast('Faça login para comentar! 🔒'); return; }
  const inp = document.getElementById('comment-input-' + postId);
  if (!inp || !inp.value.trim()) return;
  const texto = inp.value.trim();
  if (texto.length > 500) { showToast('Comentário muito longo (máx 500 caracteres).'); return; }
  const post = _postsCache.find(p => p.id === postId);
  if (!post) return;
  if (!post.comentarios) post.comentarios = [];

  // Gate de nome público — mesmo critério do publishPost
  if (!getPublicDisplayName()) {
    const escolhido = await pedirNomePublico();
    if (!escolhido) { showToast('Escolha um nome para comentar.'); return; }
    const ok = await setPublicDisplayName(escolhido);
    if (!ok) { showToast('Não foi possível salvar seu nome. Tente de novo.'); return; }
  }

  const nome = (getPublicDisplayName() || 'Membro').slice(0, 80);
  const novoComentario = {
    post_id: postId,
    user_id: currentUser.id,
    autor: nome,
    cor: getAvatarColor(nome),
    texto: texto
  };

  // Atualização otimista
  const comentarioLocal = Object.assign({}, novoComentario, { _temp: true });
  post.comentarios.push(comentarioLocal);
  inp.value = '';
  renderComunidade();

  if (_supabase) {
    const { data, error } = await _supabase
      .from('comunidade_comentarios')
      .insert([novoComentario])
      .select()
      .single();
    if (error) {
      // Reverte
      const idx = post.comentarios.indexOf(comentarioLocal);
      if (idx !== -1) post.comentarios.splice(idx, 1);
      renderComunidade();
      showToast('Erro ao comentar: ' + (error.message || 'tente novamente'));
      console.error('submitComment error:', error);
      return;
    }
    // Substitui o temporário pelo real (com id e created_at)
    const idx = post.comentarios.indexOf(comentarioLocal);
    if (idx !== -1 && data) post.comentarios[idx] = data;
    renderComunidade();
  }
  showToast('Comentário publicado! 💬');
}

// ── LOAD POSTS ────────────────────────────────────────────────────────────
async function loadPosts() {
  if (!_supabase) { renderComunidade(); return; }
  const feed = document.getElementById('comunidade-feed');
  if (feed && _postsCache.length === 0) {
    feed.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted);font-size:13px;">Carregando posts...</div>';
  }

  // 1ª query: busca os 50 posts mais recentes
  const postsRes = await _supabase
    .from('comunidade_posts')
    .select('*')
    .order('tempo', { ascending: false })
    .limit(50);

  if (postsRes.error) {
    console.error('loadPosts (posts):', postsRes.error);
    if (feed) feed.innerHTML = `<div style="text-align:center;padding:32px;color:#f87171;font-size:12px;">
      Erro ao carregar posts: ${postsRes.error.message || postsRes.error.code}<br>
      <button onclick="loadPosts()" style="margin-top:12px;background:var(--bg3);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px 16px;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:12px;">Tentar novamente</button>
    </div>`;
    return;
  }

  const posts = postsRes.data || [];
  const postIds = posts.map(p => p.id);

  // Se não tem posts, evita chamadas desnecessárias com .in('post_id', [])
  let reacoes = [];
  let comentarios = [];

  if (postIds.length > 0) {
    // 2ª etapa: busca reações e comentários SOMENTE dos posts carregados
    const [reacoesRes, comentariosRes] = await Promise.all([
      _supabase
        .from('comunidade_reacoes')
        .select('post_id, user_id, emoji')
        .in('post_id', postIds),
      _supabase
        .from('comunidade_comentarios')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true })
    ]);

    if (reacoesRes.error) console.error('loadPosts (reacoes):', reacoesRes.error);
    if (comentariosRes.error) console.error('loadPosts (comentarios):', comentariosRes.error);

    reacoes = reacoesRes.data || [];
    comentarios = comentariosRes.data || [];
  }

  const meuId = currentUser ? currentUser.id : null;

  // Agrupa reações por post: { postId: { emoji: count } } e marca quais são minhas
  const reacoesPorPost = {};
  const minhasReacoesPorPost = {};
  reacoes.forEach(r => {
    if (!reacoesPorPost[r.post_id]) reacoesPorPost[r.post_id] = {};
    reacoesPorPost[r.post_id][r.emoji] = (reacoesPorPost[r.post_id][r.emoji] || 0) + 1;
    if (meuId && r.user_id === meuId) {
      if (!minhasReacoesPorPost[r.post_id]) minhasReacoesPorPost[r.post_id] = {};
      minhasReacoesPorPost[r.post_id][r.emoji] = true;
    }
  });

  // Agrupa comentários por post
  const comentariosPorPost = {};
  comentarios.forEach(c => {
    if (!comentariosPorPost[c.post_id]) comentariosPorPost[c.post_id] = [];
    comentariosPorPost[c.post_id].push(c);
  });

  // Anexa dados agregados em cada post
  posts.forEach(p => {
    p.reacoes = reacoesPorPost[p.id] || {};
    p.minhasReacoes = minhasReacoesPorPost[p.id] || {};
    p.comentarios = comentariosPorPost[p.id] || [];
  });

  _postsCache = posts;
  renderComunidade();
}

// ── REALTIME SUBSCRIPTION ─────────────────────────────────────────────────
let _reloadDebounce = null;
function scheduleReload() {
  clearTimeout(_reloadDebounce);
  _reloadDebounce = setTimeout(() => loadPosts(), 400);
}

function initRealtime() {
  if (!_supabase || _chatChannel) return;
  _chatChannel = _supabase
    .channel('comunidade-global')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'comunidade_posts'
    }, function(payload) {
      if (payload.eventType === 'INSERT') {
        const jaExiste = _postsCache.some(p => p.id === payload.new.id);
        if (!jaExiste) {
          // Inicializa campos agregados (reações/comentários carregam vazios pra post novo)
          payload.new.reacoes = {};
          payload.new.minhasReacoes = {};
          payload.new.comentarios = [];
          _postsCache.unshift(payload.new);
          renderComunidade();
          const overlay = document.getElementById('overlay-comunidade');
          if (overlay && !overlay.classList.contains('open')) {
            showToast('Nova mensagem na comunidade! 💬');
          }
        }
      } else if (payload.eventType === 'UPDATE') {
        const idx = _postsCache.findIndex(p => p.id === payload.new.id);
        if (idx !== -1) {
          // Preserva os agregados (reacoes, minhasReacoes, comentarios) ao atualizar
          const existing = _postsCache[idx];
          _postsCache[idx] = Object.assign({}, payload.new, {
            reacoes: existing.reacoes,
            minhasReacoes: existing.minhasReacoes,
            comentarios: existing.comentarios
          });
          renderComunidade();
        }
      } else if (payload.eventType === 'DELETE') {
        _postsCache = _postsCache.filter(p => p.id !== payload.old.id);
        renderComunidade();
      }
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'comunidade_reacoes'
    }, function() {
      // Reações de outros usuários: recarrega (debounced)
      scheduleReload();
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'comunidade_comentarios'
    }, function() {
      // Comentários de outros usuários: recarrega (debounced)
      scheduleReload();
    })
    .subscribe();
}

// ── RENDER ────────────────────────────────────────────────────────────────

// Escapa caracteres HTML perigosos — uso obrigatório para qualquer conteúdo
// vindo de usuário antes de inserir via innerHTML
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escapa para uso dentro de string entre aspas simples em atributo onclick
// (HTML escape + escape das aspas simples e barras invertidas)
function escapeJsArg(s) {
  if (s == null) return '';
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Permite só cores CSS seguras (hex, rgb, rgba, hsl, hsla, palavras-chave básicas)
function safeColor(s, fallback) {
  fallback = fallback || '#555';
  if (typeof s !== 'string') return fallback;
  if (/^#[0-9a-fA-F]{3,8}$/.test(s)) return s;
  if (/^rgba?\([\d.,\s%]+\)$/.test(s)) return s;
  if (/^hsla?\([\d.,\s%]+\)$/.test(s)) return s;
  if (/^[a-zA-Z]{3,20}$/.test(s)) return s; // ex: "red", "purple", "transparent"
  return fallback;
}

// Valida URL de foto — só aceita http(s) externos (sem javascript: ou data: text/html)
function safePhotoUrl(s) {
  if (typeof s !== 'string') return null;
  try {
    const u = new URL(s);
    if (u.protocol === 'https:' || u.protocol === 'http:') return s;
  } catch(e) {}
  return null;
}

function renderComunidade() {
  const feed = document.getElementById('comunidade-feed');
  if (!feed) return;

  // Atualiza avatar do composer com nome real
  const composerAvatar = document.getElementById('composer-avatar');
  if (composerAvatar) {
    const nome = getDisplayName();
    composerAvatar.style.background = getAvatarColor(nome);
    composerAvatar.textContent = getInitials(nome);
  }

  if (_postsCache.length === 0) {
    feed.innerHTML = `<div style="text-align:center;padding:48px 24px;color:var(--muted);">
      <div style="font-size:40px;margin-bottom:12px;">💬</div>
      <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:6px;">Seja o primeiro a postar!</div>
      <div style="font-size:12px;line-height:1.6;">Compartilhe dicas, fotos e experiências em Gramado com a comunidade.</div>
    </div>`;
    return;
  }

  feed.innerHTML = _postsCache.map(p => {
    // Campos sanitizados
    const idHtml      = escapeHtml(p.id);
    const idJs        = escapeJsArg(p.id);
    const autor       = escapeHtml(p.autor || 'Membro');
    const avatarChar  = escapeHtml((p.avatar || 'V').slice(0, 3));
    const corAvatar   = safeColor(p.cor, '#a855f7');
    const texto       = p.texto ? escapeHtml(p.texto) : '';
    const fotoSrc     = safePhotoUrl(p.foto_url || p.foto);
    const tagSafe     = escapeHtml(tagLabels[p.tag] || p.tag || '💡 Dica');

    const reacoesHTML = Object.entries(p.reacoes || {}).filter(([,v]) => v > 0).map(([emoji, count]) => {
      const emojiSafe = escapeHtml(emoji);
      const emojiJs   = escapeJsArg(emoji);
      const countSafe = escapeHtml(count);
      const jáReagiu  = p.minhasReacoes && p.minhasReacoes[emoji];
      return `<span onclick="toggleReacao('${idJs}','${emojiJs}')" style="display:inline-flex;align-items:center;gap:3px;background:${jáReagiu ? 'rgba(168,85,247,0.2)' : 'var(--bg3)'};border:1px solid ${jáReagiu ? 'rgba(168,85,247,0.4)' : 'var(--border)'};border-radius:100px;padding:3px 9px;font-size:12px;cursor:pointer;margin:2px;">${emojiSafe} <span style="font-size:10px;font-weight:700;color:var(--muted);">${countSafe}</span></span>`;
    }).join('');

    const comentariosHTML = (p.comentarios || []).map(c => {
      const cAutor = escapeHtml(c.autor || 'V');
      const cCor   = safeColor(c.cor, '#555');
      const cTexto = escapeHtml(c.texto || '');
      const cInicial = escapeHtml((c.autor || 'V').charAt(0));
      return `
      <div style="display:flex;gap:8px;padding:8px 0;border-top:1px solid var(--border);">
        <div style="width:26px;height:26px;border-radius:50%;background:${cCor};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex-shrink:0;">${cInicial}</div>
        <div>
          <span style="font-size:10px;font-weight:700;color:var(--text);">${cAutor}</span>
          <p style="font-size:11px;color:#b0b0c0;margin-top:2px;line-height:1.5;">${cTexto}</p>
        </div>
      </div>`;
    }).join('');

    const tempoStr = p.tempo ? (() => {
      const diff = Math.floor((Date.now() - new Date(p.tempo).getTime()) / 1000);
      if (diff < 60) return 'agora mesmo';
      if (diff < 3600) return Math.floor(diff/60) + 'm atrás';
      if (diff < 86400) return Math.floor(diff/3600) + 'h atrás';
      return Math.floor(diff/86400) + 'd atrás';
    })() : 'agora mesmo';

    return `
    <div id="post-${idHtml}" style="border-bottom:1px solid var(--border);padding:14px 16px;">
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <div style="width:38px;height:38px;border-radius:50%;background:${corAvatar};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0;">${avatarChar}</div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span style="font-size:12px;font-weight:700;color:var(--text);">${autor}</span>
            <span style="background:rgba(168,85,247,0.1);color:var(--purple);font-size:9px;font-weight:700;padding:2px 8px;border-radius:100px;border:1px solid rgba(168,85,247,0.2);">${tagSafe}</span>
            <span style="font-size:10px;color:var(--muted);margin-left:auto;">${tempoStr}</span>
          </div>
          ${texto ? `<p style="font-size:12px;color:#c8c8d8;margin-top:6px;line-height:1.65;white-space:pre-wrap;word-break:break-word;">${texto}</p>` : ''}
          ${fotoSrc ? `<img src="${escapeHtml(fotoSrc)}" alt="" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-top:8px;border:1px solid var(--border);" loading="lazy" />` : ''}
          ${reacoesHTML ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:2px;">${reacoesHTML}</div>` : ''}
          <div style="display:flex;gap:12px;margin-top:10px;padding-top:8px;border-top:1px solid var(--border);">
            <button onclick="showReacaoPicker('${idJs}')" style="display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;padding:0;font-family:'Space Grotesk',sans-serif;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              Reagir
            </button>
            <button onclick="showCommentBox('${idJs}')" style="display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;padding:0;font-family:'Space Grotesk',sans-serif;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              ${p.comentarios && p.comentarios.length ? p.comentarios.length + ' comentário' + (p.comentarios.length > 1 ? 's' : '') : 'Comentar'}
            </button>
          </div>
          ${comentariosHTML ? `<div style="margin-top:4px;">${comentariosHTML}</div>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

// Chamado ao abrir a aba comunidade
async function renderComunidadeInit() {
  await loadPosts();
  initRealtime();
}



