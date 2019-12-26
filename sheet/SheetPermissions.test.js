const SheetPermissions = require("./SheetPermissions");

function getTestData() {
	return [
		[
			"1",
			"Testname1",
		],
		[
			"2",
			"Testname2",
		],
		[
			"2",
			"Testname3",
		],
	];
}

test("gets name from account id", () => {
	const data = getTestData();
	const permissions = new SheetPermissions(data);
	expect(permissions.getName("1")).toBe("Testname1");
	expect(permissions.getName("?????")).toBeUndefined();
});

test("doesn't get name when more than one is available", () => {
	const data = getTestData();
	const permissions = new SheetPermissions(data);
	expect(permissions.getName("2")).toBeUndefined();
});

test("checks if user has permission to edit character", () => {
	const data = getTestData();
	const permissions = new SheetPermissions(data);
	expect(permissions.hasPermission("1", "Testname1")).toBeTruthy();
	expect(permissions.hasPermission("1", "Testname2")).toBeFalsy();
	expect(permissions.hasPermission("2", "Testname2")).toBeTruthy();
	expect(permissions.hasPermission("2", "Testname3")).toBeTruthy();
	expect(permissions.hasPermission("???", "Testname1")).toBeFalsy();
});
