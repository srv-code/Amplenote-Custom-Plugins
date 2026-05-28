---
title: Filter Notes by Tag Expression
uuid: 131211ea-5807-11f1-b205-97c1de98e37f
version: 6
created: '2026-05-25T12:28:03+05:30'
updated: '2026-05-25T12:41:16+05:30'
tags:
  - '-/tech/app/amplenote/plugin'
---

| | |
|-|-|
|Name|Filter by Tag Expression|
|Description|Advanced tag flltering using tag expressions.|
|Icon|filter_alt|
|Setting|Create tag instead of a new note for the result? (y/n)|
|Setting|Search result tag name (default: search-result)|
\

***Status:** Not putting the plugin into production use until the manual verification is done for the point* [*Security Measures Before Production Use*](https://www.amplenote.com/notes/581ac7e8-5111-11f1-beda-33c1cc4a427d#Security_Measures_Before_Production_Use) 


---

**TABLE OF CONTENTS**

1. [Overview](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Overview) 

    1. [Purpose](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Purpose_) 

    1. [How to run](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#How_to_run_) 

    1. [Tag filter expression](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Tag_filter_expression_) 

    1. [How notes are matched](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#How_notes_are_matched_) 

    1. [Plugin settings](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Plugin_settings_) 

    1. [Default mode (setting ≠ y)](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Default_mode_(setting___y)_) 

    1. [Tag mode (setting = y)](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Tag_mode_(setting_=_y)_) 

    1. [Safety (what it does not do)](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Safety_(what_it_does_not_do)_) 

    1. [Errors](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Errors_) 

    1. [Example expressions](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Example_expressions_) 

    1. [Suggested metadata for the plugin note](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Suggested_metadata_for_the_plugin_note_) 

1. [Others](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Others_) 

    1. [Note](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Note_) 

    1. [Future Enhancements](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Future_Enhancements_) 

    1. [Limitations](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Limitations_) 

    1. [Bugs](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Bugs_) 

    1. [Security Measures Before Production Use](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Security_Measures_Before_Production_Use_) 

    1. [Tools Used](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Tools_Used_) 

1. [Code](https://www.amplenote.com/notes/131211ea-5807-11f1-b205-97c1de98e37f#Code) 


---

\

# Overview<!-- {"collapsed":true} -->

## Purpose 

- Filters your Amplenote notes by a **tag expression** using logical operators **AND**, **OR**, and **NOT**, with optional parentheses.

- Run from a note’s plugin menu (`noteOption`); the note you run it from is not modified.

- Shows matches either as a **new results note** (default) or by **tagging matches** and opening the notes list (optional).


---

## How to run 

- Open any note → run the plugin from the note options menu.

- Enter a tag filter expression when prompted (e.g. `amplenote OR (help AND docs)`).

- Cancel or leave the expression empty to exit without changes.


---

## Tag filter expression 

- **Tags**: letters, digits, hyphens, underscores, slashes (e.g. `help`, `todo/next`).

- **Operators**: `AND`, `OR`, `NOT` (case-insensitive).

- **Precedence**: `NOT` → `AND` → `OR`.

- **Grouping**: use parentheses, e.g. `amplenote OR (help AND docs)`.

- **Invalid syntax**: shows **“Incorrect input provided.”** and stops.


---

## How notes are matched 

- Loads notes via `app.filterNotes()`, then checks each note’s tags with the `note` interface.

- A note matches only if its tags satisfy the full expression.

- Results are sorted alphabetically by title.


---

## Plugin settings 

| | |
|-|-|
|**Setting**<!-- {"cell":{"align":"left","borderBottom":true,"borderRight":true}} -->|**Role**<!-- {"cell":{"align":"left","borderBottom":true}} -->|
|**Create tag instead of a new note for the result? (y/n)**<!-- {"cell":{"align":"left","borderBottom":true,"borderRight":true}} -->|`y` (after trim + lowercase) → tag mode. Anything else → default (new results note).<!-- {"cell":{"align":"left","borderBottom":true}} -->|
|**Search result tag name (default: search-result)**<!-- {"cell":{"align":"left","borderRight":true}} -->|Tag used in tag mode. Normalized to lowercase when used.<!-- {"cell":{"align":"left"}} -->|

---

## Default mode (setting ≠ `y`) 

- Creates a new note titled `Tag filter: <your expression>` with tag `tag-filter-results`.

- Fills it with a markdown table: **Title** (linked to each note) and **Tags**.

- Opens that results note.

- Does **not** change existing notes’ tags or content.


---

## Tag mode (setting = `y`) 

1. **Result tag name**

    1. If **Search result tag name** is set → use it (lowercased).

    1. If empty → prompt for a name (default `search-result`, placeholder “Please enter the tag name”).

    1. **Abort** or dismiss → alert **“User aborted the operation.”** and exit.

    1. Invalid name → re-prompt with a validation warning until valid or abort.

    1. Valid names: alphanumeric + hyphens only; no `--`; leading/trailing hyphens allowed; stored in lowercase.

    1. First successful prompt value is saved with `app.setSetting` for next runs.

1. **After filtering**

    1. Adds the result tag to each matching note (only if missing); existing tags are kept.

    1. Opens the notes list filtered to that tag (`/notes?tag=...`).


---

## Safety (what it does *not* do) 

- Does **not** delete notes or tags.

- Does **not** remove tags or edit bodies of existing notes.

- Does **not** rename existing notes.

- **Only additions**: optional new tag on matches (tag mode), or one new summary note (default mode).


---

## Errors 

- Parse/filter errors and unexpected failures → `app.alert` with the error message.

- Expression parse failure → **“Incorrect input provided.”**


---

## Example expressions 

- `amplenote` — notes with tag `amplenote`

- `help AND docs` — both tags

- `work AND NOT archived` — `work` without `archived`

- `amplenote OR (help AND docs)` — `amplenote`, or both `help` and `docs`


---

## Suggested metadata for the plugin note 

| | |
|-|-|
|**setting**<!-- {"cell":{"align":"left","borderBottom":true,"borderRight":true}} -->|**value**<!-- {"cell":{"align":"left","borderBottom":true}} -->|
|name<!-- {"cell":{"align":"left","borderBottom":true,"borderRight":true}} -->|Tag Filter<!-- {"cell":{"align":"left","borderBottom":true}} -->|
|description<!-- {"cell":{"align":"left","borderBottom":true,"borderRight":true}} -->|Filter notes by tag expressions (AND, OR, NOT) and view results in a new note or via a result tag.<!-- {"cell":{"align":"left","borderBottom":true}} -->|
|instructions<!-- {"cell":{"align":"left","borderBottom":true,"borderRight":true}} -->|*(paste the overview above)*<!-- {"cell":{"align":"left","borderBottom":true}} -->|
|Create tag instead of a new note for the result? (y/n)<!-- {"cell":{"align":"left","borderBottom":true,"borderRight":true}} -->|n<!-- {"cell":{"align":"left","borderBottom":true}} -->|
|Search result tag name (default: search-result)<!-- {"cell":{"align":"left","borderRight":true}} -->|search-result<!-- {"cell":{"align":"left"}} -->|
\

\

# Others <!-- {"collapsed":true} -->

## Note 

- For testing the plugin, make use of the test account (username: Cyto Rad)

\

## Future Enhancements 

- Add the types of errors which is presented to the user for any kinds of errors. This will help the user to take suitable actions, e.g. fixing the expression or fixing the tag name.

- The user can provide nested tag name for the resulting notes to store e.g. *tmp/search-result-xxxx.* Currently the regular expression validating the name of the tag has not included slashes so the validation fails.

- ~~Can add a~~ [~~setting~~][^1] ~~to choose from the option (A) to create a throwable tag and temporarily assign the notes returned to show in the notes list and (B) to create a new note to show the resultant list of notes in a tabular format (current implementation).~~

\

## Limitations 

- Due to Amplenote's API limitations this plugin can only be triggered from a note view whereas the idea point of interaction should be from a window > Notes view.

- The user entering the exact names of the tags with its complete path by hand (in textual format) is not practical at all. This is for the Amplenote's API limitation where suggestions for tag names don't work like in the *Recent Search/Search notes* input.

    - Mitigation: One hack can be to gather all the absolute names of the tags required from the *Recent Search/Search notes* input, construct the search expression and then paste in the expression input box of this plugin.

\

## <mark>Bugs</mark> 

- Applied the correct expression `-/panther/personal OR -/panther/experience` and it resulted in showing an error using alert in UI as "*Incorrect input provided*" and the error caught on the console is "*Uncaught (in promise) TypeError: Failed to convert value to 'Response'.*"  and the count of printing this error was 2.

\

## Security Measures Before Production Use 

- ~~Check the code to see for any destructive operations. Check with the Amplenote's API references (e.g. `note.xxx`, `app.xxx`)~~

\

## Tools Used 

Created entirely using prompts on Cursor AI.

\


---

\


---

\


---

\

# Code
