import pf from "mineflayer-pathfinder";

export const navigation = [
  {
    name: "followPlayer",
    params: [
      { type: "string" },
      { type: "number", optional: true },
      { type: "number", optional: true },
      { type: "number", optional: true },
    ],
    description: "Makes the bot follow a given player until manually stopped.",
    execute: function (
      agent,
      username,
      distance = 3,
      canDig = false,
      allow1by1towers = true
    ) {
      const bot = agent.bot;

      const player = bot.players[username]?.entity;
      if (!player)
        return { status: "failed", reason: "Could not find player." };

      const movements = new pf.Movements(bot);
      movements.canDig = canDig;
      movements.allow1by1towers = allow1by1towers;

      bot.pathfinder.setMovements(movements);
      bot.pathfinder.setGoal(new pf.goals.GoalFollow(player, distance), true);

      return { status: "OK" };
    },
  },
  {
    name: "goToPlayer",
    params: [
      { type: "string" },
      { type: "number", optional: true },
      { type: "number", optional: true },
      { type: "number", optional: true },
    ],
    description: "Makes the bot go to a given player's current location.",
    execute: async function (
      agent,
      username,
      distance = 3,
      canDig = false,
      allow1by1towers = true
    ) {
      const bot = agent.bot;

      const player = bot.players[username]?.entity;
      if (!player)
        return { status: "failed", reason: `Could not find ${username}.` };

      const movements = new pf.Movements(bot);
      movements.canDig = canDig;
      movements.allow1by1towers = allow1by1towers;

      bot.pathfinder.setMovements(movements);

      agent.decisionMaker.promptChatModelWithSystemMessage(
        `Command execution in progress. Going to ${username}.`
      );

      try {
        await bot.pathfinder.goto(
          new pf.goals.GoalFollow(player, distance),
          true
        );
      } catch (error) {
        return {
          status: "failed",
          reason: `Unable to go to ${username} at the moment: ${error.message}`,
        };
      }

      return { status: "OK" };
    },
  },
  {
    name: "goToCoordinates",
    params: [
      { type: "number" },
      { type: "number" },
      { type: "number" },
      { type: "number", optional: true },
      { type: "number", optional: true },
    ],
    description: "Makes the bot go to the given coordinates.",
    execute: async function (
      agent,
      x,
      y,
      z,
      canDig = false,
      allow1by1towers = true
    ) {
      const bot = agent.bot;

      const movements = new pf.Movements(bot);
      movements.canDig = canDig;
      movements.allow1by1towers = allow1by1towers;

      bot.pathfinder.setMovements(movements);

      agent.decisionMaker.promptChatModelWithSystemMessage(
        `Command execution in progress. Going to coordinates { x:${x}, y:${y}, z:${z} }.`
      );

      try {
        await bot.pathfinder.goto(new pf.goals.GoalNear(x, y, z, 1));
      } catch (error) {
        return {
          status: "failed",
          reason: `Unable to go to ${username} at the moment: ${error.message}`,
        };
      }

      return { status: "OK" };
    },
  },
  // TODO: Add function to go to nearest entity, mob, place (from memory bank)
];
