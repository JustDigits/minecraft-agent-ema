import { createBot } from "mineflayer";

export function initializeBot(settings) {
  let bot = createBot({
    host: settings.host,
    port: settings.port,
    username: settings.username,
  });

  return bot;
}
