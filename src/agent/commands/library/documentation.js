import { getCommandDocumentation } from "../library.js";

export const documentation = [
  {
    name: "commandHelp",
    params: [{ type: "string" }],
    execute: async function (agent, commandName) {
      const { status, reason } =
        await agent.decisionMaker.promptChatModelWithSystemMessage(
          getCommandDocumentation(commandName)
        );
      return { status: status, reason: reason };
    },
    documentation: {
      name: "commandHelp",
      keywords: "command, help, documentation, docs",
      description:
        "Retrieve detailed documentation and usage information for a given command.",
      parameters:
        "Requires a string parameter that indicates the command name.",
      usage: '!commandHelp("followPlayer")',
      example: [
        {
          role: "user",
          content: "What does the !followPlayer command do?",
        },
        {
          role: "assistant",
          content: 'Let me see... !commandHelp("followPlayer")',
        },
      ],
    },
  },
  // {
  //   name: "listCommands",
  //   params: [{ type: "string" }],
  //   execute: function (agent, categoryName) {
  //     return { status: "OK" };
  //   },
  //   documentation: {
  //     name: "listCommands",
  //     keywords: "command, help, documentation, docs, category",
  //     description: "Retrieve available commands in a given command category.",
  //     parameters:
  //       "Requires a string parameter that indicates the command category.",
  //     usage: '!listCommands("navigation")',
  //     example: [
  //       {
  //         role: "user",
  //         content: "What navigation commands can you use?",
  //       },
  //       {
  //         role: "assistant",
  //         content: 'Let me see.. !listCommands("navigation")',
  //       },
  //     ],
  //   },
  // },
];
