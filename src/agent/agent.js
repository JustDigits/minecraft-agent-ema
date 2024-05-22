import { readFileSync } from "fs";

import { Bot } from "../bot/bot.js";
import { DecisionMaker } from "./decision-maker/decision-maker.js";

export class Agent {
  async initialize(profileFilepath) {
    this.profile = this.parseAgentProfile(profileFilepath);
    this.name = this.profile.name;

    this.bot = new Bot().initialize();
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

  sendMessage(message) {
    // In Minecraft, newlines are interpreted as separate chats. Replaced with whitespaces.
    this.bot.chat(message.replaceAll("\n", " "));
  }

  startEventListeners() {
    this.bot.on("chat", async (username, message, type) => {
      if (username === this.bot.username || type === "chat.type.admin") return;

      const res = await this.decisionMaker.handleUserMessage(username, message);
      console.log(res);
    });

    this.bot.on("_stop", () => {
      this.bot.clearControlStates();
      this.bot.pathfinder.stop();
    });

    // TODO: Program other event listeners that will be handled by Decision Maker.
    //       (e.g. if a hostile mob is nearby, notify the Decision Maker to flee or attack)

    // TODO: Program default bot behaviors not influenced by Decision Maker.
    //       (e.g. look at nearest player in a certain radius, auto eat when hungry)
  }
}
