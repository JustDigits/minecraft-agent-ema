import OpenAI from "openai";

export class LMStudio {
  constructor(model) {
    this.model = model;
  }

  async getCompletion(message) {
    const openai = new OpenAI({
      baseURL: this.model.url,
      apiKey: "lm-studio",
    });

    const completion = await openai.chat.completions.create({
      model: this.model.name,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful, smart, kind, and efficient Minecraft AI assistant. You can interact with players via chat. As such, your messages should be very short, brief and concise.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  }
}
