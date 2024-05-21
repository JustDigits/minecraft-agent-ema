import { readFileSync } from "fs";

import { Bot } from "../bot/bot.js";
import { DecisionMaker } from "./decision-maker/decision-maker.js";

export class Agent {
  async initializeAgent(profileFilepath) {
    this.profile = this.parseAgentProfile(profileFilepath);
    this.name = this.profile.name;

    this.bot = new Bot().initializeBot();
    this.decisionMaker = new DecisionMaker(this);

    this.bot.once("spawn", async () => {
      // Wait for world state to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.bot.chat(`Hello, world! I'm ${this.name}!`);
      this.startEventListeners();
    });
  }

  parseAgentProfile(profileFilepath) {
    return JSON.parse(readFileSync(profileFilepath, "utf-8"));
  }

  startEventListeners() {
    this.bot.on("chat", async (username, message, type) => {
      if (username === this.bot.username || type === "chat.type.admin") return;
      await this.decisionMaker.handleMessage(username, message);
    });

    this.bot.on("stop", async () => {
      this.bot.clearControlStates();
      this.bot.pathfinder.stop();
    });

    // TODO: Program other event listeners that will be handled by Decision Maker.
    //       (e.g. if a hostile mob is nearby, notify the Decision Maker to flee or attack)

    // TODO: Program default bot behaviors not influenced by Decision Maker.
    //       (e.g. look at nearest player in a certain radius, auto eat when hungry)
  }
}
