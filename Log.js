const fs = require("fs");
const dateformat = require("dateformat");

const hooks = [
	"log",
	"error",
];

const writeStream = fs.createWriteStream("app.log", {
	flags: "a", // append
});

hooks.forEach((funcName) => {
	const func = console[funcName];
	console[funcName] = function(...args) {
		const date = new Date();
		args.unshift(dateformat(date, "yyyy-mm-dd hh:mm:ss:")); // add date+time as prefix

		for (let i = 0; i < args.length; i++) {
			writeStream.write(args[i]);
			if (i !== args.length) {
				writeStream.write(" ");
			}
		}
		writeStream.write("\n");
		func.apply(console, args);
	};
});
