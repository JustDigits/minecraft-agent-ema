import { readFileSync } from "fs";

import { createBot } from "mineflayer";

export function initializeBot(server_host, server_port) {
  // @see https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#bot
  const settings = parseBotSettings(server_host, server_port);

  return createBot({
    host: settings.host,
    port: settings.port,
    username: settings.username,
  });
}

function parseBotSettings(server_host, server_port) {
  const settings = JSON.parse(readFileSync("src/bot/settings.json", "utf-8"));

  if (server_host !== "") {
    settings.host = server_host;
  }
  if (server_port !== "") {
    settings.port = server_port;
  }

  return settings;
}
