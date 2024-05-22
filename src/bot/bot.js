import { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import { writeFileSync, readFileSync } from "fs";

const SETTINGS_FILEPATH = "src/bot/settings.json";

export class Bot {
  constructor() {
    this.settings = this.parseSettings();
  }

  initialize() {
    console.log(
      `Initializing bot at '${this.settings.host}:${this.settings.port}'.`
    );

    // @see https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#bot
    const bot = createBot({
      host: this.settings.host,
      port: this.settings.port,
      username: this.settings.username,
      version: this.settings.version,
    });

    bot.loadPlugin(pathfinder);

    return bot;
  }

  parseSettings() {
    return JSON.parse(readFileSync(SETTINGS_FILEPATH, "utf-8"));
  }

  saveSettings() {
    console.log(`Saving bot settings...`);

    writeFileSync(
      SETTINGS_FILEPATH,
      JSON.stringify(this.settings, null, 2),
      (error) => {
        if (error) console.log(error);
      }
    );
  }
}
