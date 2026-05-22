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

    // PKCE flow (link do email antigo, mantido como fallback)
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
          showMsg('Link expirado ou já usado. Faça login com sua senha abaixo.', 'error');
        }, 100);
        history.replaceState(null, '', window.location.pathname);
        return;
      }
    }

    // Magic link com hash (fallback)
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

    // Sem token na URL — tenta recuperar sessão salva
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
  var btn = document.getElementById(btnId);
  if (!btn) return;
  if (on) {
    btn.disabled = true;
    btn.dataset._oldHtml = btn.innerHTML;
    btn.innerHTML = '<div class="btn-spinner"></div>';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset._oldHtml || ('<span>' + (defaultText || 'Continuar') + '</span>');
    delete btn.dataset._oldHtml;
  }
}

// ── NAVEGAÇÃO ENTRE ETAPAS ────────────────────────────────────────────────
function showStep(stepId) {
  var steps = ['step-email', 'step-senha', 'step-criar-senha', 'step-otp'];
  steps.forEach(function(s) {
    var el = document.getElementById(s);
    if (el) el.style.display = (s === stepId) ? 'block' : 'none';
  });
  // Foca primeiro input visível
  setTimeout(function() {
    var step = document.getElementById(stepId);
    if (step) {
      var firstInput = step.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  }, 200);
}

// ── ETAPA 1: VERIFICAR EMAIL E DECIDIR FLUXO ──────────────────────────────
async function handleCheckEmail() {
  clearMsg();
  var emailEl = document.getElementById('input-email');
  var email = emailEl ? emailEl.value.trim().toLowerCase() : '';

  if (!email) {
    showMsg('Digite seu e-mail.');
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showMsg('E-mail inválido.');
    return;
  }

  setLoading(true, 'check-email-btn');

  try {
    var res = await fetch('/api/checar-acesso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    var data = await res.json();
    setLoading(false, 'check-email-btn');

    if (!res.ok) {
      showMsg(data.error || 'Erro ao verificar e-mail. Tente novamente.');
      track('login_check_failed', { motivo: 'erro_servidor', status: res.status });
      return;
    }

    // Guarda email pras próximas etapas
    window._loginEmail = email;

    if (!data.existe) {
      showMsg('E-mail não encontrado. Verifique se é o mesmo da sua compra.');
      track('login_check_failed', { motivo: 'email_nao_cadastrado', email_dominio: email.split('@')[1] });
      return;
    }

    if (data.tem_senha) {
      // Usuário com senha → tela de login normal
      var emailDisp = document.getElementById('senha-email-display');
      if (emailDisp) emailDisp.textContent = email;
      showStep('step-senha');
      track('login_check_success', { fluxo: 'login_senha' });
    } else {
      // Usuário sem senha (criado pela Edge Function ou logou antes só via OTP)
      // → força a criar uma senha agora
      var emailDispC = document.getElementById('criar-senha-email-display');
      if (emailDispC) emailDispC.textContent = email;
      showStep('step-criar-senha');
      track('login_check_success', { fluxo: 'criar_senha' });
    }
  } catch (err) {
    setLoading(false, 'check-email-btn');
    showMsg('Erro de conexão. Verifique sua internet e tente de novo.');
    console.error('[checar-acesso] exception:', err);
    track('login_check_failed', { motivo: 'exception', erro: String(err) });
  }
}

// ── ETAPA 2A: LOGIN COM SENHA ─────────────────────────────────────────────
async function handleLoginSenha() {
  clearMsg();
  var senhaEl = document.getElementById('input-senha');
  var senha = senhaEl ? senhaEl.value : '';
  var email = window._loginEmail || '';

  if (!email) {
    showMsg('Sessão expirou. Recomece.');
    backToEmail();
    return;
  }
  if (!senha) {
    showMsg('Digite sua senha.');
    return;
  }

  setLoading(true, 'login-senha-btn');

  try {
    var res = await _supabase.auth.signInWithPassword({ email: email, password: senha });
    setLoading(false, 'login-senha-btn');

    if (res.error) {
      var errMsg = (res.error.message || '').toLowerCase();
      if (errMsg.includes('invalid login') || errMsg.includes('invalid credentials')) {
        showMsg('Senha incorreta. Tente novamente ou use "Esqueci minha senha".');
        track('login_senha_failed', { motivo: 'senha_incorreta' });
      } else if (errMsg.includes('rate limit') || errMsg.includes('too many')) {
        showMsg('Muitas tentativas. Espere 60 segundos e tente de novo.');
        track('login_senha_failed', { motivo: 'rate_limit' });
      } else {
        showMsg(res.error.message || 'Erro ao entrar.');
        track('login_senha_failed', { motivo: 'erro_desconhecido', erro: res.error.message });
      }
      return;
    }

    track('login_senha_success', {});
    // onAuthStateChange dispara e chama onLoginSuccess
  } catch (err) {
    setLoading(false, 'login-senha-btn');
    showMsg('Erro de conexão. Tente novamente.');
    console.error('[login-senha] exception:', err);
  }
}

// ── ETAPA 2B: CRIAR SENHA (primeiro acesso OU usuário antigo sem senha) ───
async function handleCriarSenha() {
  clearMsg();
  var s1 = document.getElementById('input-nova-senha');
  var s2 = document.getElementById('input-confirma-senha');
  var senha1 = s1 ? s1.value : '';
  var senha2 = s2 ? s2.value : '';
  var email = window._loginEmail || '';

  if (!email) {
    showMsg('Sessão expirou. Recomece.');
    backToEmail();
    return;
  }
  if (!senha1 || senha1.length < 6) {
    showMsg('Senha precisa de no mínimo 6 caracteres.');
    return;
  }
  if (senha1.length > 72) {
    showMsg('Senha muito longa (máx. 72 caracteres).');
    return;
  }
  if (senha1 !== senha2) {
    showMsg('As senhas não coincidem.');
    return;
  }

  setLoading(true, 'criar-senha-btn');

  try {
    // 1. Cria/atualiza a senha no servidor
    var res = await fetch('/api/criar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, senha: senha1 })
    });

    var data = await res.json();

    if (!res.ok) {
      setLoading(false, 'criar-senha-btn');
      showMsg(data.error || 'Erro ao criar senha. Tente novamente.');
      track('criar_senha_failed', { motivo: 'erro_servidor', status: res.status });
      return;
    }

    track('criar_senha_success', {});

    // 2. Loga automaticamente com a senha recém-criada
    var loginRes = await _supabase.auth.signInWithPassword({ email: email, password: senha1 });
    setLoading(false, 'criar-senha-btn');

    if (loginRes.error) {
      showMsg('Senha criada, mas erro no login automático. Tente entrar manualmente.');
      track('criar_senha_login_falhou', { erro: loginRes.error.message });
      // Volta pra tela de senha
      var emailDisp = document.getElementById('senha-email-display');
      if (emailDisp) emailDisp.textContent = email;
      showStep('step-senha');
      return;
    }

    // Sucesso → onAuthStateChange dispara onLoginSuccess
  } catch (err) {
    setLoading(false, 'criar-senha-btn');
    showMsg('Erro de conexão. Tente novamente.');
    console.error('[criar-senha] exception:', err);
  }
}

// ── ETAPA OPCIONAL: ESQUECI MINHA SENHA (envia OTP) ───────────────────────
async function handleEsqueciSenha() {
  clearMsg();
  var email = window._loginEmail || '';
  if (!email) {
    showMsg('Digite o e-mail primeiro.');
    backToEmail();
    return;
  }

  setLoading(true, 'esqueci-senha-btn');

  try {
    var res = await _supabase.auth.signInWithOtp({
      email: email,
      options: { shouldCreateUser: false }
    });

    setLoading(false, 'esqueci-senha-btn');

    if (res.error) {
      var errMsg = (res.error.message || '').toLowerCase();
      if (errMsg.includes('rate limit')) {
        showMsg('Muitas tentativas. Espere 60 segundos.');
      } else {
        showMsg(res.error.message || 'Erro ao enviar código.');
      }
      track('esqueci_senha_failed', { erro: res.error.message });
      return;
    }

    track('esqueci_senha_success', {});
    window._otpRequestedAt = Date.now();

    // Mostra etapa do código OTP
    var otpDisp = document.getElementById('otp-email-display');
    if (otpDisp) otpDisp.textContent = email;
    showStep('step-otp');
  } catch (err) {
    setLoading(false, 'esqueci-senha-btn');
    showMsg('Erro de conexão. Tente novamente.');
    console.error('[esqueci-senha] exception:', err);
  }
}

// ── VERIFICAR CÓDIGO OTP (fluxo "esqueci senha") ──────────────────────────
async function handleVerifyOtp() {
  clearMsg();
  var otpEl = document.getElementById('input-otp');
  var token = otpEl ? otpEl.value.trim() : '';
  var email = window._loginEmail || '';

  if (!token) {
    showMsg('Digite o código de 8 dígitos.');
    return;
  }
  if (token.length !== 8 || !/^\d{8}$/.test(token)) {
    showMsg('Código deve ter 8 dígitos.');
    return;
  }
  if (!email) {
    showMsg('Sessão expirou. Recomece.');
    backToEmail();
    return;
  }

  setLoading(true, 'verify-cta-btn');

  var dbgRequested = window._otpRequestedAt || null;
  var dbgElapsedSec = dbgRequested ? Math.round((Date.now() - dbgRequested) / 1000) : null;

  try {
    var res = await _supabase.auth.verifyOtp({ email: email, token: token, type: 'email' });

    setLoading(false, 'verify-cta-btn');

    if (res.error) {
      var errMsg = (res.error.message || '').toLowerCase();
      if (errMsg.includes('expired')) {
        showMsg('Código expirado. Peça um novo código.');
      } else if (errMsg.includes('invalid')) {
        showMsg('Código inválido. Verifique e tente de novo.');
      } else {
        showMsg(res.error.message || 'Erro ao verificar código.');
      }
      track('login_verify_failed', { motivo: errMsg, tempo_seg: dbgElapsedSec });
      return;
    }

    track('login_verify_success', { tempo_seg: dbgElapsedSec });

    // Após login via OTP, oferece criar senha pra próxima vez (não obriga)
    // O usuário já está logado; mostramos uma flag pra abrir um modal opcional depois
    window._sugerirCriarSenha = true;

  } catch (err) {
    setLoading(false, 'verify-cta-btn');
    showMsg('Erro de conexão. Tente novamente.');
    console.error('[verify-otp] exception:', err);
  }
}

// ── VOLTAR PARA TELA DE EMAIL ─────────────────────────────────────────────
function backToEmail() {
  clearMsg();
  ['input-senha', 'input-nova-senha', 'input-confirma-senha', 'input-otp'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  window._loginEmail = null;
  window._otpRequestedAt = null;
  showStep('step-email');
}

// ── ENTER + AUTO-SUBMIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Enter no campo de email
  var inputEmail = document.getElementById('input-email');
  if (inputEmail) {
    inputEmail.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); handleCheckEmail(); }
    });
  }

  // Enter no campo de senha
  var inputSenha = document.getElementById('input-senha');
  if (inputSenha) {
    inputSenha.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); handleLoginSenha(); }
    });
  }

  // Enter no confirmar senha
  var inputConfirma = document.getElementById('input-confirma-senha');
  if (inputConfirma) {
    inputConfirma.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); handleCriarSenha(); }
    });
  }

  // Auto-submit no OTP (8 dígitos)
  var otpInput = document.getElementById('input-otp');
  if (otpInput) {
    otpInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
      if (e.target.value.length === 8) handleVerifyOtp();
    });
  }
});

// ── ON LOGIN SUCCESS ──────────────────────────────────────────────────────
function onLoginSuccess(user) {
  currentUser = user;
  hideLoginOverlay();
  updateHeaderForUser(user);
  var meta = user.user_metadata || {};
  var name = (meta.full_name || meta.name || '').trim() || 'viajante';
  showToast('Bem-vindo, ' + name + '! 🎉');
  carregarRoteiroPersonalizado();
  setTimeout(pwaTrigger, 3500);
}

/* ═══ TRACKING DE CLIQUES ═══ */
async function track(evento, payload = {}) {
  if (!_supabase) return;
  try {
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

let _pwaDiscountTriggered = false;

document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-comprar, .btn-roteiro-desconto');
  if (!btn) return;

  const overlay = btn.closest('.overlay');
  const overlayId = overlay ? overlay.id : 'home';

  const card = btn.closest('.attr-card, .park-item, [class*="rest"]');
  const titulo = card
    ? (card.querySelector('h5')?.textContent || card.querySelector('.park-name')?.textContent || '').trim()
    : '';

  let evento = 'clique_desconto';
  if (overlayId === 'overlay-promocoes') evento = 'clique_parque';
  else if (overlayId === 'overlay-restaurantes') evento = 'clique_restaurante';
  else if (overlayId === 'overlay-atracoes') evento = 'clique_atracao';

  track(evento, { nome: titulo, overlay: overlayId, href: btn.href || null });

  if (!_pwaDiscountTriggered) {
    _pwaDiscountTriggered = true;
    pwaTrigger();
  }
});


function updateHeaderForUser(user) {
  var badge = document.querySelector('.app-header-badge');
  if (!badge) return;
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
  backToEmail();
}

/* ═══ PWA INSTALL PROMPT ═══ */
let _pwaDeferred = null;
let _pwaShownThisSession = false;

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
  return (Date.now() - parseInt(d)) < 7 * 24 * 60 * 60 * 1000;
}

function pwaShowSheet() {
  if (_pwaShownThisSession) return;
  if (isInStandaloneMode()) return;
  if (pwaAlreadyDismissed()) return;

  const sheet = document.getElementById('pwa-sheet');
  const panel = document.getElementById('pwa-panel');
  const androidDiv = document.getElementById('pwa-android');
  const iosDiv = document.getElementById('pwa-ios');

  if (isIos()) {
    androidDiv.style.display = 'none';
    iosDiv.style.display = 'block';
  } else if (!_pwaDeferred) {
    return;
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

function pwaTrigger() {
  setTimeout(pwaShowSheet, 800);
}
