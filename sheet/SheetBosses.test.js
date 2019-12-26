const SheetBosses = require("./SheetBosses");

function getTestData() {
	return [["", "FirstBoss", "SecondBoss"]];
}

test("returns boss names", () => {
	const data = getTestData();
	const bosses = new SheetBosses(data);
	expect(bosses.getBosses()).toEqual(["FirstBoss", "SecondBoss"]);
});

test("returns correct boss columns", () => {
	const data = getTestData();
	const bosses = new SheetBosses(data);
	// case insensitive
	expect(bosses.getColumn("Firstboss")).toBe("B");
	expect(bosses.getColumn("secondboss")).toBe("C");
});
