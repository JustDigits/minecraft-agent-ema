import { writeFileSync, readFileSync } from "fs";

import { createBot } from "mineflayer";

export class Bot {
  constructor() {
    this.settings_filepath = "src/bot/settings.json";
    this.settings = this.parseBotSettings();
  }

  initializeBot() {
    // @see https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#bot
    console.log(this.settings);

    return createBot({
      host: this.settings.host,
      port: this.settings.port,
      username: this.settings.username,
    });
  }

  parseBotSettings() {
    return JSON.parse(readFileSync(this.settings_filepath, "utf-8"));
  }
  saveBotSettings() {
    writeFileSync(
      this.settings_filepath,
      JSON.stringify(this.settings, null, 2),
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }
}
