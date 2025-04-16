export default async function handler(req, res) {
  const { topic } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Gib mir 3 virale TikTok Hook-Ideen zum Thema: "${topic}". Jede Hook sollte maximal einen Satz lang sein und super aufmerksamkeitsstark sein. Antworte auf Deutsch.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    const hooks = data.choices?.[0]?.message?.content;

    if (!hooks) {
      return res.status(500).json({ error: "Keine Hooks empfangen." });
    }

    res.status(200).json({ hooks });
  } catch (error) {
    console.error("API Fehler:", error);
    res.status(500).json({ error: "Fehler beim Generieren der Hooks." });
  }
}
