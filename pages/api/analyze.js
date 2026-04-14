export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const { system, messages, max_tokens } = req.body;

    // Try models from most to least capable
    const models = [
      "claude-3-5-sonnet-20241022",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307"
    ];

    for (const model of models) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model,
            max_tokens: max_tokens || 2000,
            temperature: 0,
            system: system || "",
            messages: messages || []
          })
        });

        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch(e) { continue; }

        if (response.ok) {
          return res.status(200).json({ ...data, _model: model });
        }

        // If model not available, try next one
        const errMsg = data?.error?.message || "";
        const errType = data?.error?.type || "";
        if (errType === "not_found_error" || errMsg.includes("model") || errMsg.includes("not found")) {
          continue;
        }

        // Other error — return it
        return res.status(response.status).json({ error: errMsg || "API error" });

      } catch(e) {
        continue;
      }
    }

    res.status(500).json({ error: "Nenhum modelo disponível. Verifique a API Key." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
