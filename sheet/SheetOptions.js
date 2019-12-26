
class SheetOptions {
	constructor(sheetData) {
		const options = sheetData.map(row => [row[0].toLowerCase(), row[1]]);
		this.options = Object.fromEntries(options);
	}

	includes(option) {
		return option.toLowerCase() in this.options;
	}

	getOptions() {
		return Object.keys(this.options);
	}

	getLocalized(option) {
		return this.options[option.toLowerCase()];
	}
}

module.exports = SheetOptions;
