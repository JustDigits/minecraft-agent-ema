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
    name: "echo",
    params: [{ type: "string" }],
    description: "Makes the agent say a given message in chat.",
    execute: function (agent, message) {
      agent.sendMessage(message);
      return { status: "OK" };
    },
  },
  {
    name: "history",
    params: [],
    description:
      "Used for debugging. Logs agent conversation history in console.",
    execute: function (agent) {
      console.log(agent.history.messages);
      return { status: "OK" };
    },
  },
  {
    name: "enableWhitelist",
    params: [],
    description:
      "Used for debugging. Only players present in the whitelist can chat and interact with the agent.",
    execute: function (agent) {
      agent.enableWhitelist = true;
      return { status: "OK" };
    },
  },
  {
    name: "disableWhitelist",
    params: [],
    description:
      "Used for debugging. Disables player whitelist. All players can chat and interact with the agent.",
    execute: function (agent) {
      agent.enableWhitelist = false;
      return { status: "OK" };
    },
  },
  {
    name: "addPlayerToWhitelist",
    params: [{ type: "string" }],
    description:
      "Used for debugging. Adds a player's username to the player whitelist. Whitelisted players can chat and interact with the agent.",
    execute: function (agent, username) {
      agent.whitelist.push(username);
      return { status: "OK" };
    },
  },
  {
    name: "sleep",
    params: [],
    description: "Makes the bot sleep in the nearest bed.",
    execute: function (agent) {
      const bot = agent.bot;
      const bed = bot.findBlock({
        matching: block => bot.registry.blocksByName[block.name]?.name.includes("bed"),
        maxDistance: 64,
      });
      if (bed) {
        bot.sleep(bed)
          .then(() => {
            agent.sendMessage("Bot is now sleeping.");
          })
          .catch(err => {
            agent.sendMessage(`Failed to sleep: ${err.message}`);
          });
      } else {
        agent.sendMessage("No bed found nearby.");
      }
      return { status: "OK" };
    },
  },
];
