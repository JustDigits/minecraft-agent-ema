const IGNORE_MESSAGES = [
  "Set own game mode to",
  "Set the time to",
  "Set the difficulty to",
  "Teleported ",
  "Set the weather to",
  "Gamerule ",
];

export function isUserMessage(message) {
  return !IGNORE_MESSAGES.some((m) => message.startsWith(m));
}
