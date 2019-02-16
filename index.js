const SpreadsheetBot = require("./SpreadsheetBot");
const SpreadsheetInterface = require("./SpreadsheetInterface");
const config = require("./config.json");

const bot = new SpreadsheetBot(config.discordToken);
const sheetInterface = new SpreadsheetInterface(config.googleCredentials, config.spreadsheetId);

bot.addCommand("loot", async (msg, args) => {
	if (args.length < 2) {
		msg.reply("Invalid parameters. Type !loothelp for help.");
		return;
	}
	await sheetInterface.getSheetData();
	const boss = args[0].toLowerCase();
	if (!sheetInterface.bosses[boss]) {
		msg.reply(`${args[0]} is not a boss. Type !loothelp for help.`);
		return;
	}
	const option = args[1].toLowerCase();
	if (!sheetInterface.options[option]) {
		msg.reply(`${args[1]} is not a valid option. Type !loothelp for help.`);
		return;
	}

	const permissions = sheetInterface.permissions[msg.author.id];
	let name = null;
	if (args.length >= 3) {
		name = args[2].toLowerCase();
	} else if (permissions && permissions.length === 1) {
		name = permissions[0].toLowerCase();
	} else if (permissions) {
		msg.reply("Please specify a character name. Type !loothelp for help.");
		return;
	} else {
		msg.reply("You don't have permission to do that. Message Oppy if this is an error.");
		return;
	}

	if (!permissions || !permissions.includes(name)) {
		msg.reply(`You don't have permission to edit ${name}`);
		return;
	}

	const localizedOption = sheetInterface.options[option];
	await sheetInterface.setLootStatus(name, boss, localizedOption);
	msg.reply(`Updated ${name}'s loot status for ${boss} to ${localizedOption}`);
});

bot.addCommand("loothelp", (msg) => {
	msg.reply(`Usage: !loot <boss> <status> [playername]
<boss> options: champions, grong, jadefire, opulence, conclave, rastakhan, mekkatorque, blockade, jaina
<status> options: majorupgrade, minorupgrade, pass
[playername]: Required if you have one or more alts listed in the spreadsheet, optional otherwise.
	`);
});
