export class History {
  constructor(agent) {
    this.messages = [];
    this.agent = agent;
  }

  setHistory(messages) {
    this.messages = messages;
  }

  addUserMessage(username, content) {
    this.messages.push({ role: "user", content: content, name: username });
  }

  addAssistantMessage(content) {
    this.messages.push({ role: "assistant", content: content });
  }

  addSystemMessage(content) {
    this.messages.push({ role: "system", content: content });
  }

  addMessage(role, content) {
    switch (role) {
      case "user":
      case "system":
      case "assistant":
        this.messages.push({ role: role, content: content });
        return { status: "OK" };
      default:
        return {
          status: "failed",
          reason: "Role can only be 'user', 'system' or 'assistant'.",
        };
    }
  }

  parseAgentHistory() {
    return JSON.parse(readFileSync(this.workspace + "history.json", "utf-8"));
  }
}
