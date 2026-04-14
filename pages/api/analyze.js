export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const { system, messages, max_tokens } = req.body;

    const payload = {
      model: "claude-3-haiku-20240307",
      max_tokens: max_tokens || 1500,
      system: system || "",
      messages: messages || []
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      return res.status(500).json({ error: "Invalid JSON", raw: text.slice(0, 300) });
    }

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || "API error",
        type: data.error?.type
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
