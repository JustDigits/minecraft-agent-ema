import { readFileSync } from "fs";

import { initializeBot } from "../bot/bot.js";
import { getCompletion } from "./chat.js";

export class Agent {
  async initializeAgent(server_host, server_port, profile_fp) {
    this.profile = this.parseAgentProfile(profile_fp);
    this.name = this.profile.name;
    this.bot = initializeBot(server_host, server_port);

    this.bot.once("spawn", async () => {
      // Wait for world state to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.bot.chat(`Hello, world! I'm ${this.name}!`);
      this.startEventListeners();
    });
  }

  parseAgentProfile(profile_fp) {
    return JSON.parse(readFileSync(profile_fp, "utf-8"));
  }

  startEventListeners() {
    this.bot.on("chat", (username, message) => {
      if (username === this.name) return;
      this.handleMessage(username, message);
    });
  }

  async handleMessage(username, message) {
    console.log("Handling message from ", username, ": ", message);

    const ignore_messages = [
      "Set own game mode to",
      "Set the time to",
      "Set the difficulty to",
      "Teleported ",
      "Set the weather to",
      "Gamerule ",
    ];

    if (ignore_messages.some((m) => message.startsWith(m))) return;

    let response = await getCompletion(message);
    this.sendMessage(response);
  }

  async sendMessage(message) {
    // In Minecraft, newlines are interpreted as separate chats which may trigger spam filters. Replaced with whitespaces.
    message = message.replaceAll("\n", " ");
    return this.bot.chat(message);
  }
}
