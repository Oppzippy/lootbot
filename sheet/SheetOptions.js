
class SheetOptions {
	constructor(sheetData) {
		const options = {};
		sheetData.forEach((row) => {
			options[row[0].toLowerCase()] = row[1];
		});
		this.options = options;
	}

	contains(option) {
		return this.options[option.toLowerCase()] !== null;
	}

	getOptions() {
		return this.options.keys();
	}

	getLocalized(option) {
		return this.options[option.toLowerCase()];
	}
}

module.exports = SheetOptions;
