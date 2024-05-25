import { COMMAND_MAP } from "./library.js";

const COMMAND_REGEX = getCommandRegex();

function getCommandRegex() {
  // Syntaxis examples: !command() | !command | !command(123) | !command("str") | !command("str",123)

  const STRING_TYPE = /(?:"[\w ]+")/;
  const NUMBER_TYPE = /(?:\d+)/;
  const VALID_PARAM_TYPES = new RegExp(
    `(?:${STRING_TYPE.source}|${NUMBER_TYPE.source})`
  );

  const SEPARATOR = /(?:,[ ]?)/;
  const PARAMS = new RegExp(
    `(?<params>(?:${VALID_PARAM_TYPES.source}${SEPARATOR.source}?)*)`
  );
  const COMMAND_NAME = /[!.](?<command>\w+)/;

  const COMMAND_SYNTAX = new RegExp(
    `${COMMAND_NAME.source}(?:\\(${PARAMS.source}\\))?`
  );

  // /[!.](?<command>\w+)(?:\((?<params>(?:(?:(?:"[\w ]+")|(?:\d+))(?:,[ ]?)?)*)\))?/;
  return COMMAND_SYNTAX;
}

export function isUserCommand(message) {
  return message.startsWith("!");
}

export function containsCommand(message) {
  return COMMAND_REGEX.test(message);
}

export async function executeCommand(agent, commandName, params) {
  const command = COMMAND_MAP[commandName];
  if (!command) return { status: "failed", reason: "Command does not exist." };

  let { status, reason } = validateCommandParams(params, command.params);
  if (status === "failed") return { status: status, reason: reason };

  ({ status, reason } = await command.execute(agent, ...params));
  if (status === "failed") return { status: status, reason: reason };

  return { status: "OK" };
}

export function parseCommandsFromMessage(message) {
  const ALL_COMMANDS_REGEX = new RegExp(COMMAND_REGEX.source, "g");

  const matches = [...message.matchAll(ALL_COMMANDS_REGEX)];

  const commands = [];
  for (const match of matches) {
    const command = parseCommandName(match);
    const params = parseCommandParams(match);
    commands.push({ command: command, params: params });
  }

  return commands;
}

function parseCommandName(match) {
  return match.groups.command;
}

function parseCommandParams(match) {
  const NUMERIC_PARAM_REGEX = /^\d+$/;
  const params = match.groups.params?.split(",").map((str) => str.trim());

  if (!params || params.length <= 0) return [];

  for (let i = 0; i < params.length; i++) {
    if (NUMERIC_PARAM_REGEX.test(params[i])) {
      // Cast numeric parameters into numbers
      params[i] = Number(params[i]);
    } else {
      // Clean quotation marks from string parameters (e.g. "str" -> str)
      params[i] = params[i].replace(/"/g, "");
    }
  }

  return params;
}

function validateCommandParams(userParams, commandParams) {
  const userParamLength = userParams.length;
  const commandParamLength = commandParams.length;

  // Check max parameter length
  if (userParamLength > commandParamLength)
    return {
      status: "failed",
      reason: `Expected at most ${commandParamLength} parameters but received ${userParamLength}.`,
    };

  // Check min parameter length
  const minParamsLength = commandParams.filter((obj) => !obj.optional).length;
  if (userParamLength < minParamsLength)
    return {
      status: "failed",
      reason: `Expected at least ${minParamsLength} parameters but received ${userParamLength}.`,
    };

  // Check parameter types
  for (let i = 0; i < userParamLength; i++) {
    if (typeof userParams[i] !== commandParams[i].type)
      return {
        status: "failed",
        reason: `Expected parameter type '${
          commandParams[i].type
        }' at position ${i + 1}.`,
      };
  }

  return { status: "OK" };
}
