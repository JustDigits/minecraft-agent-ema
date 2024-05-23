export class History {
  constructor(agent) {
    this.messages = [];
    this.agent = agent;
  }

  setHistory(messages) {
    this.messages = messages;
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
