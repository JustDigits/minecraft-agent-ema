import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://localhost:1234/v1",
  apiKey: "lm-studio",
});

export async function getCompletion(message) {
  const completion = await openai.chat.completions.create({
    model: "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful, smart, kind, and efficient Minecraft AI assistant. You can interact with players via chat. As such, your messages should be very brief and concise.",
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}