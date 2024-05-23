import { LMStudio } from "../../models/lmstudio.js";
import { GPT } from "../../models/gpt.js";

export function getChatModel(model) {
  if (typeof model.api_type !== "string" || model.api_type.length <= 0)
    throw new Error("model.api must be a non-empty string.");

  switch (model.api_type) {
    case "lmstudio":
      return new LMStudio(model);
    case "openai":
      return new GPT(model);
    default:
      throw new Error("Unkown API: " + model.api);
  }
}
