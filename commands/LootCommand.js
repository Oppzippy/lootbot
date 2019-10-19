class LootCommand {
	constructor(sheetControllers) {
		this.sheetControllers = sheetControllers;
	}

	static validate({
		sheetController, boss, option, accountId, name,
	}) {
		const errors = [];
		if (!sheetController.bosses.contains(boss)) {
			errors.push(`${boss} is not a boss.`);
		}
		if (!sheetController.options.contains(option)) {
			errors.push(`${option} is not a valid option.`);
		}
		if (!name) {
			errors.push("Please specify a character name.");
			return errors; // Can't continue without this
		}
		if (!sheetController.permissions.hasPermission(accountId, name)) {
			errors.push(`You don't have permission to edit ${name}.`);
		}
		if (!sheetController.names.contains(name)) {
			errors.push(`${name} is not listed in the spreadsheet. Tell the admins to add you.`);
		}
		return errors;
	}

	async onCommand(msg, command, rawArgs) {
		const sheetController = this.sheetControllers[msg.channel.id];
		if (sheetController === undefined) {
			return;
		}
		if (rawArgs.length < 2) {
			msg.reply("Invalid parameters. Type !loothelp for help.");
			return;
		}
		await sheetController.getSheetData();
		const args = sheetController.aliases.applyAliases(command, rawArgs);
		const boss = args[0];
		const option = args[1];
		const name = args[2] || sheetController.permissions.getName(msg.author.id);
		const errors = LootCommand.validate({
			sheetController,
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
			const localizedOption = sheetController.options.getLocalized(option);
			await sheetController.setLootStatus(name, boss, localizedOption);
			msg.reply(`Updated ${name}'s loot status for ${boss} to ${localizedOption}`);
		}
	}
}

module.exports = LootCommand;
