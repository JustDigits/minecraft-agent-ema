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

    console.info(
      `Initializing chat model with settings:`,
      agent.profile.model.chat
    );

    this.loadHistory();
  }

  loadHistory() {
    const initialMessages = this.agent.profile.system_prompts.decision_maker;
    if (initialMessages) this.agent.history.setHistory(initialMessages);
  }

  async handleUserMessage(username, message) {
    if (isUserCommand(message)) {
      console.info(`COMMAND: Handling message from ${username}: ${message}`);
      const { status, reason } = await this.handleCommand(message);
      this.agent.sendMessage(reason);
      return { type: "command", status: status, reason: reason };
    }

    console.info(`CONVERSATION: Handling message from ${username}: ${message}`);
    const { status, reason } = await this.handleConversation(username, message);
    return { type: "conversation", status: status, reason: reason };
  }

  async handleConversation(username, message) {
    const AUTOPROMPTING_LIMIT = 5;
    this.agent.history.addUserMessage(username, message);

    const docs = await this.agent.chromadb.getRelevantDocuments(message);
    this.agent.history.addSystemMessage(
      `Based on the user's message, the following commands might be useful: ${docs.ids.join(
        ", "
      )}. Do not use a command unless absolutely necessary. Respond in natural language if possible. Use !commandHelp(<command_name>) to retrieve detailed usage information for given command.`
    );

    for (let i = 0; i < AUTOPROMPTING_LIMIT; i++) {
      const { content } = await this.chatModel.getCompletionFromHistory(
        this.agent.history.messages
      );

      if (content === "" || content === null) {
        return {
          status: "failed",
          reason: "Failed to receive model completion.",
        };
      }

      this.agent.history.addAssistantMessage(content);

      // Conversation response
      this.agent.sendMessage(content);
      if (!containsCommand(content)) {
        return {
          status: "OK",
          reason: `Successfully finished execution in (${
            i + 1
          }/${AUTOPROMPTING_LIMIT}) iterations.`,
        };
      }

      // Command response
      const { status, reason } = await this.handleCommand(content);
      this.agent.history.addSystemMessage(reason);
    }

    return {
      status: "OK",
      reason: `Autoprompting limit reached (${AUTOPROMPTING_LIMIT}/${AUTOPROMPTING_LIMIT}).`,
    };
  }

  async handleCommand(message) {
    const commands = parseCommandsFromMessage(message);
    if (commands.length === 0) {
      return {
        status: "failed",
        reason: `Invalid command syntax. Could not parse commands.`,
      };
    }

    const list = [];
    for (const { command, params } of commands) {
      const { status, reason } = await executeCommand(
        this.agent,
        command,
        params
      );

      if (status === "OK") {
        list.push(command);
        continue;
      }

      // TODO: Better error-handling of command array to not return upon first failure
      return {
        status: status,
        reason: `Invalid command '${command}(${params})': ${reason}`,
      };
    }

    return {
      status: "OK",
      reason: `Successfully executed all commands: ${list.join(", ")}`,
    };
  }

  async promptChatModelWithSystemMessage(message) {
    const { content } = await this.chatModel.getCompletionFromHistory([
      ...this.agent.history.messages,
      { role: "system", content: message },
    ]);

    if (content === "" || content === null) {
      return {
        status: "failed",
        reason: "Failed to receive model completion.",
      };
    }

    this.agent.history.addSystemMessage(message);
    this.agent.history.addAssistantMessage(content);
    this.agent.sendMessage(content);

    return { status: "OK" };
  }
}
