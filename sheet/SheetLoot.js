
class SheetLoot {
	constructor(sheetData) {
		const names = {};
		for (let i = 1; i < sheetData.length; i++) {
			const name = sheetData[i][0];
			if (name.length !== 0) {
				names[name.toLowerCase()] = i + 1;
			}
		}
		this.names = names;
	}

	contains(name) {
		return this.names[name.toLowerCase()] !== undefined;
	}

	getRow(name) {
		return this.names[name.toLowerCase()];
	}
}

module.exports = SheetLoot;
