export const behaviors = [
  {
    name: "startBehavior",
    params: [{ type: "string" }],
    description: "Starts the given custom agent behavior.",
    execute: function (agent, behaviorName) {
      const behavior = agent.behaviors.map[behaviorName];
      if (!behavior) {
        return {
          status: "failed",
          reason: "Behavior does not exist.",
        };
      }

      agent.decisionMaker.promptChatModelWithSystemMessage(
        `Behavior execution in progress. Use !stopBehavior("${behaviorName}") to stop it at any time.`
      );

      behavior.start();
      return { status: "OK" };
    },
  },
  {
    name: "stopBehavior",
    params: [{ type: "string" }],
    description: "Stops the given custom agent behavior.",
    execute: function (agent, behaviorName) {
      const behavior = agent.behaviors.map[behaviorName];
      if (!behavior) {
        return {
          status: "failed",
          reason: "Behavior does not exist.",
        };
      }

      behavior.stop();
      return { status: "OK" };
    },
  },
];
