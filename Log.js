const fs = require("fs");
const dateformat = require("dateformat");

const hooks = ["log", "error"];

const writeStream = fs.createWriteStream("app.log", {
	flags: "a", // append
});

hooks.forEach(funcName => {
	const func = console[funcName];
	console[funcName] = function(...args) {
		const date = new Date();
		args.unshift(dateformat(date, "yyyy-mm-dd HH:MM:ss:")); // add date+time as prefix

		for (let i = 0; i < args.length; i++) {
			try {
				if (args[i]) {
					const str =
						typeof args[i] === "object"
							? JSON.stringify(args[i])
							: args[i].toString();
					writeStream.write(str);
					if (i !== args.length) {
						writeStream.write(" ");
					}
				}
			} catch (err) {
				// Should never be more than 2x recursion
				console.err(`Error printing ${typeof args[i]}`);
				if (typeof args[i] === "object") {
					console.err(`Failed to print ${args[i].constructor.name}`);
				}
			}
		}
		writeStream.write("\n");
		func.apply(console, args);
	};
});
