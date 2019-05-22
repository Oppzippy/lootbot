class Command {
	static validate(condition, error, ...args) {
		if (!condition) {
			error(...args);
		}
	}
}

module.exports = Command;
