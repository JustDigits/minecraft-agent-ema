import pf from "mineflayer-pathfinder";

export const navigation = [
  {
    name: "followPlayer",
    params: [
      { type: "string" },
      { type: "number", optional: true },
      { type: "boolean", optional: true },
      { type: "boolean", optional: true },
    ],
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
    documentation: {
      name: "followPlayer",
      keywords: "follow, player, track, pursuit",
      description:
        "Makes the bot follow a given player until manually stopped using `!stop()`. This command allows the bot to maintain a specified distance form the player and adapt its pathfinding based on terrain challenges.",
      parameters:
        "Requires a string parameter for the player's username, an optional number parameter for distance and optional boolean parameters for canDig and allow1by1towers.",
      usage:
        '!followPlayer("username", distance = 3, canDig = false, allow1by1towers = true)',
      example: [
        {
          role: "user",
          content: "Follow me!",
          name: "JustDigits_",
        },
        {
          role: "assistant",
          content: 'Following! !followPlayer("JustDigits_")',
        },
      ],
    },
  },
  {
    name: "goToPlayer",
    params: [
      { type: "string" },
      { type: "number", optional: true },
      { type: "boolean", optional: true },
      { type: "boolean", optional: true },
    ],
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

      await agent.decisionMaker.promptChatModelWithSystemMessage(
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
    documentation: {
      name: "goToPlayer",
      keywords: "navigate, player, location, reach",
      description:
        "Makes the bot go to a given player's current location. Useful for reaching teammates or targets in various game scenarios.",
      parameters:
        "Requires a string parameter for the player's username, an optional number parameter for distance and optional boolean parameters for canDig and allow1by1towers.",
      usage:
        '!goToPlayer("username", distance = 3, canDig = false, allow1by1towers = true)',
      example: [
        {
          role: "user",
          content: "Go to Steve at the base.",
          name: "Caesar2045",
        },
        {
          role: "assistant",
          content: 'Heading to Steve\'s location! !goToPlayer("Steve")',
        },
      ],
    },
  },
  {
    name: "goToCoordinates",
    params: [
      { type: "number" },
      { type: "number" },
      { type: "number" },
      { type: "boolean", optional: true },
      { type: "boolean", optional: true },
    ],
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

      await agent.decisionMaker.promptChatModelWithSystemMessage(
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
    documentation: {
      name: "goToCoordinates",
      keywords: "navigate, coordinates, coods, position, destination",
      description:
        "Makes the bot go to the specified coordinates. This command facilitates precise navigation to any location in the game world.",
      parameters:
        "Requires number parameters for X, Y, Z coordinates and optional boolean parameters for canDig and allow1by1towers.",
      usage:
        "!goToCoordinates(x, y, z, canDig = false, allow1by1towers = true)",
      example: [
        {
          role: "user",
          content: "Navigate to the treasure location at 134, 64, -88.",
        },
        {
          role: "assistant",
          content:
            "Setting course to the treasure coordinates! !goToCoordinates(134, 64, -88, true)",
        },
      ],
    },
  },
  // TODO: Add function to go to nearest entity, mob, place (from memory bank)
];
