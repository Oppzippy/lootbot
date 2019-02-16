const fs = require("fs");
const readline = require("readline")
const {google} = require("googleapis");
const TOKEN_PATH = "googletoken.json";
const SCOPE = {

};

class SpreadsheetInterface {
    constructor(credentials) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                this.newToken();
            } else {
                oAuth2Client.setCredentials(JSON.parse(token));
            }
        })
    }

    newToken() {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPE
        });
        console.log("Auth URL: ", authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Enter code: ", (code) => {
            rl.close()
            oAuth2Client.getToken(code, (err, token => {
                if (err) {
                    console.error(err)
                    return;
                }
                oAuth2Client.setCredentials(token);
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) {
                        console.error("Failed to write token to file");
                    } else {
                        console.log("Wrote token to file");
                    }
                });
            }));
        });
    }

}

module.exports = SpreadsheetInterface;
