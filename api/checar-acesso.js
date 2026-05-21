// /api/checar-acesso.js
// Recebe um email e retorna:
//   { existe: true,  tem_senha: true  }  → usuário antigo, com senha → mostrar tela de senha
//   { existe: true,  tem_senha: false }  → usuário antigo, sem senha → forçar criar senha
//   { existe: false }                    → não comprou ainda → mostrar erro
//
// Não vaza dados sensíveis — só responde booleans.
//
// Variáveis de ambiente:
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const email = (body?.email || '').toLowerCase().trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error('[checar-acesso] Faltam env vars');
      return res.status(500).json({ error: 'Servidor mal configurado' });
    }

    // Busca o usuário no auth.users
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
      console.error('[checar-acesso] Erro no lookup:', lookupRes.status, errText);
      return res.status(500).json({ error: 'Erro ao verificar email' });
    }

    const lookupData = await lookupRes.json();
    const users = lookupData?.users || [];
    const user = users.find(u => (u.email || '').toLowerCase() === email);

    if (!user) {
      // Pequeno delay pra dificultar enumeração de emails por brute force
      await new Promise(r => setTimeout(r, 400));
      return res.status(200).json({ existe: false });
    }

    // Detecta se o usuário já tem senha definida.
    // No Supabase Admin API, providers vem em user.identities ou user.app_metadata.providers
    // Quando o user só tem 'email' como provider E nunca definiu senha (criado via OTP/magic link),
    // o user existe mas o campo encrypted_password está null no banco.
    //
    // A API admin não retorna encrypted_password (corretamente), mas retorna user.identities[].
    // Heurística mais confiável: se o user tem provider 'email' em identities, ele tem senha.
    // Como na Edge Function você cria o user com email mas sem senha, ele não vai ter
    // identity 'email' até definir uma. Confirmamos isso pelo array identities.
    const identities = user.identities || [];
    const temIdentidadeEmail = identities.some(i => i.provider === 'email');

    return res.status(200).json({
      existe: true,
      tem_senha: temIdentidadeEmail,
    });

  } catch (err) {
    console.error('[checar-acesso] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno', message: err.message });
  }
}
