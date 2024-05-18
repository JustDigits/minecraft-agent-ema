import { LMStudio } from "../../models/lmstudio.js";

export class DecisionMaker {
  constructor(agent) {
    this.agent = agent;
    this.chatModel = this.getChatModel();
  }

  getChatModel() {
    const model = this.agent.profile.model;

    if (typeof model.api !== "string")
      throw new Error("model.api must be a string.");

    switch (model.api) {
      case "lmstudio":
        return new LMStudio(model);
      default:
        throw new Error("Unkown API: " + model.api);
    }
  }

  async handleMessage(username, message) {
    console.log("Handling message from " + username + ": " + message);

    const ignore_messages = [
      "Set own game mode to",
      "Set the time to",
      "Set the difficulty to",
      "Teleported ",
      "Set the weather to",
      "Gamerule ",
    ];

    if (ignore_messages.some((m) => message.startsWith(m))) return;

    let response = await this.chatModel.getCompletion(message);
    this.sendMessage(response);
  }

  async sendMessage(message) {
    // In Minecraft, newlines are interpreted as separate chats which may trigger spam filters. Replaced with whitespaces.
    message = message.replaceAll("\n", " ");
    this.agent.bot.chat(message);
  }
}
