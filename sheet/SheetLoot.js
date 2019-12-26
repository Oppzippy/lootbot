
class SheetLoot {
	constructor(sheetData) {
		const names = sheetData.map(row => row[0]);
		const nameRows = names.map((name, i) => [name.toLowerCase(), i + 1]);
		const filtered = nameRows.filter(name => name[0].length !== 0);
		this.names = Object.fromEntries(filtered);
	}

	includes(name) {
		return name.toLowerCase() in this.names;
	}

	getRow(name) {
		return this.names[name.toLowerCase()];
	}
}

module.exports = SheetLoot;
