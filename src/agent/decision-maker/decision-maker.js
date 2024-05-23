import { History } from "../history/history.js";
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
    this.chatModel = getChatModel(agent.profile.model.chat);

    this.loadHistory();

    console.log(this.agent.history.messages);
  }

  loadHistory() {
    const initialMessages = this.agent.profile.system_prompts.decision_maker;
    if (initialMessages) this.agent.history.setHistory(initialMessages);
  }

  async handleUserMessage(username, message) {
    console.log(`Handling message from ${username}: ${message}`);

    if (isUserCommand(message)) return await this.handleUserCommand(message);

    return await this.handleConversation(username, message);

    // TODO: Add a cycle to prompt history

    // if containsCommand -> execute -> getExecutionResults -> chatModel(OK ? send conversational message : try again )
    // else if soleyConversationalMessage -> chatModel(message) -> return;
  }

  async handleConversation(username, message) {
    const AUTOPROMPTING_LIMIT = 5;
    const composedMessage = `${username}: ${message}`;

    this.agent.history.addMessage("user", composedMessage);

    for (let i = 0; i < AUTOPROMPTING_LIMIT; i++) {
      console.log(this.agent.history.messages);

      const { role, content } = await this.chatModel.getCompletionFromHistory(
        this.agent.history.messages
      );

      if (content === "") {
        console.log("EMPTY STRING");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        continue;
      }
      this.agent.history.addMessage(role, content);

      // Conversation response
      if (!containsCommand(content)) {
        this.agent.sendMessage(content);
        return { type: "conversation", status: "OK" };
      }

      // Command response
      console.log("COMMAND RESPONSE");
      const { status, reason } = await this.handleAgentCommand(content);
      this.agent.history.addMessage("system", reason);
    }

    return { type: "conversation", status: "OK" };
  }

  async handleAgentCommand(message) {
    const commands = parseCommandsFromMessage(message);

    if (commands.length === 0) {
      return {
        status: "failed",
        reason: `Invalid parameter syntax. String parameters must be enclosed in double quotes.`,
      };
    }

    for (const { command, params } of commands) {
      const { status, reason } = executeCommand(this.agent, command, params);

      // TODO: Better error-handling of command array to not return upon first failure
      if (status === "failed") {
        return {
          status: status,
          reason: `Invalid command '${command}(${params})': ${reason}`,
        };
      }
    }

    return { status: "OK", reason: "All comands executed successfully." };
  }

  async handleUserCommand(message) {
    const commands = parseCommandsFromMessage(message);

    for (const { command, params } of commands) {
      const { status, reason } = executeCommand(this.agent, command, params);

      if (status === "OK") continue;

      // TODO: Better error-handling of command array to not return upon first failure
      this.agent.sendMessage(
        `Invalid command '${command}(${params})': ${reason}`
      );

      return;
    }
  }
}
