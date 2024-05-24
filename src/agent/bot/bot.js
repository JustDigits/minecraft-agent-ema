import { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import { writeFileSync, readFileSync } from "fs";

export class Bot {
  constructor(workspace) {
    this.workspace = workspace;
    this.settings = this.parseSettings();
  }

  initialize() {
    console.log(
      `Initializing bot at '${this.settings.host}:${this.settings.port} with settings:`,
      this.settings
    );

    const bot = createBot(this.settings);
    bot.loadPlugin(pathfinder);

    return bot;
  }

  parseSettings() {
    // For a complete list of valid bot settings
    // @see https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#bot
    return JSON.parse(readFileSync(this.workspace + "bot.json", "utf-8"));
  }

  saveSettings(newSettings) {
    console.log(`Saving bot settings...`);

    writeFileSync(
      this.workspace + "bot.json",
      JSON.stringify(newSettings, null, 2)
    );
  }
}
