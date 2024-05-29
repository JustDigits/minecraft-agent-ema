export const actions = [
  {
    name: "stop",
    params: [],
    execute: function (agent) {
      agent.bot.emit("_stop");
      return { status: "OK" };
    },
    documentation: {
      name: "stop",
      keywords: "stop, wrong, halt",
      description:
        "Force stops all actions currently being executed by the agent. This command is essential for immediately halting any ongoing tasks or behaviors of the agent.",
      parameters: "This command does not require any parameters.",
      usage: "!stop()",
      example: [
        {
          role: "user",
          content: "That does not look good... Stop!",
        },
        {
          role: "assistant",
          content: "Stopping! !stop()",
        },
      ],
    },
  },
  {
    name: "sleep",
    params: [],
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
    documentation: {
      name: "sleep",
      keywords: "sleep, bed, night, late, rest",
      description:
        "Makes the agent sleep in the nearest bed, if available. This command is useful for restoring the agent's health or passing the night in-game.",
      parameters: "This command does not require any parameters.",
      usage: "!sleep()",
      example: [
        {
          role: "user",
          content: "It's getting late. Time to sleep!",
        },
        {
          role: "assistant",
          content: "Going to sleep! !sleep()",
        },
      ],
    },
  },
  {
    name: "wakeUp",
    params: [],
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
    documentation: {
      name: "wakeUp",
      keywords: "sleep, bed, wake up, morning, rise",
      description:
        "Makes the agent wake up, if it is currently sleeping. This command helps the agent to resume activities after resting.",
      parameters: "This command does not require any parameters.",
      usage: "!wakeUp()",
      example: [
        {
          role: "user",
          content: "Good morning! Time to get up.",
        },
        {
          role: "assistant",
          content: "Waking up! !wakeUp()",
        },
      ],
    },
  },
];
