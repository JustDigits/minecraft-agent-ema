export const botActions = [
  {
    name: "stop",
    params: [],
    description:
      "Force stops all actions being currently executed by the agent.",
    execute: function (agent) {
      agent.bot.emit("_stop");
      return { status: "OK" };
    },
  },
  {
    name: "echo",
    params: [{ type: "string" }],
    description: "Makes the agent say a given message in chat.",
    execute: function (agent, message) {
      agent.sendMessage(message);
      return { status: "OK" };
    },
  },
];
