# Discord Loot Spreadsheet Bot
Edits a google sheet containing information about what bosses raiders need loot from.

Spreadsheet format:

"Loot" sheet:
The first row should contain boss name headers. The first column is player names.

"Discord Mapping" sheet:
Maps discord accounts to characters on the sheet. The first column is the discord account ID, and the second column is the character name. Discord accounts can have more than one character. The first row should be headers.

"Loot Options" sheet:
The first column will be used as input for the !loot discord command. The second column is what that will be translated to when the spreadsheet is being modified.
