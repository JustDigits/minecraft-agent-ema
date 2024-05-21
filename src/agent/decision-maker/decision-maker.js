import { isUserMessage, getChatModel } from "./utils.js";
import {
  isUserCommand,
  getUserCommand,
  executeCommand,
} from "../commands/commands.js";

export class DecisionMaker {
  constructor(agent) {
    this.agent = agent;
    this.bot = agent.bot;
    this.chatModel = getChatModel(this.agent.profile.model);
  }

  async handleMessage(username, message) {
    console.log("Handling message from " + username + ": " + message);

    if (isUserCommand(message)) {
      console.log("User command identified.");
      this.handleUserCommand(message);
    } else {
      console.log("User message identified.");
      this.sendMessage(await this.chatModel.getCompletion(message));
    }
  }

  async handleUserCommand(message) {
    const { command, params } = getUserCommand(message);
    executeCommand(this, command, params);
  }

  async sendMessage(message) {
    // In Minecraft, newlines are interpreted as separate chats. Replaced with whitespaces.
    message = message.replaceAll("\n", " ");
    this.bot.chat(message);
  }
}
