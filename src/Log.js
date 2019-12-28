// TODO delete this file

const dateformat = require("dateformat");

const hooks = ["log", "error"];

hooks.forEach(funcName => {
	const func = console[funcName];
	console[funcName] = function(...args) {
		const date = new Date();
		args.unshift(dateformat(date, "yyyy-mm-dd HH:MM:ss:")); // add date+time as prefix

		func.apply(console, args);
	};
});
