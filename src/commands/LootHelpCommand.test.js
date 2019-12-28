const LootHelpCommand = require("./LootHelpCommand");

function getTestData() {
	const reply = jest.fn(text => text);

	const commandData = {
		msg: {
			channel: {
				id: 1,
			},
			reply,
		},
	};

	const sheetControllers = {
		1: {
			getSheetData: jest.fn(() => undefined),
			bosses: {
				getBosses: () => ["firstboss", "SecondBoss"],
			},
			options: {
				getOptions: () => ["major", "minor"],
			},
		},
	};

	return { commandData, sheetControllers, reply };
}

test("responds to command", async () => {
	const { commandData, sheetControllers, reply } = getTestData();
	const command = new LootHelpCommand(sheetControllers);
	await command.onCommand(commandData);
	expect(reply.mock.results[0].value.length).toBeGreaterThan(0);
});
