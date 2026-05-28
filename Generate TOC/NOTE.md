---
title: Table of Contents (TOC) for Free
uuid: b3925bc2-5805-11f1-bafa-798d2be70210
version: 2
created: '2026-05-28T16:20:11+05:30'
updated: '2026-05-28T16:20:11+05:30'
---

| | |
|-|-|
|name|Generate TOC|
|icon|list_alt|
|description|Unofficial implementation of {toc}, Table of Contents.|
|instructions|![61874d30-5bdb-4c6e-80ac-0fdeea4e6119.png\|383.984375](https://images.amplenote.com/5a48b3c4-1b29-11ef-a3e4-1e8bc664fb96/61874d30-5bdb-4c6e-80ac-0fdeea4e6119.png) [^1]<br /><br />Adds TOC (Table of Contents) features like the official one.<br /><br />This plugin has two features:<br />1. **Inline TOC**: Type "{ntoc}" (numbered) or "{btoc}" (bullet) to insert the TOC. Similar to the official {toc} feature.<br />2. **Note-level TOC**: Select "Generate TOC" from note options to add TOC at the beginning of the note. As long as it's there, a new TOC overwrites the old one whenever it is triggered again.<br /><br />Settings (can be configured in "Account Settings > Plugins > Generate TOC (Gear icon)"):<br />- **Ordered TOC Expression Name**: Expression name for numbered TOC. Defaults to "ntoc".<br />- **Unordered TOC Expression Name**: Expression name for bullet TOC. Defaults to "btoc".<br />- **Enable Note Level TOC**: Set this to "false" to turn off note-level TOC feature. Defaults to true.<br />- **Use Ordered TOC in Note Level TOC**: Set this to "false" to make Nove-level TOCs unordered (bullets). Defaults to true.<br /><br />Disclaimer: I haven't thoroughly tested if this successfully works in every situation. Please use it at your own risk.<br /><br />Note (Nov 20th, 2024): Unfortunately, I'm no longer using Amplenote and this plugin is no longer supported. Please use all or part of this note without any permission if you are interested in further development.|
|setting|Ordered TOC Expression Name|
|setting|Unordered TOC Expression Name|
|setting|Enable Note Level TOC|
|setting|Use Ordered TOC in Note Level TOC|

Updates:

- Nov 20th, 2024

    - Fixed bugs (thanks User #123766!)

    - Changed the default plugin expression names ('otoc' and 'utoc' to 'ntoc' and 'btoc', respectively). If you prefer previous ones, you can change them in Plugin Settings, explained in the description.

    - Unfortunately, this plugin is no longer supported. If you are interested in further development, please use all or part of this note freely without any permission.

- May 31st, 2024

    - Changed icon to "list_alt" (same as the official {toc})

- May 30th, 2024

    - Deprecated {tocf} and added {otoc} and {utoc}. These names can be changed via the Settings.

    - Changed setting keys

- May 26th, 2024

    - First release

\
