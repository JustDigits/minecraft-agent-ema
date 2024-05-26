import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { Agent } from "../agent/agent.js";
import { Bot } from "../agent/bot/bot.js";

export class AgentProcess {
  initialize(processArgv) {
    const argv = this.getArgv(processArgv);
    const botSettings = {
      host: argv.host,
      port: argv.port,
    };

    for (const [key, value] of Object.entries(botSettings)) {
      if (value === "") delete botSettings[key];
    }

    if (Object.keys(botSettings).length !== 0)
      this.updateBotSettings(argv.profile, botSettings);
    new Agent(argv.profile).initialize();
  }

  getArgv(processArgv) {
    return yargs(hideBin(processArgv))
      .version(false)
      .option("host", {
        type: "string",
        default: "",
        describe:
          "Server IP at which the bot will attempt to connect. Overrides host in bot settings.",
        alias: "h",
      })
      .option("port", {
        type: "string",
        default: "",
        describe:
          "Server port at which the bot will attempt to connect. Overrides port in bot settings.",
        alias: "p",
      })
      .option("profile", {
        type: "string",
        describe: "Filepath to agent profile folder.",
        default: "src/profiles/lmstudio/",
      })
      .check((argv, options) => {
        this.checkArgv(argv);
        return true;
      })
      .parse();
  }

  checkArgv(argv) {
    const host = argv.host;
    const port = argv.port;
    const profile = argv.profile;

    if (typeof host !== "string")
      throw new Error("Only 0 or 1 hosts may be passed.");
    if (typeof port !== "string")
      throw new Error("Only 0 or 1 ports may be passed.");
    if (typeof profile !== "string")
      throw new Error("Only 0 or 1 profiles may be passed.");
  }

  updateBotSettings(workspace, settings) {
    console.info("Updating bot settings...");

    const bot = new Bot(workspace);
    for (const key in settings) {
      bot.settings[key] = settings[key];
    }

    bot.saveSettings(bot.settings);
  }
}
