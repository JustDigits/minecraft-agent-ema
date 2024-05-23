import pf from "mineflayer-pathfinder";

export const navigation = [
  {
    name: "followPlayer",
    params: [{ type: "string" }, { type: "number", optional: true }],
    description: "Makes the bot follow a given player until manually stopped.",
    execute: function (agent, username, distance = 3) {
      const bot = agent.bot;

      const player = bot.players[username]?.entity;
      if (!player)
        return { status: "failed", reason: "Could not find player." };

      const movements = new pf.Movements(bot);
      const goal = new pf.goals.GoalFollow(player, distance);

      bot.pathfinder.setMovements(movements);
      bot.pathfinder.setGoal(goal, true);

      return { status: "OK" };
    },
  },
  {
    name: "goToPlayer",
    params: [{ type: "string" }, { type: "number", optional: true }],
    description: "Makes the bot go to a given player's current location.",
    execute: function (agent, username, distance = 3) {
      const bot = agent.bot;

      const player = bot.players[username]?.entity;
      if (!player)
        return { status: "failed", reason: "Could not find player." };

      const { x, y, z } = player.position;
      const movements = new pf.Movements(bot);
      const goal = new pf.goals.GoalNear(x, y, z, distance);

      bot.pathfinder.setMovements(movements);
      bot.pathfinder.setGoal(goal);

      return { status: "OK" };
    },
  },
];
