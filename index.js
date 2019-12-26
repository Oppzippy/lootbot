require("./Log");
const process = require("process");
const readline = require("readline");

const SpreadsheetBot = require("./SpreadsheetBot");
const SpreadsheetController = require("./SpreadsheetController");
const LootCommand = require("./commands/LootCommand.js");
const LootHelpCommand = require("./commands/LootHelpCommand.js");

const config = require("./config.json");

console.log("Starting loot bot...");
const bot = new SpreadsheetBot(config.discordToken);
const sheetControllers = {};
Object.keys(config.channels).forEach(channel => {
	const channelConfig = config.channels[channel];
	const controller = new SpreadsheetController(
		channelConfig.googleCredentials,
		channelConfig.spreadsheetId,
		channelConfig.ranges,
	);
	sheetControllers[channel] = controller;
});

bot.setStatus("!loothelp for help");

bot.addCommand("loot", new LootCommand(sheetControllers));

bot.addCommand("loothelp", new LootHelpCommand(sheetControllers));

const rl = readline.createInterface({
	input: process.stdin,
});

rl.on("line", line => {
	if (line === "exit") {
		bot.destroy();
		process.exit();
	}
});
