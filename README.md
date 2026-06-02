# Amplenote Custom Plugins

Contains the customized versions of existing Amplenote plugins or plugins created from the ground-up.

---

## File Structure

```plain
README.md
.gitignore
<misc-root-files...>
<plugin-name>/
  |
  |- src.js
  |- NOTE.md
  |- PUBLIC.md
```

### File Descriptions
- `src.js`: Contains the singular file source code to be pasted directly into the note's code area
- `NOTE.md`: Contains the non-code part of the note complying to Amplenote's plugin note's structure
- `PUBLIC.md`: *(OPTIONAL)* Contains the public info of the plugin which is duplicated in personal workspace

---

## Branching Strategy
1. The `main` branch consists of all the latest version of all the plugins.
1. For each plugin their files will live inside their own folder hence a different root branch for each with their own names e.g. `generate-toc` for the plugin named *"Generate TOC"*.
1. For each plugin branch there will be the following sub-branches:
    1. `<plugin-name>/original`: (Optional) Contains the initial version of the original author's (if not a self-made plugin).
    1. `<plugin-name>/feature/*`: Contains the named features in development and not ready for production.
