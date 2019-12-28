class LootCommand {
	constructor(sheetControllers) {
		this.sheetControllers = sheetControllers;
	}

	static validate({ sheetController, boss, option, accountId, name }) {
		const errors = [];
		if (!sheetController.bosses.includes(boss)) {
			errors.push(`${boss} is not a boss.`);
		}
		if (!sheetController.options.includes(option)) {
			errors.push(`${option} is not a valid option.`);
		}
		if (!sheetController.permissions.includes(accountId)) {
			errors.push(
				"You are not listed in the spreadsheet. Tell the admins to add you.",
			);
			return errors; // Required, can't continue
		}
		if (!name) {
			errors.push("Please specify a character name.");
			return errors; // Required, can't continue
		}
		if (!sheetController.permissions.hasPermission(accountId, name)) {
			errors.push(`You don't have permission to edit ${name}.`);
		}
		if (!sheetController.names.includes(name)) {
			errors.push(
				`${name} is not listed in the spreadsheet. Tell the admins to add this character.`,
			);
		}
		return errors;
	}

	async onCommand({ msg, command, args }) {
		const sheetController = this.sheetControllers[msg.channel.id];
		if (sheetController === undefined) {
			return;
		}
		if (args.length < 2) {
			msg.reply("Invalid parameters. Type !loothelp for help.");
			return;
		}
		await sheetController.getSheetData();
		const aliasedArgs = sheetController.aliases.applyAliases(command, args);
		const [boss, option, providedName] = aliasedArgs;
		const name =
			providedName || sheetController.permissions.getName(msg.author.id);
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
			const localizedOption = sheetController.options.getLocalized(
				option,
			);
			await sheetController.setLootStatus(name, boss, localizedOption);
			msg.reply(
				`Updated ${name}'s loot status for ${boss} to ${localizedOption}.`,
			);
		}
	}
}

module.exports = LootCommand;
