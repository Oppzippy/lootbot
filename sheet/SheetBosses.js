
class SheetBosses {
	constructor(sheetData) {
		const row = sheetData[0];
		const bosses = row.map((name, i) => [name.toLowerCase(), {
			name,
			column: String.fromCharCode(65 + i),
		}]);
		const filteredBosses = bosses.filter(entry => entry[0].length !== 0);
		this.bosses = Object.fromEntries(filteredBosses);
	}

	includes(boss) {
		return boss.toLowerCase() in this.bosses;
	}

	getBosses() {
		return Object.values(this.bosses).map(boss => boss.name);
	}

	getColumn(boss) {
		return this.includes(boss) ? this.bosses[boss.toLowerCase()].column : null;
	}
}

module.exports = SheetBosses;
