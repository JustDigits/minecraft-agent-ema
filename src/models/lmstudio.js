import OpenAI from "openai";

export class LMStudio {
  constructor(model) {
    this.config = {};

    if (!model.name)
      throw new Error(
        "Model must be specified in 'model.name' when using LM Studio API."
      );
    if (!model.url)
      throw new Error(
        "Model endpoint must be specified in 'model.url' when using LM Studio API."
      );

    this.config.url = model.url;
    this.config.model = model.name;

    if (!process.env.LMSTUDIO_API_KEY)
      throw new Error(
        "LM Studio API key not set for LMSTUDIO_API_KEY environment variable."
      );

    this.openai = new OpenAI({
      baseURL: this.config.url,
      apiKey: process.env.LMSTUDIO_API_KEY,
    });
  }

  async getCompletionFromHistory(history) {
    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: history,
    });

    return completion.choices[0].message;
  }
}
