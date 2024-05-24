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
  {
    name: "mineBlock",
    params: [{ type: "string" }, { type: "number" }],
    description: "Mines a specified block a specified number of times.",
    execute: async function (agent, blockName, quantity) {
      const bot = agent.bot;
  
      const findAndMineBlock = async () => {
        const block = bot.findBlock({
          matching: (blk) => {
            return bot.registry.blocksByName[blockName.toLowerCase().replace(/ /g, '_')]?.id === blk.type;
          },
          maxDistance: 32
        });
  
        if (!block) {
          agent.sendMessage(`Block ${blockName} not found nearby.`);
          return false;
        }
  
        // Moverse al bloque antes de minarlo
        const { x, y, z } = block.position;
        const movements = new pf.Movements(bot);
        const goal = new pf.goals.GoalBlock(x, y, z);
  
        bot.pathfinder.setMovements(movements);
        bot.pathfinder.setGoal(goal);
  
        await new Promise((resolve, reject) => {
          bot.once('goal_reached', resolve);
          bot.once('goal_reached', () => {
            agent.sendMessage(`Reached block at (${x}, ${y}, ${z})`);
          });
        });
  
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Minar el bloque
        try {
          await bot.dig(block);
          agent.sendMessage(`Successfully mined block: ${blockName}`);
          return true;
        } catch (err) {
          agent.sendMessage(`Failed to mine block: ${err.message}`);
          return false;
        }
      };
  
      for (let i = 0; i < quantity; i++) {
        const success = await findAndMineBlock();
        if (!success) {
          break;
        }
      }
      return { status: "OK" };
    }
  },
];
