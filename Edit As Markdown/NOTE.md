---
title: 'Plugin: Markdown'
uuid: 911015fa-5aa6-11f1-97be-67eb3c71825e
version: 27
created: '2026-05-28T20:34:47+05:30'
updated: '2026-05-28T20:46:20+05:30'
tags:
  - '-/tech/app/amplenote/plugin'
---

| | |
|-|-|
|name|Markdown|
|icon|integration_instructions|
|description|Allows inserting Markdown into a note as well as editing the whole note as Markdown|
|instructions|This plugin allows you to insert Markdown content into a note at cursor position by typing `{Markdown: Insert}`.<br /><br />Additionally, it allows showing a note's contents as markdown and saving any changes back to the note by selecting "Markdown: Edit note" from the note options. **This is mostly useful for development purposes.**<br /><br />**Important note about editing a whole note as Markdown:** Currently, in the Amplenote plugin system the Markdown passed *to* plugins isn't 100% compatible with the Markdown passed *from* plugins. In some cases, content or formatting can get slightly modified when saving it back. It's even possible that data is lost in the process, so always be careful when using the Markdown note editing function and check the result is what you expect! **Especially rich footnotes often get messed up in the process!**<br /><br />![](https://images.amplenote.com/f9253dd6-91ff-11ee-b6cc-ee17344ed5d4/37f6089d-84c7-43c6-9f13-0b5411457f5a.gif)<br /><br />☕ If you like my work, you can [buy me a coffee](https://ko-fi.com/cherrydt)!|
