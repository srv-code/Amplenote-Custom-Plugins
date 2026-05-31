---
title: Date/Time
uuid: 12ce1db8-5b4b-11f1-8ca0-9176b83ee4f6
version: 288
created: '2026-05-29T16:12:21+05:30'
updated: '2026-05-31T14:45:28+05:30'
tags:
  - '-/tech/app/amplenote/plugin'
---

| | |
|-|-|
|NAME|Date/Time|
|ICON|access_time_filled|
|DESCRIPTION|[^1]|
|INSTRUCTIONS|Use from the following main substitutions: `date`, `time`, `datetime`, `timestamp`<br />Use from the following experimental substitutions: `now`, `today`, `yesterday`, `tomorrow`, `milliseconds`|
|SETTING|Enable experimental features? (y/n \| default: n)|

[^1]: 
    Simple date-time substitutions to be used uniformly to maintain an agreed upon format throughout the notes.\
    The format of choices are: \
    \
    \- For date: `ddd, MON DD, YYYY` (e.g. *Fri, May 29, 2026*)

    \- For time: `HH:MM AM/PM (HH in 12-hours format)` (e.g. *04:45 PM*) (uses current locale)

    \- For datetime: `ddd, MON DD, YYYY at HH:MM AM/PM (HH in 12-hours format)` (e,.g. *Fri, May 29, 2026 at 04:45 PM*) (uses current locale)

    \- For timestamp: `DD/MM/YYYY, HH:MM:SS (HH in 24-hours format)` (e.g. *29/05/2026, 16:46:08*) (uses current locale)
