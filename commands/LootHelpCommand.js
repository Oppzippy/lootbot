class LootHelpCommand {
	constructor(sheetController, config) {
		this.sheetController = sheetController;
		this.config = config;
	}

	async onCommand(msg) {
		await this.sheetController.getSheetData(this.config.ranges);
		msg.reply(`Usage: !loot <boss> <status> [playername]
<boss> options: ${this.sheetController.bosses.getBosses().join(", ")}
<status> options: ${this.sheetController.options.getOptions().join(", ")}
[playername]: Required if you have one or more alts listed in the spreadsheet, optional otherwise.`);
	}
}

module.exports = LootHelpCommand;
