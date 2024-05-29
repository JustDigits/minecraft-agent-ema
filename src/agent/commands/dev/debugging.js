export const debugging = [
  {
    name: "echo",
    params: [{ type: "string" }],
    execute: function (agent, message) {
      agent.sendMessage(message);
      return { status: "OK" };
    },
    documentation: {
      name: "echo",
      keywords: "echo, repeat, message, chat",
      description:
        "Used for debugging. Makes the agent say a given message in chat. This command helps test the agent's ability to receive and relay chat messages accurately.",
      parameters: "Requires a string parameter for the message to be echoed.",
      usage: '!echo("Hello, world!")',
      example: [
        {
          role: "user",
          content: "Can you repeat this?: Hello, world!",
        },
        {
          role: "assistant",
          content: 'Echoing your message! !echo("Hello, world!")',
        },
      ],
    },
  },
  {
    name: "history",
    params: [],
    execute: function (agent) {
      console.log(agent.history.messages);
      return { status: "OK" };
    },
    documentation: {
      name: "history",
      keywords: "history, log, conversation, debug",
      description:
        "Used for debugging. Logs agent conversation history in console. This command is useful for developers to review and troubleshoot the conversation flow and responses.",
      parameters: "This command does not require any parameters.",
      usage: "!history()",
      example: [
        {
          role: "user",
          content: "Can you show me our chat history?",
        },
        {
          role: "assistant",
          content: "Logging chat history! !history()",
        },
      ],
    },
  },
];
