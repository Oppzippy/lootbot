require("./Log");
const SpreadsheetBot = require("./SpreadsheetBot");
const SpreadsheetController = require("./SpreadsheetController");
const config = require("./config.json");

console.log("Starting loot bot...");
const bot = new SpreadsheetBot(config.discordToken);
const sheetController = new SpreadsheetController(config.googleCredentials, config.spreadsheetId);

bot.setStatus("!loothelp for help");

bot.addCommand("loot", async (msg, command, rawArgs) => {
	console.log(`[MSG] ${msg.author.tag}: ${msg.content}`);
	if (rawArgs.length < 2) {
		msg.reply("Invalid parameters. Type !loothelp for help.");
		return;
	}
	await sheetController.getSheetData(config.ranges);
	const args = sheetController.aliases.applyAliases(command, rawArgs);
	const boss = args[0];
	const option = args[1];
	let name = sheetController.permissions.getName(msg.author.id);

	// Check boss existance
	if (!sheetController.bosses.contains(boss)) {
		msg.reply(`${args[0]} is not a boss. Type !loothelp for help.`);
		return;
	}
	// Check option existance
	if (!sheetController.options.contains(option)) {
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

	if (!sheetController.permissions.hasPermission(msg.author.id, name)) {
		msg.reply(`You don't have permission to edit ${name}`);
		return;
	}

	if (!sheetController.names.contains(name)) {
		msg.reply(`${name} is not listed in the spreadsheet. Tell the admins to add you.`);
		return;
	}

	const localizedOption = sheetController.options.getLocalized(option);
	await sheetController.setLootStatus(name, boss, localizedOption);
	msg.reply(`Updated ${name}'s loot status for ${boss} to ${localizedOption}`);
});

bot.addCommand("loothelp", async (msg) => {
	await sheetController.getSheetData(config.ranges);
	msg.reply(`Usage: !loot <boss> <status> [playername]
<boss> options: ${sheetController.bosses.getBosses().join(", ")}
<status> options: ${sheetController.options.getOptions().join(", ")}
[playername]: Required if you have one or more alts listed in the spreadsheet, optional otherwise.
	`);
});
