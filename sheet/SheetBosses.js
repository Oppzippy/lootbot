
class SheetBosses {
	constructor(sheetData) {
		const row = sheetData[0];
		const bosses = row.map((name, i) => [name.toLowerCase(), {
			name,
			column: String.fromCharCode(65 + i),
		}]);
		this.bosses = Object.fromEntries(bosses);
	}

	contains(boss) {
		return boss.toLowerCase() in this.bosses;
	}

	getBosses() {
		return Object.values(this.bosses).map(boss => boss.name);
	}

	getColumn(boss) {
		return this.bosses[boss.toLowerCase()];
	}
}

module.exports = SheetBosses;
