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

    const models = [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-haiku-20240307"
    ];

    let lastError = null;

    for (const model of models) {
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
          temperature: 0,        // DETERMINÍSTICO — mesma entrada = mesma saída sempre
          system: system || "",
          messages: messages || []
        })
      });

      const text = await response.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch(e) { continue; }

      if (response.ok) return res.status(200).json({ ...parsed, _model_used: model });

      if (parsed.error?.type === "not_found_error" || parsed.error?.message?.includes("model")) {
        lastError = parsed.error?.message;
        continue;
      }

      return res.status(response.status).json({ error: parsed.error?.message || "API error" });
    }

    res.status(500).json({ error: "Nenhum modelo disponível: " + lastError });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
