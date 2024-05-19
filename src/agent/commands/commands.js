import { goToPlayer, followPlayer } from "../knowledge-library/navigation.js";
import { stop } from "../knowledge-library/common.js";

const CLEAN_STRING_REGEX = /"/g;
const NUMERIC_REGEX = /^\d+$/;
const COMMAND_REGEX =
  /^!(?<command>\w+)(?:\((?<params>(?:(?:(?:"\w+")|(?:\d+)),?)*)\))?$/;

export function isUserCommand(message) {
  return COMMAND_REGEX.test(message);
}

export function getUserCommand(message) {
  const match = message.match(COMMAND_REGEX);
  const command = extractUserCommand(match);
  const params = extractUserCommandParams(match);

  return { command: command, params: params };
}

export function executeCommand(agent, command, params) {
  switch (command) {
    case "followPlayer":
      agent.sendMessage("Following player!");
      followPlayer(agent.bot, ...params);
      break;
    case "goToPlayer":
      agent.sendMessage("Going to player!");
      goToPlayer(agent.bot, ...params);
      break;
    case "stop":
      agent.sendMessage("Stopping.");
      stop(agent.bot);
      break;
    default:
      agent.sendMessage("Unknown command: " + command);
      break;
  }
}

function extractUserCommand(matches) {
  return matches.groups.command;
}

function extractUserCommandParams(matches) {
  const params = matches.groups.params?.split(",").filter((str) => str);

  if (!params || params.length <= 0) return null;

  for (let i = 0; i < params.length; i++) {
    if (NUMERIC_REGEX.test(params[i])) {
      params[i] = Number(params[i]);
    } else {
      params[i] = params[i].replace(CLEAN_STRING_REGEX, "");
    }
  }

  return params;
}
