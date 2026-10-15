import dotenv from "dotenv";
dotenv.config();

const generateResponse = async (prompt) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      temperature: 0.2,
      max_tokens: 16000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`OpenRouter Error: ${JSON.stringify(data)}`);
  }

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("No response received from OpenRouter.");
  }

  return text;
};

export default generateResponse;