import OpenAI from "openai";

export class GPT {
  constructor(model) {
    this.config = {};

    this.config.model = model.name || "gpt-3.5-turbo";

    if (!process.env.OPENAI_API_KEY)
      throw new Error(
        "OpenAI API key not set for OPENAI_API_KEY environment variable."
      );

    this.openai = new OpenAI();
  }

  async getCompletionFromHistory(history) {
    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: history,
    });

    return completion.choices[0].message;
  }
}
