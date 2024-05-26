export const debugging = [
  {
    name: "echo",
    params: [{ type: "string" }],
    description:
      "Used for debugging. Makes the agent say a given message in chat.",
    execute: function (agent, message) {
      agent.sendMessage(message);
      return { status: "OK" };
    },
  },
  {
    name: "history",
    params: [],
    description:
      "Used for debugging. Logs agent conversation history in console.",
    execute: function (agent) {
      console.log(agent.history.messages);
      return { status: "OK" };
    },
  },
];
