export const documentation = [
  {
    name: "commandHelp",
    params: [],
    description: "Gives the agent guidance on the use of commands.",
    execute: function (agent) {
      agent.history.addSystemMessage(
        'A command is defined by the following syntax: !<command_name>(<params>). Commands begin with an exclamation mark (!) followed by the command name <command_name> and then the command parameters <params> enclosed in parentheses. For command parameters, string parameters must be enclosed in double quotes (""). All commands, if any, must be placed at the end of a response. The only commands available at the moment are !followPlayer("username") and !goToPlayer("username").'
      );
      return { status: "OK" };
    },
  },
];
