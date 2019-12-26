const SheetAliases = require("./SheetAliases.js");

function getTestData() {
	return 	[
		// command, arg number, source, replacement
		[
			"!loot",
			0,
			"theboss",
			"firstboss",
		],
		[
			"!loot",
			1,
			"big",
			"major",
		],
		[
			"!loothelp",
			0,
			"badreplace1",
			"wrongcmd",
		],
		[
			"!loot",
			0,
			"badreplace2",
			"wrongarg",
		],
	];
}

test("replaces arguments", () => {
	const data = getTestData();
	const aliases = new SheetAliases(data);
	const newArgs = aliases.applyAliases("!loot", [
		"theboss",
		"big",
	]);
	expect(newArgs).toEqual([
		"firstboss",
		"major",
	]);
});

test("doesn't replace wrong arguments", () => {
	const data = getTestData();
	const aliases = new SheetAliases(data);
	const newArgs = aliases.applyAliases("!loot", [
		"badreplace1",
		"badreplace2",
	]);
	expect(newArgs).toEqual([
		"badreplace1",
		"badreplace2",
	]);
});
