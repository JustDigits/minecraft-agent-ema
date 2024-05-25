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
    name: "sleep",
    params: [],
    description: "Makes the agent sleep in the nearest bed, if available.",
    execute: function (agent) {
      const bot = agent.bot;
      const bed = bot.findBlock({
        matching: (block) =>
          bot.registry.blocksByName[block.name]?.name.includes("bed"),
        maxDistance: 64,
      });

      if (!bed) return { status: "failed", reason: "No bed found nearby." };

      bot
        .sleep(bed)
        .then(() => {
          return { status: "OK" };
          // agent.sendMessage("Bot is now sleeping.");
        })
        .catch((err) => {
          return {
            status: "failed",
            reason: `Failed to sleep: ${err.message}`,
          };
          // agent.sendMessage(`Failed to sleep: ${err.message}`);
        });

      return { status: "OK" };
    },
  },
];
