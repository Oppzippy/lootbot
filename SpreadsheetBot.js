const Discord = require("discord.js");

const commandRegex = /^!(\w+)(.*)/;

class SpreadsheetBot {
	constructor(token) {
		this.commands = {};
		this.client = new Discord.Client();
		this.client.login(token);

		this.client.on("error", console.error);

		this.client.on("ready", () => {
			console.log(`Logged in as ${this.client.user.tag}`);
			if (this.status) {
				this.client.user.setActivity(this.status);
			}
		});

		this.client.on("message", (msg) => {
			const match = commandRegex.exec(msg.content);
			if (match) {
				const command = match[1];
				const callback = this.commands[command];
				if (callback) {
					const args = match[2].trim().split(" ");
					callback(msg, command, args);
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

	setStatus(status) {
		this.status = status;
		this.client.user.setActivity(status); // Does nothing if not connected
	}
}

module.exports = SpreadsheetBot;
