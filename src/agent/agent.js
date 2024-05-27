import minecraftData from "minecraft-data";
import { readFileSync } from "fs";

import { Bot } from "./bot/bot.js";
import { History } from "./history/history.js";
import { Behaviors } from "./behaviors/behaviors.js";
import { DecisionMaker } from "./decision-maker/decision-maker.js";

export class Agent {
  constructor(profileFolderpath) {
    this.enableWhitelist = true;
    this.whitelist = ["JustDigits_"];

    this.workspace = profileFolderpath;
    this.profile = this.parseAgentProfile();
    this.name = this.profile.name;

    this.isBusy = false;
    this.bot = new Bot(this.workspace).initialize();
    this.mcdata = minecraftData(this.bot.version);

    this.behaviors = null;
    this.history = new History(this);
    this.decisionMaker = new DecisionMaker(this);
  }

  initialize() {
    console.info("Loaded history:", this.history.messages);

    this.bot.once("spawn", async () => {
      // Wait for world state to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.customizePlugins();
      this.startBehaviors();
      this.startEventListeners();

      this.bot.chat(`Hello, world! I'm ${this.name}!`);
    });
  }

  parseAgentProfile() {
    return JSON.parse(readFileSync(this.workspace + "profile.json", "utf-8"));
  }

  sendMessage(message) {
    // In Minecraft, newlines are interpreted as separate chats. Replaced with whitespaces.
    this.bot.chat(message.replaceAll("\n", " "));
  }

  customizePlugins() {
    this.bot.autoEat.options.priority = "foodPoints";
    this.bot.autoEat.options.startAt = 15;
    this.bot.autoEat.options.bannedFood = [
      "rotten_flesh",
      "poisonous_potato",
      "pufferfish",
      "chicken",
      "spider_eye",
    ];
  }

  startBehaviors() {
    this.behaviors = new Behaviors(this);
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

    // Custom events
    this.bot.on("_stop", () => {
      this.bot.clearControlStates();
      this.bot.pathfinder.stop();
      this.bot.pvp.stop();
    });

    // Debugging and Error handling
    this.bot.on("error", (error) => {
      console.error("Agent process error:", error);
    });

    this.bot.on("end", (reason) => {
      console.warn("Agent was disconnected from server:", reason);
    });

    this.bot.on("kicked", (reason) => {
      console.warn("Agent was kicked from server:", reason);
    });

    // TODO: Program other event listeners that will be handled by Decision Maker.
    //       (e.g. if a hostile mob is nearby, notify the Decision Maker to flee or attack)

    // TODO: Program default bot behaviors not influenced by Decision Maker.
    //       (e.g. look at nearest player in a certain radius)

    //TODO: Add setInterval for task management
  }
}
