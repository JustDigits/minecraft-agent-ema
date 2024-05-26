import { writeFileSync, readFileSync } from "fs";

import minecraftData from "minecraft-data";
import { createBot } from "mineflayer";

import armorManager from "mineflayer-armor-manager";
import { plugin as autoEat } from "mineflayer-auto-eat";
import { plugin as collectBlock } from "mineflayer-collectblock";
import { pathfinder } from "mineflayer-pathfinder";
import { plugin as pvp } from "mineflayer-pvp";

export class Bot {
  constructor(workspace) {
    this.workspace = workspace;
    this.settings = this.parseSettings();
    this.version = null;
    this.mcData = null;
  }

  initialize() {
    console.info(
      `Initializing bot at '${this.settings.host}:${this.settings.port} with settings:`,
      this.settings
    );

    const bot = createBot(this.settings);
    bot.loadPlugins([armorManager, autoEat, collectBlock, pathfinder, pvp]);

    this.version = bot.version;
    this.mcData = minecraftData(this.version);

    return bot;
  }

  parseSettings() {
    // For a complete list of valid bot settings
    // @see https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#bot
    return JSON.parse(readFileSync(this.workspace + "bot.json", "utf-8"));
  }

  saveSettings(newSettings) {
    console.info(`Saving bot settings...`);

    writeFileSync(
      this.workspace + "bot.json",
      JSON.stringify(newSettings, null, 2)
    );
  }
}
