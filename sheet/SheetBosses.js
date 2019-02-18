
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
		return this.bosses[boss.toLowerCase()] !== undefined;
	}

	getBosses() {
		return Object.keys(this.bosses);
	}

	getColumn(boss) {
		return this.bosses[boss.toLowerCase()];
	}
}

module.exports = SheetBosses;
