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

		this.client.setInterval(() => {
			// Discord either has a timeout on presences or it just randomly clears
			if (this.client.user && this.client.readyAt) {
				this.client.user.setActivity(this.status);
			}
		}, 60000);

		this.client.on("message", msg => {
			const match = commandRegex.exec(msg.content);
			if (match) {
				const command = match[1];
				const callback = this.commands[command];
				if (callback) {
					const type = typeof callback;
					const args = match[2].trim().split(" ");
					const commandData = {
						msg,
						command,
						args,
					};
					if (type === "function") {
						callback(commandData);
					} else if (type === "object") {
						callback.onCommand(commandData);
					}
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
		if (this.client.user) {
			// Delayed until ready if not yet connected
			this.client.user.setActivity(status);
		}
	}

	destroy() {
		this.client.destroy();
	}
}

module.exports = SpreadsheetBot;
