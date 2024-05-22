import { getChatModel } from "./utils.js";
import {
  isUserCommand,
  containsCommand,
  parseCommandsFromMessage,
  executeCommand,
} from "../commands/commands.js";

export class DecisionMaker {
  constructor(agent) {
    this.agent = agent;
    this.bot = agent.bot;
    this.chatModel = getChatModel(this.agent.profile.model);
  }

  async handleUserMessage(username, message) {
    if (isUserCommand(message)) return this.handleCommands(username, message);
    return this.handleConversation(username, message);
  }

  async handleCommands(username, message) {
    const commands = parseCommandsFromMessage(message);

    for (const cmd of commands) {
      const { command, params } = cmd;

      console.log(`Handling command '${command}(${params})' from ${username}.`);

      const { status, reason } = executeCommand(this.agent, command, params);

      // TODO: Better error-handling of command array to not return upon first failure
      if (status === "failed") {
        this.agent.sendMessage(
          `Invalid command '${command}(${params})': ${reason}`
        );

        return {
          type: "command",
          status: status,
          reason: `Invalid command '${command}(${params})': ${reason}`,
        };
      }
    }
    return { type: "command", status: "OK" };
  }

  async handleConversation(username, message) {
    console.log(`Handling message from ${username}: ${message}.`);

    this.agent.sendMessage(await this.chatModel.getCompletion(message));
    return { type: "conversation", status: "OK" };
  }
}
