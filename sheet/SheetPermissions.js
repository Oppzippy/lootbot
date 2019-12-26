
class SheetPermissions {
	constructor(sheetData) {
		const permissions = {};
		sheetData.forEach((row) => {
			const [accountId, character] = row;
			if (!permissions[accountId]) {
				permissions[accountId] = [];
			}
			permissions[accountId].push(character);
		});
		this.permissions = permissions;
	}

	contains(accountId) {
		return accountId in this.permissions;
	}

	hasPermission(accountId, name) {
		return this.permissions[accountId] && this.permissions[accountId].findIndex(
			character => character.toLowerCase() === name.toLowerCase(),
		) !== undefined;
	}

	getName(accountId) {
		const perms = this.permissions[accountId];
		if (!perms || perms.length !== 1) {
			return null;
		}
		return perms[0];
	}
}

module.exports = SheetPermissions;
