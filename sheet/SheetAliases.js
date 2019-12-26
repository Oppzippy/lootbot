class SheetAliases {
	constructor(sheetData) {
		this.aliases = {};
		sheetData.forEach((row) => {
			const [command, arg, source, replacement] = row;
			try {
				const argNum = parseInt(arg, 10);
				this.addAlias(command, argNum, source, replacement);
			} catch (ex) {
				// ignore
			}
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
		const commandAliases = this.aliases[command];
		if (commandAliases) {
			return args.map((arg, i) => SheetAliases.applyAlias(commandAliases, arg, i));
		}
		return [];
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
