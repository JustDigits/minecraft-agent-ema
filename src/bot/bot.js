import { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import { writeFileSync, readFileSync } from "fs";

const SETTINGS_FILEPATH = "src/bot/settings.json";

export class Bot {
  constructor() {
    this.settingsFilepath = SETTINGS_FILEPATH;
    this.settings = this.parseBotSettings();
  }

  initializeBot() {
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

  parseBotSettings() {
    return JSON.parse(readFileSync(this.settingsFilepath, "utf-8"));
  }

  saveBotSettings() {
    console.log(`Saving bot settings...`);

    writeFileSync(
      this.settingsFilepath,
      JSON.stringify(this.settings, null, 2),
      (error) => {
        if (error) console.log(error);
      }
    );
  }
}
