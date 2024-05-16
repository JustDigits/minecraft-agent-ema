require('dotenv').config()

const mineflayer = require("mineflayer");

const bot = mineflayer.createBot({
  host: process.env.HOST,
  port: +process.env.PORT,
  username: process.env.BOT_USERNAME,
});