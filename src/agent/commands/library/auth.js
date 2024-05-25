export const auth = [
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
];
