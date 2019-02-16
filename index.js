const config = require("./config.json")
const SpreadsheetBot = require("SpreadsheetBot")

const bot = new SpreadsheetBot(config.discordToken)

bot.addCommand("loot", (command, args) => {
    
});
