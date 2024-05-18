import { writeFileSync, readFileSync } from "fs";

import { createBot } from "mineflayer";

const SETTINGS_FILEPATH = "src/bot/settings.json";

export class Bot {
  constructor() {
    this.settingsFilepath = SETTINGS_FILEPATH;
    this.settings = this.parseBotSettings();
  }

  initializeBot() {
    console.log(
      `Initializing bot at host '${this.settings.host}' and port '${this.settings.port}'.`
    );

    // @see https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#bot
    return createBot({
      host: this.settings.host,
      port: this.settings.port,
      username: this.settings.username,
    });
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
