import { LMStudio } from "../../models/lmstudio.js";
import { GPT } from "../../models/gpt.js";

export function getChatModel(model) {
  if (typeof model.api !== "string" || model.api.length <= 0)
    throw new Error("model.api must be a non-empty string.");

  switch (model.api) {
    case "lmstudio":
      return new LMStudio(model);
    case "openai":
      return new GPT(model);
    default:
      throw new Error("Unkown API: " + model.api);
  }
}
