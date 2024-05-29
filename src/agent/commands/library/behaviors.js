export const behaviors = [
  {
    name: "startHuntingBehavior",
    params: [],
    execute: async function (agent) {
      const behavior = agent.behaviors.map["hunting"];
      await agent.decisionMaker.promptChatModelWithSystemMessage(
        `Hunting Behavior execution in progress. Use !stopHuntingBehavior() to stop it at any time.`
      );

      behavior.start();
      return { status: "OK" };
    },
    documentation: {
      name: "startHuntingBehavior",
      keywords: "start, activate, behavior, hunt, hunting",
      description:
        "Starts the bot's Hunting Behavior, allowing for automated complex hunting actions and interactions within the game. Currently, the only behavior is `hunting`.",
      parameters: "This command does not require any parameters.",
      usage: "!startHuntingBehavior()",
      example: [
        {
          role: "user",
          content: "Let's start hunting.",
        },
        {
          role: "assistant",
          content: "Starting hunting behavior! !startHuntingBehavior()",
        },
      ],
    },
  },
  {
    name: "stopHuntingBehavior",
    params: [],
    execute: function (agent) {
      const behavior = agent.behaviors.map["hunting"];
      behavior.stop();
      return { status: "OK" };
    },
    documentation: {
      name: "stopHuntingBehavior",
      keywords: "stop, deactivate, behavior, hunt, hunting",
      description:
        "Stops the bot's Hunting Behavior. This command is used to halt any active Hunting Behavior, ensuring that the agent can cease any ongoing complex actions. Currently, the only behavior is `hunting`.",
      parameters: "This command does not require any parameters.",
      usage: "!stopHuntingBehavior()",
      example: [
        {
          role: "user",
          content: "Stop hunting now.",
        },
        {
          role: "assistant",
          content: "Stopping hunting behavior! !stopHuntingBehavior()",
        },
      ],
    },
  },
];
