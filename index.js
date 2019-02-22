require("./Log");
const SpreadsheetBot = require("./SpreadsheetBot");
const SpreadsheetController = require("./SpreadsheetController");
const config = require("./config.json");

console.log("Starting loot bot...");
const bot = new SpreadsheetBot(config.discordToken);
const sheetInterface = new SpreadsheetController(config.googleCredentials, config.spreadsheetId);

bot.addCommand("loot", async (msg, args) => {
	if (args.length < 2) {
		msg.reply("Invalid parameters. Type !loothelp for help.");
		return;
	}
	await sheetInterface.getSheetData(config.ranges);
	const boss = args[0];
	const option = args[1];
	let name = sheetInterface.permissions.getName(msg.author.id);

	// Check boss existance
	if (!sheetInterface.bosses.contains(boss)) {
		msg.reply(`${args[0]} is not a boss. Type !loothelp for help.`);
		return;
	}
	// Check option existance
	if (!sheetInterface.options.contains(option)) {
		msg.reply(`${args[1]} is not a valid option. Type !loothelp for help.`);
		return;
	}
	// Get character name
	if (args.length >= 3) {
		name = args[2];
	} else if (!name) {
		msg.reply("Please specify a character name. Type !loothelp for help.");
		return;
	}

	if (!sheetInterface.permissions.hasPermission(msg.author.id, name)) {
		msg.reply(`You don't have permission to edit ${name}`);
		return;
	}

	const localizedOption = sheetInterface.options.getLocalized(option);
	await sheetInterface.setLootStatus(name, boss, localizedOption);
	msg.reply(`Updated ${name}'s loot status for ${boss} to ${localizedOption}`);
});

bot.addCommand("loothelp", async (msg) => {
	await sheetInterface.getSheetData(config.ranges);
	msg.reply(`Usage: !loot <boss> <status> [playername]
<boss> options: ${sheetInterface.bosses.getBosses().join(", ")}
<status> options: ${sheetInterface.options.getOptions().join(", ")}
[playername]: Required if you have one or more alts listed in the spreadsheet, optional otherwise.
	`);
});
