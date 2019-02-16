const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const TOKEN_PATH = "googletoken.json";
const SCOPE = [
	"https://www.googleapis.com/auth/spreadsheets",
];

class SpreadsheetInterface {
	constructor(credentials, spreadsheetId) {
		this.spreadsheetId = spreadsheetId;
		const installed = credentials.installed;
		this.oAuth2Client = new google.auth.OAuth2(
			installed.client_id,
			installed.client_secret,
			installed.redirect_uris[0],
		);
		fs.readFile(TOKEN_PATH, (err, token) => {
			if (err) {
				this.newToken();
			} else {
				this.oAuth2Client.setCredentials(JSON.parse(token));
			}
			this.getSheetData();
		});
	}

	newToken() {
		const authUrl = this.oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: SCOPE,
		});
		console.log("Auth URL: ", authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question("Enter code: ", (code) => {
			rl.close();
			this.oAuth2Client.getToken(code, (err, token) => {
				if (err) {
					console.error(err);
					return;
				}
				this.oAuth2Client.setCredentials(token);
				fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2) => {
					if (err2) {
						console.error("Failed to write token to file");
					} else {
						console.log("Wrote token to file");
					}
				});
			});
		});
	}

	async getSheetData() {
		const sheets = google.sheets({ version: "v4", auth: this.oAuth2Client });
		const res = await sheets.spreadsheets.values.batchGet({
			spreadsheetId: this.spreadsheetId,
			ranges: [
				"'Discord Mapping'!A2:B",
				"'Loot'!A:J",
				"'Loot Options'!A:B",
			],
		});
		const permissionsSheet = res.data.valueRanges[0].values;
		const lootSheet = res.data.valueRanges[1].values;
		const optionsSheet = res.data.valueRanges[2].values;
		if (permissionsSheet && lootSheet && optionsSheet) {
			const {
				bosses, names, permissions, options,
			} = SpreadsheetInterface.createSheetData(lootSheet, permissionsSheet, optionsSheet);
			this.bosses = bosses;
			this.names = names;
			this.permissions = permissions;
			this.options = options;
		} else {
			console.error("Error fetching sheet data");
		}
	}

	static createSheetData(lootSheet, permissionsSheet, optionsSheet) {
		const bosses = SpreadsheetInterface.getBosses(lootSheet[0]);
		const names = SpreadsheetInterface.getNames(lootSheet);
		const permissions = SpreadsheetInterface.getPermissions(permissionsSheet);
		const options = SpreadsheetInterface.getOptions(optionsSheet);
		return {
			bosses, names, permissions, options,
		};
	}

	static getBosses(row) {
		const bosses = {};
		for (let i = 0; i < row.length; i++) {
			if (row[i] !== "") {
				bosses[row[i].toLowerCase()] = String.fromCharCode(65 + i);
			}
		}
		return bosses;
	}

	static getNames(lootSheet) {
		const names = {};
		for (let i = 1; i < lootSheet.length; i++) {
			const name = lootSheet[i][0];
			if (name !== "") {
				names[name.toLowerCase()] = i + 1;
			}
		}
		return names;
	}

	static getPermissions(permissionsSheet) {
		const permissions = {};
		permissionsSheet.forEach((row) => {
			if (!permissions[row[0]]) {
				permissions[row[0]] = [];
			}
			permissions[row[0]].push(row[1].toLowerCase());
		});
		return permissions;
	}

	static getOptions(optionsSheet) {
		const options = {};
		optionsSheet.forEach((row) => {
			options[row[0].toLowerCase()] = row[1];
		});
		return options;
	}

	async setLootStatus(name, boss, status) {
		const sheets = google.sheets({ version: "v4", auth: this.oAuth2Client });
		const range = this.bosses[boss.toLowerCase()] + this.names[name.toLowerCase()];
		await sheets.spreadsheets.values.update({
			spreadsheetId: this.spreadsheetId,
			range: range,
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [[status]],
			},
		});
	}
}

module.exports = SpreadsheetInterface;
