const SheetOptions = require("./SheetOptions");

function getTestData() {
	return [["major", "Major Upgrade"], ["minor", "Minor Upgrade"]];
}

test("returns options", () => {
	const data = getTestData();
	const options = new SheetOptions(data);
	expect(options.getOptions()).toEqual(["major", "minor"]);
});

test("localizes options", () => {
	const data = getTestData();
	const options = new SheetOptions(data);
	expect(options.getLocalized("major")).toBe("Major Upgrade");
	expect(options.getLocalized("minor")).toBe("Minor Upgrade");
});
