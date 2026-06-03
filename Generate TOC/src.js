// JavaScript 
{
  constants: {
    settings: {
      TITLE: "Title (string)",
      ENABLE_NOTE_LEVEL_TOC: "Enable Note Level TOC (y/n | default: y)",
      USE_ORDERED_TOC_IN_NOTE_LEVEL_TOC: "Use Ordered TOC in Note Level TOC (y/n | default: y)",
      USE_MODERN_EMBEDDING: "Use modern link embedding? (y/n | default: y)",
      ORDERED_TOC_EXPRESSION_NAME: "Ordered TOC Expression Name (string | default: ntoc)",
      UNORDERED_TOC_EXPRESSION_NAME: "Unordered TOC Expression Name (string | default: btoc)",
    },
    messages: {
      INVALID_SETTING_ERROR: 'Invalid value provided for "$1". Please enter \'y\' or \'n\'.',
      INTERNAL_ERROR: 'Something went wrong!\nPlease refer the console logs for the technical details and inform the developer.',
    },
  },

  validateSettings(app, settings) {
    const booleanRegex = /y|n/gi;
    const errors = [];
    const exceptionList = [
      this.constants.settings.TITLE,
      this.constants.settings.ORDERED_TOC_EXPRESSION_NAME,
      this.constants.settings.UNORDERED_TOC_EXPRESSION_NAME,
    ];
    for(const [name, value] of Object.entries(settings)) {
      if(exceptionList.includes(name)) continue;
      if(!booleanRegex.test(value.trim()))
        errors.push(this.constants.messages.INVALID_SETTING_ERROR.replace('$1', name));
    }
    if(errors.length === 0) return false;
    return errors;
  },

  _getTOCFromSections(sections, usesOrderedTOC, title, useModernEmbedding, noteUUID) {
    // Get the minimum level of headings (i.e. most top-level heading)
    let minHeadingLevel = 3;
    for (const section of sections) {
      if (section.heading && section.heading.level < minHeadingLevel) {
        minHeadingLevel = section.heading.level;
      }
    }

    function generateTOCLine(level, text, anchor, usesOrderedTOC) {
      const isModernEmbeddingSupported = !anchor.includes('/')
      const link = useModernEmbedding && isModernEmbeddingSupported
        ? `https://www.amplenote.com/notes/${noteUUID}#${anchor}`
        : `#${anchor}`;

      const components = [
        "    ".repeat(level),
        usesOrderedTOC ? "1." : "-",
        " [",
        text.trim(),
        "](",
        link,
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
    // If a title setting was provided, put it in bold above the links
    if (title && typeof title === "string" && title.trim() !== "") {
      ret = `**${title.trim()}**\n\n` + ret;
    }
    return ret;
  },
  
  _isTOCish(noteContent, usesOrderedTOC) {
    const re = RegExp(
      "^(| {4,8})" +
        (usesOrderedTOC ? "1\\." : "-") +
        " \\[.+\\]\\((?:#|https://www\\.amplenote\\.com/notes/[^#]+#).+\\) $",
    );
    const lines = noteContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === "") continue;
      // Allow an optional bold title line at the top of TOC (e.g. **Title**)
      if (/^\*\*.*\*\*$/.test(lines[i].trim())) continue;
      if (lines[i] === "---") return true;
      if (!re.test(lines[i])) return false;
    }
    return false;
  },

  _getSettingValue(app, settingName, type = "string", defaultValue = null) {
    // Ensure the provided key is one of the defined constant keys
    if (!Object.values(this.constants.settings).includes(settingName))
      throw new Error(`Invalid setting name '${settingName}' specified`);

    // Validate the requested type
    if (type !== "boolean" && type !== "string")
      throw new Error(`Invalid type with value '${type}' specified`);

    const val = app.settings[settingName];
    if (type === "boolean") return val?.length > 0 ? val.trim().toLowerCase() === 'y' : (defaultValue || false);
    if (type === "string") return val || defaultValue;
  },

  _handleError(app, error) {
    const message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Plugin Error: %O\n%O", message, error?.stack ?? error);
    app.alert(this.constants.messages.INTERNAL_ERROR, {
      primaryAction: { label: "ABORT", icon: "back_hand" },
    });
  },

  __diag__checkSettingsParsing(app) {
    console.group('__diagnostics__checkSettingsParsing');
    console.log('Settings', app.settings);
    console.log('Parsed', {
      ENABLE_NOTE_LEVEL_TOC: this._getSettingValue(app, this.constants.settings.ENABLE_NOTE_LEVEL_TOC, "boolean", true),
      USE_ORDERED_TOC_IN_NOTE_LEVEL_TOC: this._getSettingValue(app, this.constants.settings.USE_ORDERED_TOC_IN_NOTE_LEVEL_TOC, "boolean", true),
      USE_MODERN_EMBEDDING: this._getSettingValue(app, this.constants.settings.USE_MODERN_EMBEDDING, "boolean", true),
      TITLE: this._getSettingValue(app, this.constants.settings.TITLE, "string"),
      ORDERED_TOC_EXPRESSION_NAME: this._getSettingValue(app, this.constants.settings.ORDERED_TOC_EXPRESSION_NAME, "string", "ntoc"),
      UNORDERED_TOC_EXPRESSION_NAME: this._getSettingValue(app, this.constants.settings.UNORDERED_TOC_EXPRESSION_NAME, "string", "btoc"),
    });
    console.groupEnd();
  },
  
  noteOption: {
    check(app) {
      try {
        // this.__diag__checkSettingsParsing(app);
        return this._getSettingValue(app, this.constants.settings.ENABLE_NOTE_LEVEL_TOC, "boolean", true);
      } catch (error) {
        this._handleError(app, error);
        return null;
      }
    },
    
    async run(app, noteUUID) {
      try {
        const usesOrderedTOC = this._getSettingValue(app, this.constants.settings.USE_ORDERED_TOC_IN_NOTE_LEVEL_TOC, "boolean", true);
        const useModernEmbedding = this._getSettingValue(app, this.constants.settings.USE_MODERN_EMBEDDING, "boolean", true);
        const noteContent = await app.getNoteContent({ uuid: noteUUID });
        const sections = await app.getNoteSections({ uuid: noteUUID });
        const title = this._getSettingValue(app, this.constants.settings.TITLE, "string");
        const toc = this._getTOCFromSections(sections, usesOrderedTOC, title, useModernEmbedding, noteUUID);
        if (this._isTOCish(noteContent, usesOrderedTOC)) {
          app.replaceNoteContent({ uuid: noteUUID }, toc, {section: {}});
        } else {
          app.insertNoteContent({ uuid: noteUUID }, toc + "---\n\n");
        }
      } catch (error) {
        this._handleError(app, error);
      }
    },
  },

  async _insertTextRun(app, usesOrderedTOC) {
    try {
      const sections = await app.getNoteSections({ uuid: app.context.noteUUID });
      const useModernEmbedding = this._getSettingValue(app, this.constants.settings.USE_MODERN_EMBEDDING, "boolean", true);
      const title = this._getSettingValue(app, this.constants.settings.TITLE, "string");
      const toc = this._getTOCFromSections(sections, usesOrderedTOC, title, useModernEmbedding, app.context.noteUUID);
      const replacedSelection = await app.context.replaceSelection("\n" + toc);
      return null;
    } catch (error) {
      this._handleError(app, error);
      return null;
    }
  },

  insertText: {
    "Numbered": {
      check(app) {
        try {
          return this._getSettingValue(app, this.constants.settings.ORDERED_TOC_EXPRESSION_NAME, "string", "ntoc");
        } catch (error) {
          this._handleError(app, error);
          return null;
        }
      },
      run(app) {
        return this._insertTextRun(app, true);
      },
    },

    "Bullet": {
      check(app) {
        try {
          return this._getSettingValue(app, this.constants.settings.UNORDERED_TOC_EXPRESSION_NAME, "string", "btoc");
        } catch (error) {
          this._handleError(app, error);
          return null;
        }
      },
      run(app) {
        return this._insertTextRun(app, false);
      },
    },
  }
}