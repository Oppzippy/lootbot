
class SheetBosses {
	constructor(sheetData) {
		const row = sheetData[0];
		const bosses = {};
		for (let i = 0; i < row.length; i++) {
			if (row[i].length !== 0) {
				bosses[row[i].toLowerCase()] = String.fromCharCode(65 + i);
			}
		}
		this.bosses = bosses;
	}

	contains(boss) {
		return this.bosses[boss.toLowerCase()] !== null;
	}

	getBosses() {
		return this.bosses.keys();
	}

	getColumn(boss) {
		return this.bosses[boss.toLowerCase()];
	}
}

module.exports = SheetBosses;
