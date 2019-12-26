class LootHelpCommand {
	constructor(sheetControllers) {
		this.sheetControllers = sheetControllers;
	}

	async onCommand({ msg }) {
		const sheetController = this.sheetControllers[msg.channel.id];
		if (!sheetController) {
			return;
		}
		await sheetController.getSheetData();
		msg.reply(`Usage: !loot <boss> <status> [playername]
<boss> options: ${sheetController.bosses.getBosses().join(", ")}
<status> options: ${sheetController.options.getOptions().join(", ")}
[playername]: Required if you have one or more alts listed in the spreadsheet, optional otherwise.`);
	}
}

module.exports = LootHelpCommand;
