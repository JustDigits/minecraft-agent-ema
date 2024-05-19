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
