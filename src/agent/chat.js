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
          "You are a helpful, smart, kind, and efficient AI assistant. You always fulfill the user's requests to the best of your ability.",
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}