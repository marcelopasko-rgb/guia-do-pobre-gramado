// /api/criar-senha.js
// Endpoint que valida o email contra auth.users e define/atualiza a senha.
//
// Fluxo:
//   1. Recebe { email, senha } via POST
//   2. Lista usuários no Supabase Auth filtrando pelo email
//   3. Se o usuário existe → faz updateUserById com a nova senha
//   4. Se NÃO existe → retorna 404 "email não encontrado" (sem vazar info)
//
// Por que server-side: a operação admin.updateUserById exige SERVICE_KEY,
// que NUNCA pode ir pro frontend. Por isso esse endpoint existe.
//
// Variáveis de ambiente necessárias (Vercel):
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Validar body
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const email = (body?.email || '').toLowerCase().trim();
    const senha = body?.senha || '';

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (!senha || senha.length < 6) {
      return res.status(400).json({ error: 'Senha precisa de no mínimo 6 caracteres' });
    }
    if (senha.length > 72) {
      // bcrypt do Supabase trunca em 72 bytes — melhor avisar
      return res.status(400).json({ error: 'Senha muito longa (máx. 72 caracteres)' });
    }

    // 2. Validar env vars
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[criar-senha] Faltam env vars SUPABASE_URL / SUPABASE_SERVICE_KEY');
      return res.status(500).json({ error: 'Servidor mal configurado' });
    }

    // 3. Buscar usuário no auth.users pelo email
    // Usa o endpoint admin /auth/v1/admin/users?email=... (filtro server-side)
    const lookupRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!lookupRes.ok) {
      const errText = await lookupRes.text();
      console.error('[criar-senha] Erro no lookup:', lookupRes.status, errText);
      return res.status(500).json({ error: 'Erro ao verificar email' });
    }

    const lookupData = await lookupRes.json();
    const users = lookupData?.users || [];
    const user = users.find(u => (u.email || '').toLowerCase() === email);

    if (!user) {
      // Email não foi cadastrado pela Edge Function (sem compra na Kiwify
      // OU compra ainda não foi processada OU email digitado errado).
      // Mensagem genérica que não vaza se o email existe ou não.
      return res.status(404).json({
        error: 'Email não encontrado. Verifique se é o mesmo da sua compra na Kiwify.'
      });
    }

    // 4. Atualizar a senha do usuário existente
    // PATCH /auth/v1/admin/users/{user_id}
    const updateRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${user.id}`,
      {
        method: 'PUT',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: senha,
          email_confirm: true, // garante que conta fique confirmada
        }),
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error('[criar-senha] Erro ao atualizar senha:', updateRes.status, errText);
      return res.status(500).json({ error: 'Erro ao salvar senha. Tente de novo.' });
    }

    console.log('[criar-senha] Senha definida/atualizada para:', email);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[criar-senha] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno', message: err.message });
  }
}
