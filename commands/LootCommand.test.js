const LootCommand = require("./LootCommand");

function getTestData(options) {
	const reply = jest.fn(text => text);

	const commandData = {
		msg: {
			channel: {
				id: 1,
			},
			author: {
				id: 2,
			},
			reply,
		},
		command: "!loot",
		args: [],
	};
	const sheetControllers = {
		1: {
			getSheetData: async () => undefined,
			setLootStatus: async () => undefined,
			aliases: {
				applyAliases: jest.fn((command, args) => args),
			},
			permissions: {
				getName: options.permissionsHasName !== false
					? jest.fn(accountId => `Testname${accountId}`)
					: jest.fn(() => null),
				includes: jest.fn(() => options.permissionsIncludes),
				hasPermission: jest.fn(() => options.permissionsHasPermission),
			},
			options: {
				mockData: {
					major: "Major Upgrade",
					minor: "Minor Upgrade",
				},
				includes: function(key) {
					return key in this.mockData;
				},
				getLocalized: function(key) {
					return this.mockData[key];
				},
			},
			bosses: [
				"firstboss",
				"secondboss",
			],
			names: [
				options.permissionsIncludes ? "Testname2" : undefined,
			]
		},
	};
	return { commandData, sheetControllers, reply };
}

test("gives error message with no args", async () => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: true,
	});

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/^Invalid parameters/);
});

test("gives error message with bad boss name", async () => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: true,
	});
	commandData.args.push("nonexistentboss");
	commandData.args.push("major");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/nonexistentboss is not a boss/);
});

test("gives error message with bad option name", async () => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: true,
	});
	commandData.args.push("firstboss");
	commandData.args.push("nonexistentoption");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/nonexistentoption is not a valid option/);
});

test("gives error message when not included in permissions", async () => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: false,
		permissionsHasPermission: false,
	});
	commandData.args.push("firstboss");
	commandData.args.push("major");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/You are not listed in the spreadsheet/);
});

test("gives error message when there is more than one character option and a name isn't specified", async () => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: true,
		permissionsHasName: false,
	});

	commandData.args.push("firstboss");
	commandData.args.push("major");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/Please specify a character name/);
});

test("gives error message when you don't have edit permission", async () => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: false,
	});

	commandData.args.push("firstboss");
	commandData.args.push("major");
	commandData.args.push("Otheruser");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/You don't have permission to edit Otheruser/);
});

test("gives error message when name isn't listed in spreadsheet", async () => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: true,
	});

	sheetControllers[1].names = [];

	commandData.args.push("firstboss");
	commandData.args.push("major");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/Testname2 is not listed in the spreadsheet/);
});

test("works with valid args and one character", async() => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: true,
	});

	commandData.args.push("firstboss");
	commandData.args.push("major");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/Updated Testname2's loot status for firstboss to Major Upgrade/);
});

test("works with valid args and multiple characters", async() => {
	const { commandData, sheetControllers, reply } = getTestData({
		permissionsIncludes: true,
		permissionsHasPermission: true,
		permissionsHasName: false,
	});

	commandData.args.push("firstboss");
	commandData.args.push("major");
	commandData.args.push("Testname2");

	const lootCommand = new LootCommand(sheetControllers);
	await lootCommand.onCommand(commandData);
	expect(reply.mock.results[0].value).toMatch(/Updated Testname2's loot status for firstboss to Major Upgrade/);
});
