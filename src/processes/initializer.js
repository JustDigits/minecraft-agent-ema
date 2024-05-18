import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { Agent } from "../agent/agent.js";

const MAX_ARGUMENT_LENGTH = 3;

export class AgentProcess {
  initialize(processArgs) {
    const argv = yargs(hideBin(processArgs))
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
        this.checkArguments(argv);
        return true;
      })
      .parse();

    new Agent().initializeAgent(argv.host, argv.port, argv.profile);
  }

  checkArguments(argv) {
    const host = argv.host;
    const port = argv.port;
    const profile = argv.profile;

    if (typeof host !== "string") {
      throw new Error("Only 0 or 1 hosts may be passed.");
    }

    if (typeof port !== "string") {
      throw new Error("Only 0 or 1 ports may be passed.");
    }

    if (typeof profile !== "string") {
      throw new Error("Only 0 or 1 profiles may be passed.");
    }
  }
}
