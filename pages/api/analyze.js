export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const { system, messages, max_tokens } = req.body;

    // Try models in order from best to most compatible
    const models = [
      "claude-opus-4-5-20251101",
      "claude-sonnet-4-5-20251022", 
      "claude-3-5-sonnet-20241022",
      "claude-3-opus-20240229"
    ];

    let data = null;
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
          system: system || "",
          messages: messages || []
        })
      });

      const text = await response.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch(e) { continue; }

      if (response.ok) {
        // Success — return with model info
        return res.status(200).json({ ...parsed, _model_used: model });
      }

      // If model not found, try next
      if (parsed.error?.type === "not_found_error" || parsed.error?.message?.includes("model")) {
        lastError = parsed.error?.message;
        continue;
      }

      // Other error — return immediately
      return res.status(response.status).json({ 
        error: parsed.error?.message || "API error",
        type: parsed.error?.type
      });
    }

    res.status(500).json({ error: "No model available: " + lastError });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
