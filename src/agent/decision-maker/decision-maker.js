import { LMStudio } from "../../models/lmstudio.js";

import { isUserMessage } from "./utils.js";
import { isUserCommand, getUserCommand } from "./commands.js";
import { goToPlayer, followPlayer } from "../knowledge-library/navigation.js";
import { stop } from "../knowledge-library/common.js";

export class DecisionMaker {
  constructor(agent) {
    this.agent = agent;
    this.bot = agent.bot;
    this.chatModel = this.getChatModel();
  }

  getChatModel() {
    const model = this.agent.profile.model;

    if (typeof model.api !== "string" || model.api.length <= 0)
      throw new Error("model.api must be a non-empty string.");

    switch (model.api) {
      case "lmstudio":
        return new LMStudio(model);
      default:
        throw new Error("Unkown API: " + model.api);
    }
  }

  async handleMessage(username, message) {
    if (!isUserMessage(message)) return;

    console.log("Handling message from " + username + ": " + message);
    if (isUserCommand(message)) {
      this.handleUserCommand(message);
    } else {
      this.sendMessage(await this.chatModel.getCompletion(message));
    }
  }

  async handleUserCommand(message) {
    const { command, params } = getUserCommand(message);

    // Refactor into executeCommand() function from commands.js
    switch (command) {
      case "followPlayer":
        this.sendMessage("Following player!");
        followPlayer(this.bot, ...params);
        break;
      case "goToPlayer":
        this.sendMessage("Going to player!");
        goToPlayer(this.bot, ...params);
        break;
      case "stop":
        this.sendMessage("Stopping.");
        stop(this.bot);
        break;
      default:
        this.sendMessage("Unknown command: " + command);
        break;
    }
  }

  async sendMessage(message) {
    // In Minecraft, newlines are interpreted as separate chats. Replaced with whitespaces.
    message = message.replaceAll("\n", " ");
    this.bot.chat(message);
  }
}
