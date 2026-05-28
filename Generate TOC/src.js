// JavaScript 
{
  _getTOCFromSections(sections, usesOrderedTOC) {
    // Get the minimum level of headings (i.e. most top-level heading)
    let minHeadingLevel = 3;
    for (const section of sections) {
      if (section.heading && section.heading.level < minHeadingLevel) {
        minHeadingLevel = section.heading.level;
      }
    }

    function generateTOCLine(level, text, anchor, usesOrderedTOC) {
      const components = [
        "    ".repeat(level),
        usesOrderedTOC ? "1." : "-",
        " [",
        text,
        "](#",
        anchor,
        ") \n\n",
      ];
      return components.join("");
    }

    // Generate TOC
    let ret = "";
    let isFirstHeading = true;
    for (const section of sections) {
      if (section.heading) {
        if (isFirstHeading && section.heading.level > minHeadingLevel) {
          for (let i = 0; section.heading.level - i > minHeadingLevel; i++) {
            ret += generateTOCLine(i, "_", "_", usesOrderedTOC);
          }
        }
        isFirstHeading = false;
        ret += generateTOCLine(
          section.heading.level - minHeadingLevel,
          section.heading.text,
          section.heading.anchor,
          usesOrderedTOC,
        );
      }
    }
    return ret;
  },

  _isTOCish(noteContent, usesOrderedTOC) {
    const re = RegExp("^(| {4,8})" + (usesOrderedTOC ? "1\\." : "-") + " \\[.+\\]\\(#.+\\) $");
    const lines = noteContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === "") continue;
      if (lines[i] === "---") return true;
      if (! re.test(lines[i])) return false;
    }
    return false;
  },

  noteOption: {
    check(app) {
      return app.settings["Enable Note Level TOC"] !== "false";
    },

    async run(app, noteUUID) {
      const usesOrderedTOC = app.settings["Use Ordered TOC in Note Level TOC"] !== "false";
      const noteContent = await app.getNoteContent({uuid: noteUUID});
      const sections = await app.getNoteSections({uuid: noteUUID});
      const toc = this._getTOCFromSections(sections, usesOrderedTOC);
      if (this._isTOCish(noteContent, usesOrderedTOC)) {
        app.replaceNoteContent({uuid: noteUUID}, toc, {section: {}});
      } else {
        app.insertNoteContent({uuid: noteUUID}, toc + "---\n\n");
      }
    },
  },

  async _insertTextRun(app, usesOrderedTOC) {
    const sections = await app.getNoteSections({uuid: app.context.noteUUID});
    const toc = this._getTOCFromSections(sections, usesOrderedTOC);
    const replacedSelection = await app.context.replaceSelection("\n" + toc);
    return null;
  },

  insertText: {
    "Numbered": {
      check(app) {
        return app.settings["Ordered TOC Expression Name"] || "ntoc";
      },
      run(app) {
        return this._insertTextRun(app, true);
      },
    },

    "Bullet": {
      check(app) {
        return app.settings["Unordered TOC Expression Name"] || "btoc";
      },
      run(app) {
        return this._insertTextRun(app, false);
      },
    },
  }
}