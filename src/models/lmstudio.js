import OpenAI from "openai";

export class LMStudio {
  constructor(model) {
    if (!process.env.LMSTUDIO_API_KEY)
      throw new Error(
        "LM Studio API key not set for LMSTUDIO_API_KEY environment variable."
      );
    if (!model.url)
      throw new Error(
        "Model endpoint must be specified in 'model.url' when using LM Studio API."
      );
    if (!model.name)
      throw new Error(
        "Model must be specified in 'model.name' when using LM Studio API."
      );

    this.model = model.name;
    this.openai = new OpenAI({
      baseURL: model.url,
      apiKey: process.env.LMSTUDIO_API_KEY,
    });
  }

  async getCompletionFromHistory(history) {
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: history,
    });

    return completion.choices[0].message;
  }
}
