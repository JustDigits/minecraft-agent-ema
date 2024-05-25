export const actions = [
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
    execute: async function (agent) {
      const bot = agent.bot;
      const bed = bot.findBlock({
        matching: (block) => bot.isABed(block),
        maxDistance: 64,
      });

      if (!bed) return { status: "failed", reason: "No bed found nearby." };

      try {
        await bot.sleep(bed);
        return { status: "OK" };
      } catch (error) {
        return {
          status: "failed",
          reason: `Unable to sleep: ${error.message}`,
        };
      }
    },
  },
  {
    name: "wakeUp",
    params: [],
    description: "Makes the agent wake up, if sleeping.",
    execute: async function (agent) {
      const bot = agent.bot;

      try {
        await bot.wake();
        return { status: "OK" };
      } catch (error) {
        return {
          status: "failed",
          reason: `Unable to wake up: ${error.message}`,
        };
      }
    },
  },
];
