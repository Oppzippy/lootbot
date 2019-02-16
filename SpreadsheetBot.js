const Discord = require("discord.js");

const commandRegex = /^!(\w+)(.*)/;

class SpreadsheetBot {
	constructor(token) {
		this.commands = {};
		this.client = new Discord.Client();
		this.client.login(token);

		this.client.on("ready", () => {
			console.log(`Logged in as ${client.user.tag}`);
		});

		this.client.on("message", (msg) => {
			const match = commandRegex.exec(msg.content);
			if (match) {
				const command = match[1];
				const callback = this.commands[command];
				if (callback) {
					const args = match[2].split(" ");
					callback(command, args);
				}
			}
		});
	}

	addCommand(command, callback) {
		this.commands[command] = callback;
	}

	removeCommand(command) {
		delete this.commands[command];
	}
}

module.exports = SpreadsheetBot;
