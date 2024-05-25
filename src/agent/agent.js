import { readFileSync } from "fs";

import { Bot } from "./bot/bot.js";
import { History } from "./history/history.js";
import { DecisionMaker } from "./decision-maker/decision-maker.js";

export class Agent {
  constructor(profileFolderpath) {
    this.enableWhitelist = true;
    this.whitelist = ["JustDigits_"];

    this.workspace = profileFolderpath;
    this.profile = this.parseAgentProfile();
    this.name = this.profile.name;

    this.isThinking = false;
    this.bot = new Bot(this.workspace).initialize();
    this.history = new History(this);
    this.decisionMaker = new DecisionMaker(this);
  }

  initialize() {
    console.log("Loaded history:", this.history.messages);

    this.bot.once("spawn", async () => {
      // Wait for world state to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.bot.chat(`Hello, world! I'm ${this.name}!`);
      this.startEventListeners();
    });
  }

  parseAgentProfile() {
    return JSON.parse(readFileSync(this.workspace + "profile.json", "utf-8"));
  }

  sendMessage(message) {
    // In Minecraft, newlines are interpreted as separate chats. Replaced with whitespaces.
    this.bot.chat(message.replaceAll("\n", " "));
  }

  startEventListeners() {
    this.bot.on("chat", async (username, message, type) => {
      // Handle user authorization
      if (this.enableWhitelist && !this.whitelist.includes(username)) return;

      // Handle chat events
      if (type === "chat.type.admin" || username === this.bot.username) return;

      const res = await this.decisionMaker.handleUserMessage(username, message);
      console.log(res);
    });

    this.bot.on("_stop", () => {
      this.bot.clearControlStates();
      this.bot.pathfinder.stop();
      this.isThinking = false;
    });

    // TODO: Program other event listeners that will be handled by Decision Maker.
    //       (e.g. if a hostile mob is nearby, notify the Decision Maker to flee or attack)

    // TODO: Program default bot behaviors not influenced by Decision Maker.
    //       (e.g. look at nearest player in a certain radius, auto eat when hungry)
  }
}
