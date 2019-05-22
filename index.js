require("./Log");
const process = require("process");
const readline = require("readline");

const SpreadsheetBot = require("./SpreadsheetBot");
const SpreadsheetController = require("./SpreadsheetController");
const LootCommand = require("./commands/LootCommand.js");

const config = require("./config.json");

console.log("Starting loot bot...");
const bot = new SpreadsheetBot(config.discordToken);
const sheetController = new SpreadsheetController(config.googleCredentials, config.spreadsheetId);

bot.setStatus("!loothelp for help");

bot.addCommand("loot", new LootCommand(sheetController, config));

bot.addCommand("loothelp", async (msg) => {
	await sheetController.getSheetData(config.ranges);
	msg.reply(`Usage: !loot <boss> <status> [playername]
<boss> options: ${sheetController.bosses.getBosses().join(", ")}
<status> options: ${sheetController.options.getOptions().join(", ")}
[playername]: Required if you have one or more alts listed in the spreadsheet, optional otherwise.
	`);
});

const rl = readline.createInterface({
	input: process.stdin,
});

rl.on("line", (line) => {
	if (line === "exit") {
		bot.destroy();
		process.exit();
	}
});
