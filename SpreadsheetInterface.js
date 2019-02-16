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

	getDiscordPermissions() {
		const sheets = google.sheets({ version: "v4", auth: this.oAuth2Client });
		sheets.spreadsheets.values.get({
			spreadsheetId: this.spreadsheetId,
			range: "'Discord Mapping'!A2:B",
		}, (err, res) => {
			const rows = res.data.values;
			const permissions = {};
			rows.forEach((row) => {
				if (!permissions[row[0]]) {
					permissions[row[0]] = [];
				}
				permissions[row[0]].push(row[1]);
			});
			return permissions;
		});
	}

	getCell(name, boss) {
		const sheets = google.sheets({ version: "v4", auth: this.oAuth2Client });
	}
}

module.exports = SpreadsheetInterface;
