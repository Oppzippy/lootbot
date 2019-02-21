const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const SheetBosses = require("./sheet/SheetBosses");
const SheetLoot = require("./sheet/SheetLoot");
const SheetOptions = require("./sheet/SheetOptions");
const SheetPermissions = require("./sheet/SheetPermissions");

const TOKEN_PATH = "googletoken.json";
const SCOPE = [
	"https://www.googleapis.com/auth/spreadsheets",
];

class SpreadsheetController {
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
				"'Discord Mapping'!A2:B", // Discord permissions
				"'Loot'!A:J", // Boss names, player names
				"'Loot Options'!A:B", // Major upgrade, minor upgrade, etc.
			],
		});
		const permissionsSheet = res.data.valueRanges[0].values;
		const lootSheet = res.data.valueRanges[1].values;
		const optionsSheet = res.data.valueRanges[2].values;
		if (permissionsSheet && lootSheet && optionsSheet) {
			this.bosses = new SheetBosses(lootSheet);
			this.names = new SheetLoot(lootSheet);
			this.permissions = new SheetPermissions(permissionsSheet);
			this.options = new SheetOptions(optionsSheet);
		} else {
			console.error("Error fetching sheet data");
		}
	}

	async setLootStatus(name, boss, status) {
		const sheets = google.sheets({ version: "v4", auth: this.oAuth2Client });
		const range = this.bosses.getColumn(boss) + this.names.getRow(name);
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

module.exports = SpreadsheetController;
