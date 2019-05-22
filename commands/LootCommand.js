const Command = require("./Command.js");

class LootCommand extends Command {
	constructor(sheetController, config) {
		super();
		this.sheetController = sheetController;
		this.config = config;
	}

	validate({
		boss, option, accountId, name,
	}) {
		const errors = [];
		if (!this.sheetController.bosses.contains(boss)) {
			errors.push(`${boss} is not a boss.`);
		}
		if (!this.sheetController.options.contains(option)) {
			errors.push(`${option} is not a valid option.`);
		}
		if (!name) {
			errors.push("Please specify a character name.");
			return errors; // Can't continue without this
		}
		if (!this.sheetController.permissions.hasPermission(accountId, name)) {
			errors.push(`You don't have permission to edit ${name}.`);
		}
		if (!this.sheetController.names.contains(name)) {
			errors.push(`${name} is not listed in the spreadsheet. Tell the admins to add you.`);
		}
		return errors;
	}

	async onCommand(msg, command, rawArgs) {
		if (rawArgs.length < 2) {
			msg.reply("Invalid parameters. Type !loothelp for help.");
			return;
		}
		await this.sheetController.getSheetData(this.config.ranges);
		const args = this.sheetController.aliases.applyAliases(command, rawArgs);
		const boss = args[0];
		const option = args[1];
		const name = args[2] || this.sheetController.permissions.getName(msg.author.id);
		const errors = this.validate({
			boss,
			option,
			accountId: msg.author.id,
			name,
		});
		if (errors.length >= 1) {
			errors.push("Type !loothelp for help.");
			const reply = errors.join("\n");
			msg.reply(reply);
		} else {
			const localizedOption = this.sheetController.options.getLocalized(option);
			await this.sheetController.setLootStatus(name, boss, localizedOption);
			msg.reply(`Updated ${name}'s loot status for ${boss} to ${localizedOption}`);
		}
	}
}

module.exports = LootCommand;
