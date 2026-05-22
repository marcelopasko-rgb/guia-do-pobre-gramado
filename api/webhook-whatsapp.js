export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Webhook ativo");
  }

  // LOG TEMPORÁRIO DE DEBUG
  console.log("=== WEBHOOK RECEBIDO ===");
  console.log("Query:", JSON.stringify(req.query));
  console.log("Body:", JSON.stringify(req.body));
  console.log("KIWIFY_TOKEN esperado:", process.env.KIWIFY_TOKEN);

  try {
    const tokenRecebido = req.query.token;
    console.log("Token recebido:", tokenRecebido);
    console.log("Token confere:", tokenRecebido === process.env.KIWIFY_TOKEN);

    if (tokenRecebido !== process.env.KIWIFY_TOKEN) {
      console.log("TOKEN INVÁLIDO - bloqueando");
      return res.status(401).send("Token inválido");
    }
