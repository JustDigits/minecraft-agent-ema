import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { Agent } from "../agent/agent.js";
import { Bot } from "../bot/bot.js";

export class AgentProcess {
  initialize(processArgv) {
    const argv = this.getArgv(processArgv);
    const argvBotSettings = {
      host: argv.host,
      port: argv.port,
    };

    this.updateBotSettings(argvBotSettings);
    new Agent().initializeAgent(argv.profile);
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
        describe: "Filepath to agent profile",
        default: "src/agent/profiles/default-agent.json",
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

  updateBotSettings(argvBotSettings) {
    const bot = new Bot();
    const newSettings = {};

    for (const [key, value] of Object.entries(argvBotSettings)) {
      if (value !== "") newSettings[key] = value;
    }

    if (Object.keys(newSettings).length === 0) return;

    console.log("Updating bot settings...");
    for (const [key, value] of Object.entries(newSettings)) {
      bot.settings[key] = value;
    }

    bot.saveBotSettings();
  }
}
