const SheetLoot = require("./SheetLoot");

test("returns correct row numbers", () => {
	const loot = new SheetLoot([
		[""],
		["Testname1"],
		["Testname2"],
		["Testname3"],
	]);
	expect(loot.getRow("Testname1")).toBe(2);
	expect(loot.getRow("Testname2")).toBe(3);
	expect(loot.getRow("Testname3")).toBe(4);
});

test("ignores empty rows without error", () => {
	const loot = new SheetLoot([[], ["Testname1"], [], ["Testname2"]]);
	expect(loot.getRow("Testname1")).toBe(2);
	expect(loot.getRow("Testname2")).toBe(4);
});
