
class SheetPermissions {
	constructor(sheetData) {
		const permissions = {};
		sheetData.forEach((row) => {
			if (!permissions[row[0]]) {
				permissions[row[0]] = [];
			}
			permissions[row[0]].push(row[1].toLowerCase());
		});
		this.permissions = permissions;
	}

	contains(id) {
		return this.permissions[id] !== null;
	}

	hasPermission(id, name) {
		return this.permissions[id] && this.permissions[id].contains(name.toLowerCase());
	}

	getName(id) {
		const perms = this.permissions[id];
		if (!perms || perms.length !== 1) {
			return null;
		}
		return perms[0];
	}
}

module.exports = SheetPermissions;
