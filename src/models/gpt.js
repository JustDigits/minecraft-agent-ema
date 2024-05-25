import OpenAI from "openai";

export class GPT {
  constructor(model) {
    if (!process.env.OPENAI_API_KEY)
      throw new Error(
        "OpenAI API key not set for OPENAI_API_KEY environment variable."
      );

    console.log(process.env.OPENAI_API_KEY);

    this.model = model.name || "gpt-3.5-turbo";
    this.openai = new OpenAI();
  }

  async getCompletionFromHistory(history) {
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: history,
    });

    return completion.choices[0].message;
  }
}
