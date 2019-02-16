const SpreadsheetBot = require("./SpreadsheetBot");
const SpreadsheetInterface = require("./SpreadsheetInterface");
const config = require("./config.json");

const bot = new SpreadsheetBot(config.discordToken)

const BOSS_MAP = {
	champions: "Champions",
	grong: "Grong",
	jadefire: "Jadefire",
	opulence: "Opulence",
	conclave: "Conclave",
	rastakhan: "Rastakhan",
	mekkatorque: "Mekkatorque",
	blockade: "Blockade",
	jaina: "Jaina",
};

const OPTIONS_MAP = {
	majorupgrade: "Major Upgrade",
	minorupgrade: "Minor Upgrade",
	pass: "Pass",
};

bot.addCommand("loot", (msg, args) => {
	if (args.length < 2) {
		msg.reply("Invalid parameters. Type !loothelp for help.");
	}
	const boss = BOSS_MAP[args[0].toLowerCase()];
	if (!boss) {
		msg.reply(`${args[0]} is not a boss. Type !loothelp for help.`);
		return;
	}
	const option = OPTIONS_MAP[args[1].toLowerCase()];
	if (!option) {
		msg.reply(`${args[0]} is not a valid option. Type !loothelp for help.`);
		return;
	}
	let name = null;
	if (args.length >= 3) {
		name = args[2];
	}

	setLoot(msg.author.id, boss, option, name);
});

// Name is optional
function setLoot(userId, boss, option, name) {
	
}
