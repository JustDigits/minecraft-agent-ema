import settings from "../settings.js";

import { initializeBot } from "../bot/bot.js";
import { getCompletion } from "./chat.js";

export class Agent {
  async initializeAgent() {
    this.name = settings.mineflayer.username;
    this.bot = initializeBot(settings.mineflayer);

    this.bot.once("spawn", async () => {
      // Wait for bot to load world state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.bot.chat("Hello, world! I'm Llama 3!");

      this.bot.on("chat", (username, message) => {
        if (username === this.name) return;
        this.handleMessage(username, message);
      });
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
