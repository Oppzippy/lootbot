# Lootbot
Edits a google sheet containing information about what bosses raiders need loot from.

Spreadsheet format:

"Loot" sheet:
The first row should contain boss name headers. The first column is player names. This sheet will store the information about which players needs loot from which bosses.

"Permissions" sheet:
Maps discord accounts to characters on the sheet. The first column is the discord account ID, and the second column is the character name. Discord accounts can have more than one character.

"Loot Options" sheet:
The first column will be used as input for the !loot discord command. The second column is what that will be translated to when the spreadsheet is being modified.

"Aliases" sheet:
The first column is the command for which the alias will apply to (excluding the "!" prefix). The second column is the argument number, starting from 0, that the alias applies to. The third and fourth columns are the source and replacement text, respectively.
