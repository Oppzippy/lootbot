const SpreadsheetBot = require("./SpreadsheetBot");
const SpreadsheetInterface = require("./SpreadsheetInterface");
const config = require("./config.json");

const bot = new SpreadsheetBot(config.discordToken)

bot.addCommand("loot", (command, args) => {

});
