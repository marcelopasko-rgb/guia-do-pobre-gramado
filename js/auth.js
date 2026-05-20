// ── CONFIGURAÇÃO SUPABASE ─────────────────────────────────────────────────
const SUPABASE_URL  = 'https://jltxatuypkmchitkafkq.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdHhhdHV5cGttY2hpdGthZmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDA2ODMsImV4cCI6MjA5NDExNjY4M30.MjUcamBUOw_l03xDmld4eipIxY-1VM5uQTql1aRRD68';

let _supabase = null;
try {
  if (window.supabase) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    });
  }
} catch(e) { console.warn('Supabase SDK indisponível.', e); }

// ── ESTADO ────────────────────────────────────────────────────────────────
let currentUser = null;

function hideSessionLoading() {
  const el = document.getElementById('session-loading');
  if (el) el.style.display = 'none';
}

// ── INIT ──────────────────────────────────────────────────────────────────
(async function initAuth() {
  if (!_supabase) { hideSessionLoading(); showLoginOverlay(); return; }
  try {
    var hash = window.location.hash;
    var params = new URLSearchParams(window.location.search);
    var tokenHash = params.get('token_hash');
    var tokenType = params.get('type');

    // PKCE flow: link do email traz ?token_hash=...&type=email
    // (template novo configurado no Supabase Dashboard)
    if (tokenHash && tokenType) {
      try {
        var vr = await _supabase.auth.verifyOtp({ token_hash: tokenHash, type: tokenType });
        if (vr.error) throw vr.error;
        if (vr.data && vr.data.user) {
          hideSessionLoading();
          onLoginSuccess(vr.data.user);
          history.replaceState(null, '', window.location.pathname);
          return;
        }
      } catch (err) {
        console.error('Erro ao verificar token_hash:', err);
        hideSessionLoading();
        showLoginOverlay();
        setTimeout(function() {
          var msgEl = document.getElementById('login-msg');
          if (msgEl) {
            msgEl.textContent = 'Link expirado ou já usado. Solicite um novo código.';
            msgEl.className = 'login-msg error';
          }
        }, 100);
        history.replaceState(null, '', window.location.pathname);
        return;
      }
    }

    // Fluxo antigo (fallback): magic link com #access_token no hash
    if (hash && hash.includes('access_token')) {
      _supabase.auth.onAuthStateChange(function(event, session) {
        if (session && session.user) {
          hideSessionLoading();
          onLoginSuccess(session.user);
          history.replaceState(null, '', window.location.pathname);
        } else if (event === 'SIGNED_OUT') {
          currentUser = null;
          hideSessionLoading();
          showLoginOverlay();
        }
      });
      await _supabase.auth.getSession();
      return;
    }

    // Sem token na URL — tenta recuperar sessão salva no localStorage
    const { data: { session } } = await _supabase.auth.getSession();
    if (session && session.user) {
      hideSessionLoading();
      onLoginSuccess(session.user);
      _supabase.auth.onAuthStateChange(function(event, session) {
        if (event === 'SIGNED_OUT') { currentUser = null; showLoginOverlay(); }
        else if (event === 'TOKEN_REFRESHED' && session?.user) { currentUser = session.user; }
      });
      return;
    }

    // Nenhuma sessão — mostra login
    hideSessionLoading();
    _supabase.auth.onAuthStateChange(function(event, session) {
      if (session && session.user) {
        onLoginSuccess(session.user);
        history.replaceState(null, '', window.location.pathname);
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        showLoginOverlay();
      }
    });
    showLoginOverlay();
  } catch(e) {
    console.error(e);
    hideSessionLoading();
    showLoginOverlay();
  }
})()

// ── SHOW / HIDE OVERLAY ───────────────────────────────────────────────────
function showLoginOverlay() {
  var ov = document.getElementById('login-overlay');
  if (ov) {
    ov.classList.remove('hidden');
    // Impede fechar clicando no backdrop
    ov.onclick = function(e) { e.stopPropagation(); };
  }
}
function hideLoginOverlay() {
  var ov = document.getElementById('login-overlay');
  if (ov) ov.classList.add('hidden');
}

// ── MENSAGENS ─────────────────────────────────────────────────────────────
function showMsg(text, type) {
  var el = document.getElementById('login-msg');
  if (!el) return;
  el.textContent = text;
  el.className = 'login-msg ' + (type || 'error');
}
function clearMsg() {
  var el = document.getElementById('login-msg');
  if (!el) return;
  el.className = 'login-msg';
  el.textContent = '';
}

// ── LOADING STATE ─────────────────────────────────────────────────────────
function setLoading(on, btnId, defaultText) {
  btnId = btnId || 'login-cta-btn';
  defaultText = defaultText || 'Enviar link de acesso';
  var btn = document.getElementById(btnId);
  if (!btn) return;
  if (on) {
    btn.disabled = true;
    btn.innerHTML = '<div class="btn-spinner"></div>';
  } else {
    btn.disabled = false;
    btn.innerHTML = '<span>' + defaultText + '</span>';
  }
}

// ── ENVIAR CÓDIGO OTP ─────────────────────────────────────────────────────
async function handleSendOtp() {
  clearMsg();
  var emailEl = document.getElementById('input-email');
  var email   = emailEl ? emailEl.value.trim().toLowerCase() : '';

  if (!email) {
    showMsg('Digite seu e-mail.');
    track('login_send_failed', { motivo: 'email_vazio' });
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showMsg('E-mail inválido.');
    track('login_send_failed', { motivo: 'email_invalido' });
    return;
  }

  setLoading(true, 'login-cta-btn', 'Enviar link de acesso');

  if (!_supabase) {
    setLoading(false, 'login-cta-btn', 'Enviar link de acesso');
    showMsg('Erro de conexão. Tente novamente.');
    track('login_send_failed', { motivo: 'supabase_indisponivel' });
    return;
  }

  // signInWithOtp SEM emailRedirectTo (fluxo implicit).
  // O template do email agora só envia o código de 8 dígitos, sem link clicável.
  // Como não há link, não há vetor de pré-clique por antivírus/preview de email,
  // e o fluxo implicit funciona perfeitamente em PWA instalada (sem dor de
  // cross-context que o PKCE traz).
  console.log('[OTP DEBUG] Solicitando código para:', email);
  var res = await _supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: false
    }
  });

  console.log('[OTP DEBUG] Resposta da solicitação:', {
    success: !res.error,
    error: res.error ? res.error.message : null
  });

  setLoading(false, 'login-cta-btn', 'Enviar link de acesso');

  if (res.error) {
    var errMsg = (res.error.message || '').toLowerCase();
    var motivo = 'erro_desconhecido';
    if (errMsg.includes('signups not allowed')) {
      showMsg('E-mail não encontrado. Verifique se usou o mesmo e-mail da compra.');
      motivo = 'email_nao_cadastrado';
    } else if (errMsg.includes('rate limit')) {
      showMsg('Muitas tentativas. Espere 60 segundos e tente de novo.');
      motivo = 'rate_limit';
    } else {
      showMsg(res.error.message || 'Erro ao enviar código.');
    }
    track('login_send_failed', {
      motivo: motivo,
      erro_msg: res.error.message || null,
      erro_status: res.error.status || null,
      email_dominio: email.split('@')[1] || null
    });
    return;
  }

  track('login_send_success', { email_dominio: email.split('@')[1] || null });

  // Registra o timestamp da solicitação pra diagnóstico no verifyOtp
  window._otpRequestedAt = Date.now();

  // Mostra a etapa do código
  document.getElementById('step-email').style.display = 'none';
  document.getElementById('step-otp').style.display = 'block';
  document.getElementById('otp-email-display').textContent = email;
  // Guarda o email para usar no verify
  window._otpEmail = email;
  // Foca no input do código
  setTimeout(function() {
    var otpInput = document.getElementById('input-otp');
    if (otpInput) otpInput.focus();
  }, 200);
}

// ── VERIFICAR CÓDIGO OTP ──────────────────────────────────────────────────
async function handleVerifyOtp() {
  clearMsg();
  var otpEl = document.getElementById('input-otp');
  var token = otpEl ? otpEl.value.trim() : '';
  var email = window._otpEmail || '';

  if (!token) {
    showMsg('Digite o código de 8 dígitos.');
    track('login_verify_failed', { motivo: 'codigo_vazio' });
    return;
  }
  if (token.length !== 8 || !/^\d{8}$/.test(token)) {
    showMsg('Código deve ter 8 dígitos.');
    track('login_verify_failed', { motivo: 'formato_invalido', token_length: token.length });
    return;
  }
  if (!email) {
    showMsg('Sessão expirou. Recomece o login.');
    track('login_verify_failed', { motivo: 'sem_email_na_sessao' });
    backToEmail();
    return;
  }

  setLoading(true, 'verify-cta-btn', 'Entrar');

  // ── DIAGNÓSTICO DE LOGIN ──────────────────────────────────────────────
  // Loga tudo no console pra investigar problemas intermitentes de "código expirado".
  // Compare timestamps entre quando o código foi solicitado e quando você digitou.
  var dbgStart = Date.now();
  var dbgRequested = window._otpRequestedAt || null;
  var dbgElapsedSec = dbgRequested ? Math.round((Date.now() - dbgRequested) / 1000) : null;
  console.log('[OTP DEBUG] Verificando código...', {
    email: email,
    tokenLength: token.length,
    requestedAt: dbgRequested ? new Date(dbgRequested).toISOString() : 'desconhecido',
    elapsedSinceRequest: dbgRequested ? (dbgElapsedSec + 's') : 'desconhecido',
    nowAt: new Date(dbgStart).toISOString()
  });

  var res = await _supabase.auth.verifyOtp({
    email: email,
    token: token,
    type: 'email'
  });

  console.log('[OTP DEBUG] Resposta do Supabase:', {
    elapsed: (Date.now() - dbgStart) + 'ms',
    success: !res.error,
    error: res.error ? {
      message: res.error.message,
      status: res.error.status,
      code: res.error.code || res.error.error_code || null,
      name: res.error.name
    } : null,
    user: res.data && res.data.user ? { id: res.data.user.id, email: res.data.user.email } : null
  });

  setLoading(false, 'verify-cta-btn', 'Entrar');

  if (res.error) {
    var errMsg = (res.error.message || '').toLowerCase();
    var motivo = 'erro_desconhecido';
    if (errMsg.includes('expired')) {
      showMsg('Código expirado. Peça um novo código.');
      motivo = 'expirado';
    } else if (errMsg.includes('invalid')) {
      showMsg('Código inválido. Verifique e tente de novo.');
      motivo = 'codigo_invalido';
    } else {
      showMsg(res.error.message || 'Erro ao verificar código.');
    }
    track('login_verify_failed', {
      motivo: motivo,
      erro_msg: res.error.message || null,
      erro_status: res.error.status || null,
      tempo_desde_solicitacao_seg: dbgElapsedSec
    });
    return;
  }

  // Sucesso! O onAuthStateChange vai disparar e chamar onLoginSuccess.
  track('login_verify_success', { tempo_desde_solicitacao_seg: dbgElapsedSec });
}

// ── VOLTAR PARA TELA DE EMAIL ─────────────────────────────────────────────
function backToEmail() {
  clearMsg();
  document.getElementById('step-otp').style.display = 'none';
  document.getElementById('step-email').style.display = 'block';
  var otpInput = document.getElementById('input-otp');
  if (otpInput) otpInput.value = '';
  window._otpEmail = null;
}

// Auto-submit quando o usuário cola/digita o código completo
document.addEventListener('DOMContentLoaded', function() {
  var otpInput = document.getElementById('input-otp');
  if (otpInput) {
    otpInput.addEventListener('input', function(e) {
      // Mantém apenas dígitos
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
      if (e.target.value.length === 8) {
        handleVerifyOtp();
      }
    });
  }
});

// ── ON LOGIN SUCCESS ──────────────────────────────────────────────────────
function onLoginSuccess(user) {
  currentUser = user;
  hideLoginOverlay();
  updateHeaderForUser(user);
  // Saudação: usa nome customizado se houver, senão genérico "viajante".
  // NÃO usa pedaço do email — vaza dados pessoais em screenshots/posts.
  var meta = user.user_metadata || {};
  var name = (meta.full_name || meta.name || '').trim() || 'viajante';
  showToast('Bem-vindo, ' + name + '! 🎉');
  // Carrega roteiro personalizado em background
  carregarRoteiroPersonalizado();
  // Gatilho PWA — usuário acabou de ver valor real no produto
  setTimeout(pwaTrigger, 3500);
}

/* ═══ TRACKING DE CLIQUES ═══ */
async function track(evento, payload = {}) {
  if (!_supabase) return;
  try {
    // Usa currentUser em cache em vez de fazer round-trip a cada evento.
    // (currentUser é setado por onLoginSuccess/auth state change)
    const { error } = await _supabase.from('eventos').insert({
      user_id: currentUser ? currentUser.id : null,
      evento,
      payload
    });
    if (error) console.warn('track(' + evento + ') falhou:', error.message || error);
  } catch(e) {
    console.warn('track(' + evento + ') exception:', e);
  }
}

// Flag pra disparar o prompt PWA na primeira interação com botão de desconto
let _pwaDiscountTriggered = false;

// Delegação ÚNICA de eventos — captura cliques em botões de desconto.
// Faz tracking + dispara PWA prompt na primeira vez, tudo em um handler só.
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-comprar, .btn-roteiro-desconto');
  if (!btn) return;

  // Descobre em qual overlay estamos
  const overlay = btn.closest('.overlay');
  const overlayId = overlay ? overlay.id : 'home';

  // Pega o nome do item pelo elemento pai mais próximo com título
  const card = btn.closest('.attr-card, .park-item, [class*="rest"]');
  const titulo = card
    ? (card.querySelector('h5')?.textContent || card.querySelector('.park-name')?.textContent || '').trim()
    : '';

  // Identifica o tipo de evento pela aba
  let evento = 'clique_desconto';
  if (overlayId === 'overlay-promocoes') evento = 'clique_parque';
  else if (overlayId === 'overlay-restaurantes') evento = 'clique_restaurante';
  else if (overlayId === 'overlay-atracoes') evento = 'clique_atracao';

  track(evento, { nome: titulo, overlay: overlayId, href: btn.href || null });

  // Dispara prompt de instalação PWA na primeira vez (sinal forte de engajamento)
  if (!_pwaDiscountTriggered) {
    _pwaDiscountTriggered = true;
    pwaTrigger();
  }
});


function updateHeaderForUser(user) {
  var badge = document.querySelector('.app-header-badge');
  if (!badge) return;
  // Mesma regra do toast: nome customizado ou genérico. NÃO usa pedaço do email,
  // que seria visível no header e em screenshots.
  var meta = user.user_metadata || {};
  var displayName = (meta.full_name || meta.name || '').trim() || 'Membro';
  var initials = displayName.slice(0, 2).toUpperCase();
  var chip = document.createElement('div');
  chip.className = 'user-chip';
  chip.onclick   = handleLogout;
  chip.title     = 'Sair da conta';
  chip.innerHTML = '<div class="user-avatar">' + initials + '</div><span class="user-name">' + displayName + '</span>';
  badge.replaceWith(chip);
}

// ── LOGOUT ────────────────────────────────────────────────────────────────
// Abre a sheet de confirmação (substitui o confirm() nativo, que quebrava a estética).
function handleLogout() {
  const sheet = document.getElementById('logout-sheet');
  const panel = document.getElementById('logout-panel');
  if (!sheet || !panel) return;
  sheet.style.display = 'block';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      panel.style.transform = 'translateY(0)';
    });
  });
}

function logoutDismiss() {
  const sheet = document.getElementById('logout-sheet');
  const panel = document.getElementById('logout-panel');
  if (!sheet || !panel) return;
  panel.style.transform = 'translateY(100%)';
  setTimeout(function() { sheet.style.display = 'none'; }, 350);
}

async function logoutConfirm() {
  logoutDismiss();
  if (_supabase) await _supabase.auth.signOut();
  currentUser = null;
  var chip = document.querySelector('.user-chip');
  if (chip) {
    var badge = document.createElement('div');
    badge.className = 'app-header-badge';
    badge.textContent = 'MEMBRO';
    chip.replaceWith(badge);
  }
  showLoginOverlay();
}

/* ═══ PWA INSTALL PROMPT ═══ */
let _pwaDeferred = null;
let _pwaShownThisSession = false;

// Captura o evento antes que o navegador mostre automaticamente
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _pwaDeferred = e;
});

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

function pwaAlreadyDismissed() {
  const d = localStorage.getItem('pwa_dismissed');
  if (!d) return false;
  // Mostra de novo depois de 7 dias
  return (Date.now() - parseInt(d)) < 7 * 24 * 60 * 60 * 1000;
}

function pwaShowSheet() {
  if (_pwaShownThisSession) return;
  if (isInStandaloneMode()) return;       // já instalado
  if (pwaAlreadyDismissed()) return;      // dispensou recentemente

  const sheet = document.getElementById('pwa-sheet');
  const panel = document.getElementById('pwa-panel');
  const androidDiv = document.getElementById('pwa-android');
  const iosDiv = document.getElementById('pwa-ios');

  // iOS: sem prompt nativo, mostra instruções manuais
  if (isIos()) {
    androidDiv.style.display = 'none';
    iosDiv.style.display = 'block';
  } else if (!_pwaDeferred) {
    return; // Android/Desktop mas sem evento capturado (já instalado ou não elegível)
  }

  _pwaShownThisSession = true;
  sheet.style.display = 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.style.transform = 'translateY(0)';
    });
  });
}

async function pwaInstall() {
  if (!_pwaDeferred) return;
  _pwaDeferred.prompt();
  const { outcome } = await _pwaDeferred.userChoice;
  _pwaDeferred = null;
  pwaSheetDismiss();
  if (outcome === 'accepted') {
    showToast('✅ Guia adicionado à tela inicial!');
  }
}

function pwaSheetDismiss() {
  const panel = document.getElementById('pwa-panel');
  panel.style.transform = 'translateY(100%)';
  localStorage.setItem('pwa_dismissed', Date.now().toString());
  setTimeout(() => {
    document.getElementById('pwa-sheet').style.display = 'none';
  }, 350);
}

// Gatilhos de momento certo — chamados em pontos de alto engajamento
function pwaTrigger() {
  setTimeout(pwaShowSheet, 800); // pequeno delay para não interromper a ação
}

