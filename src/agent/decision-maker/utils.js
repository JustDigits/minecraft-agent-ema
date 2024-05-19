import { LMStudio } from "../../models/lmstudio.js";

export function isUserMessage(message) {
  const IGNORE_MESSAGES = [
    "Set own game mode to",
    "Set the time to",
    "Set the difficulty to",
    "Teleported ",
    "Set the weather to",
    "Gamerule ",
  ];

  return !IGNORE_MESSAGES.some((m) => message.startsWith(m));
}

export function getChatModel(model) {
  if (typeof model.api !== "string" || model.api.length <= 0)
    throw new Error("model.api must be a non-empty string.");

  switch (model.api) {
    case "lmstudio":
      return new LMStudio(model);
    default:
      throw new Error("Unkown API: " + model.api);
  }
}
