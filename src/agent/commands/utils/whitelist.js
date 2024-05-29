export const whitelist = [
  {
    name: "enableWhitelist",
    params: [],
    execute: function (agent) {
      agent.enableWhitelist = true;
      return { status: "OK" };
    },
    documentation: {
      name: "enableWhitelist",
      keywords: "enable, whitelist, restrict, access",
      description:
        "Used for debugging. Only players present in the whitelist can chat and interact with the agent. This command restricts the agent's interaction to authorized users only.",
      parameters: "This command does not require any parameters.",
      usage: "!enableWhitelist()",
      example: [
        {
          role: "user",
          content: "Enable the whitelist, please.",
        },
        {
          role: "assistant",
          content: "Whitelist enabled! !enableWhitelist()",
        },
      ],
    },
  },
  {
    name: "disableWhitelist",
    params: [],
    execute: function (agent) {
      agent.enableWhitelist = false;
      return { status: "OK" };
    },
    documentation: {
      name: "disableWhitelist",
      keywords: "disable, whitelist, open, access",
      description:
        "Used for debugging. Disables player whitelist. All players can chat and interact with the agent, removing previous restrictions.",
      parameters: "This command does not require any parameters.",
      usage: "!disableWhitelist()",
      example: [
        {
          role: "user",
          content: "Disable the whitelist.",
        },
        {
          role: "assistant",
          content: "Whitelist disabled! !disableWhitelist()",
        },
      ],
    },
  },
  {
    name: "addPlayerToWhitelist",
    params: [{ type: "string" }],
    execute: function (agent, username) {
      agent.whitelist.push(username);
      return { status: "OK" };
    },
    documentation: {
      name: "addPlayerToWhitelist",
      keywords: "add, player, whitelist, access",
      description:
        "Used for debugging. Adds a player's username to the player whitelist. Whitelisted players are granted exclusive access to interact with the agent.",
      parameters:
        "Requires a string parameter for the username to be added to the whitelist.",
      usage: '!addPlayerToWhitelist("username")',
      example: [
        {
          role: "user",
          content: "Add Steve to the whitelist.",
        },
        {
          role: "assistant",
          content: 'Adding Steve to whitelist! !addPlayerToWhitelist("Steve")',
        },
      ],
    },
  },
];
