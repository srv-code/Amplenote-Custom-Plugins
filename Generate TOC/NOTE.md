---
title: Generate Table of Contents (TOC)
uuid: b3925bc2-5805-11f1-bafa-798d2be70210
version: 2
created: '2026-05-25T12:18:13+05:30'
updated: '2026-05-25T12:20:04+05:30'
tags:
  - '-/tech/app/amplenote/plugin'
---

| | |
|-|-|
|Name|Generate TOC|
|Icon|list_alt|
|Description|Unofficial implementation of {toc}, Table of Contents.|
|Instructions|![61874d30-5bdb-4c6e-80ac-0fdeea4e6119.png\|404.2100830078125](https://images.amplenote.com/5a48b3c4-1b29-11ef-a3e4-1e8bc664fb96/61874d30-5bdb-4c6e-80ac-0fdeea4e6119.png) <br /><br />Adds TOC (Table of Contents) features like the official one.<br /><br />This plugin has two features:<br />1. **Inline TOC**: Type "{ntoc}" (numbered) or "{btoc}" (bullet) to insert the TOC. Similar to the official {toc} feature.<br />2. **Note-level TOC**: Select "Generate TOC" from note options to add TOC at the beginning of the note. As long as it's there, a new TOC overwrites the old one whenever it is triggered again.<br /><br />Settings (can be configured in "Account Settings > Plugins > Generate TOC (Gear icon)"):<br />- **Ordered TOC Expression Name**: Expression name for numbered TOC. Defaults to "ntoc".<br />- **Unordered TOC Expression Name**: Expression name for bullet TOC. Defaults to "btoc".<br />- **Enable Note Level TOC**: Set this to "false" to turn off note-level TOC feature. Defaults to true.<br />- **Use Ordered TOC in Note Level TOC**: Set this to "false" to make Nove-level TOCs unordered (bullets). Defaults to true.<br /><br />Disclaimer: I haven't thoroughly tested if this successfully works in every situation. Please use it at your own risk.<br /><br />Note (Nov 20th, 2024): Unfortunately, I'm no longer using Amplenote and this plugin is no longer supported. Please use all or part of this note without any permission if you are interested in further development.|
|Setting|Title (string)|
|Setting|Enable Note Level TOC (y/n \| default: y)|
|Setting|Use Ordered TOC in Note Level TOC (y/n \| default: y)|
|Setting|Ordered TOC Expression Name (string \| default: ntoc)|
|Setting|Unordered TOC Expression Name (string \| default: btoc)|
|Setting|Use modern link embedding? (y/n \| default: y)|
