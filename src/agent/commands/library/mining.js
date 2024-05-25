export const mining = [
  {
    name: "mineBlock",
    params: [{ type: "string" }, { type: "number" }],
    description: "Mines a specified block a specified number of times.",
    execute: async function (agent, blockName, quantity) {
      const bot = agent.bot;

      const findAndMineBlock = async () => {
        const block = bot.findBlock({
          matching: (blk) => {
            return (
              bot.registry.blocksByName[
                blockName.toLowerCase().replace(/ /g, "_")
              ]?.id === blk.type
            );
          },
          maxDistance: 32,
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
          bot.once("goal_reached", resolve);
          bot.once("goal_reached", () => {
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
    },
  },
];
