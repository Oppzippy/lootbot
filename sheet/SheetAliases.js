class SheetAliases {
	constructor(sheetData) {
		this.aliases = {};
		sheetData.forEach((row) => {
			const command = row[0];
			const arg = parseInt(row[1], 10);
			const source = row[2];
			const replacement = row[3];
			this.addAlias(command, arg, source, replacement);
		});
	}

	addAlias(command, arg, source, replacement) {
		if (!this.aliases[command]) {
			this.aliases[command] = {};
		}
		if (!this.aliases[command][arg]) {
			this.aliases[command][arg] = {};
		}
		this.aliases[command][arg][source.toLowerCase()] = replacement;
	}

	applyAliases(command, args) {
		const newArgs = [];
		const commandAliases = this.aliases[command];
		if (commandAliases) {
			for (let i = 0; i < args.length; i++) {
				newArgs[i] = SheetAliases.applyAlias(commandAliases, args[i], i);
			}
		}
		return newArgs;
	}

	static applyAlias(commandAliases, arg, num) {
		if (commandAliases[num]) {
			const replacement = commandAliases[num][arg.toLowerCase()];
			return replacement || arg;
		}
		return arg;
	}
}

module.exports = SheetAliases;
