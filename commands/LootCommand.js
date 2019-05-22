const Command = require("./Command.js");

class LootCommand extends Command {
	constructor(sheetController, config) {
		super();
		this.sheetController = sheetController;
		this.config = config;
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
		let error = new Error();
		try {
			const reply = (text) => {
				msg.reply(text);
				throw error;
			};

			this.constructor.validate(
				this.sheetController.bosses.contains(boss), reply,
				`${boss} is not a boss. Type !loothelp for help.`,
			);
			this.constructor.validate(
				this.sheetController.options.contains(option), reply,
				`${option} is not a valid option. Type !loothelp for help.`,
			);
			this.constructor.validate(
				name, reply,
				"Please specify a character name. Type !loothelp for help.",
			);
			this.constructor.validate(
				this.sheetController.permissions.hasPermission(msg.author.id, name), reply,
				`You don't have permission to edit ${name}`,
			);
			this.constructor.validate(
				this.sheetController.names.contains(name), reply,
				`${name} is not listed in the spreadsheet. Tell the admins to add you.`,
			);
			error = null;
		} catch (err) {
			if (error !== err) {
				console.error(error);
			}
		}
		if (!error) {
			const localizedOption = this.sheetController.options.getLocalized(option);
			await this.sheetController.setLootStatus(name, boss, localizedOption);
			msg.reply(`Updated ${name}'s loot status for ${boss} to ${localizedOption}`);
		}
	}
}

module.exports = LootCommand;
