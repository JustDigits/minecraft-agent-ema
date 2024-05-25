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

      bot.pathfinder.setMovements(movements);
      bot.pathfinder.setGoal(new pf.goals.GoalFollow(player, distance), true);

      return { status: "OK" };
    },
  },
  {
    name: "goToPlayer",
    params: [{ type: "string" }, { type: "number", optional: true }],
    description: "Makes the bot go to a given player's current location.",
    execute: async function (agent, username, distance = 3) {
      const bot = agent.bot;

      const player = bot.players[username]?.entity;
      if (!player)
        return { status: "failed", reason: `Could not find ${username}.` };

      const movements = new pf.Movements(bot);
      bot.pathfinder.setMovements(movements);

      agent.decisionMaker.promptChatModelWithSystemMessage(
        `Command execution in progress. Going to ${username}.`
      );

      await bot.pathfinder.goto(
        new pf.goals.GoalFollow(player, distance),
        true
      );

      return { status: "OK" };
    },
  },
];
