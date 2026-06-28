// JavaScript 
{
  constants: {
    settings: {
      /** Title which should be displayed as the TOC section header. This is the anchoring header title, where future TOC updates will be made. Keep this unique to avoid ambiguity with other section titles. */
      TITLE: {
        label: "Title (string | default: TABLE OF CONTENTS)",
        defaultValue: 'TABLE OF CONTENTS',
        type: 'string',
      },
      
      /** Resets the indentation of any level of heading if immediately following a break (e.g. horizontal line). */
      CONSIDER_HEADER_BREAKS: {
        label: "Consider Header Breaks (y/n | default: y)",
        defaultValue: 'y',
        type: 'boolean',
      },

      /** Show a warning when duplicate titles are found and abort the operation. */
      ABORT_ON_DUPLICATE_TITLES: {
        label: "Abort On Duplicate Titles (y/n | default: y)",
        defaultValue: 'y',
        type: 'boolean',
      },

      /** Show a warning when invalid characters are found which might break the section linking and abort the operation. */
      ABORT_ON_OFFENDING_SECTION_TITLES: {
        label: "Abort On Offending Section Titles (y/n | default: y)",
        defaultValue: 'y',
        type: 'boolean',
      },
    },
    messages: {
      EMPTY_SETTING_ERROR: 'Invalid value provided for "$1". Please enter a non-empty value.',
      INVALID_BOOLEAN_SETTING_ERROR: 'Invalid value provided for "$1". Please enter \'y\' or \'n\'.',
      INTERNAL_ERROR: 'Something went wrong!\nPlease refer the console logs for the technical details and inform the developer.',
    },
    _: {
      /** Offending characters are for constructing section titles. */
      INVALID_SECTION_TITLE_CHARS: ['/'],
    },
  },

  validateSettings(app, settings) {
    const booleanRegex = /y|n/gi;
    const errors = [];
    const exceptionList = [];
    for(const [name, value] of Object.entries(settings)) {
      if(exceptionList.includes(name)) continue;
      if(name === this.constants.settings.TITLE && (!value || value.length === 0))
        errors.push(this.constants.messages.EMPTY_SETTING_ERROR.replace('$1', name));
      else if(!booleanRegex.test(value.trim()))
        errors.push(this.constants.messages.INVALID_BOOLEAN_SETTING_ERROR.replace('$1', name));
    }
    if(errors.length === 0) return false;
    return errors;
  },

  _isTOCHeader(heading, headingTitle) {
    return heading?.level === 3 && heading?.text === headingTitle;
  },

  // Generated using ChatGPT
  _nextAlphabet(str) {
    let chars = str.split('');
    let i = chars.length - 1;

    while (i >= 0) {
      if (chars[i] !== 'z') {
        chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
        return chars.join('');
      }

      chars[i] = 'a';
      i--;
    }

    chars.unshift('a');

    return chars.join('');
  },
  
  // Generated using ChatGPT
  _nextRoman(roman) {
    return this._toRoman(this._fromRoman(roman) + 1);
  },

  // Generated using ChatGPT
  _fromRoman(str) {
    const values = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000
    };

    str = str.toUpperCase();

    let total = 0;

    for (let i = 0; i < str.length; i++) {
      const current = values[str[i]];
      const next = values[str[i + 1]] || 0;

      if (current < next)
        total -= current;
      else
        total += current;
    }

    return total;
  },

  // Generated using ChatGPT
  _toRoman(num) {
    const lookup = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I']
    ];

    let result = '';

    for (const [value, numeral] of lookup) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }

    return result.toLowerCase();
  },

  _getNextIndex(index, level) {
    if(level === 1) {
      if(index[level] === null) index[level] = 1;
      else index[level] += 1;

      index[2] = null;
      index[3] = null;
    } else if(level === 2) {
      if(index[level] === null) index[level] = 'a';
      else index[level] = this._nextAlphabet(index[level]);

      index[3] = null;
    } else if(level === 3) {
      if(index[level] === null) index[level] = 'i';
      else index[level] = this._nextRoman(index[level]);
    } else throw Error('Invalid level');

    return index[level];
  },

  _generateTOCFromSections(noteUUID, title, sections, considerHeaderBreaks, insertOnly = false) {
    let content = '';
    const indexes = { 1: null, 2: null, 3: null };
    let sectionIndex = 0;
    let section = null;
    let replaceEntireContent = false;

    for(const { heading, index } of sections) {
      const isTOC = insertOnly ? false : this._isTOCHeader(heading, title);
      if(!!heading && !!heading.text.trim() && (!isTOC || (isTOC && !!section))) {
        const headingLevel = considerHeaderBreaks ? (sectionIndex > 0 && sections[sectionIndex-1].heading === null ? 1 : heading.level) : heading.level;
        content += '>.  ' + '    '.repeat(headingLevel-1) + `${this._getNextIndex(indexes, headingLevel)}.  [${heading.text.trim()}]`;
        if(this.constants._.INVALID_SECTION_TITLE_CHARS.find(ch => heading.anchor.includes(ch))) content += `(#${heading.anchor})`;
        else content += `(https://www.amplenote.com/notes/${noteUUID}#${heading.anchor})`;
        content += '\n>\n';
      }
      if(!section && isTOC) section = { heading, index };
      sectionIndex++;
    }
    return { section, content };
  },

  _getSettingValue(app, settingKey) {
    const { label, defaultValue, type } = this.constants.settings[settingKey];
    if(!label) throw new Error(`Invalid setting key '${settingKey}' specified`);

    const val = app.settings[label];
    if (type === "boolean") return val?.length > 0 ? val.trim().toLowerCase() === 'y' : (defaultValue === 'y' || false);
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
      TITLE: this._getSettingValue(app, 'TITLE'),
      CONSIDER_HEADER_BREAKS: this._getSettingValue(app, 'CONSIDER_HEADER_BREAKS'),
      ABORT_ON_DUPLICATE_TITLES: this._getSettingValue(app, 'ABORT_ON_DUPLICATE_TITLES'),
      ABORT_ON_OFFENDING_SECTION_TITLES: this._getSettingValue(app, 'ABORT_ON_OFFENDING_SECTION_TITLES'),
    });
    console.groupEnd();
  },

  _getTOCSection(title, content) {
    return `### ${title}\n${content}---\n\n`;
  },

  /**
   * Central execution function of this plugin
   * */
  async _exec(app, noteUUID, insertOnly = false) {
    try {
      // this.__diag__checkSettingsParsing(app);
      const sections = await app.getNoteSections({ uuid: noteUUID });
      if(this._getSettingValue(app, 'ABORT_ON_DUPLICATE_TITLES')) {
        const dupSections = sections.filter(sec => sec.heading != null && sec.heading.text.length > 0 && sec.index != null);
        if(dupSections.length > 0) {
          app.alert('Below sections have duplicate titles.\n' 
            + '(Hint: Fix them either by changing to a different title or pad them using spaces. Creating TOC now will result in ambiguous linkage.)\n' 
            + 'Current operation is ABORTED!\n\n'
            + '-- Section Title,  Header Level,  Instance Count --\n' 
            + dupSections.reduce((text, sec, index) => `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${sec.index}`, ''),
            {
              preface: 'Error: Duplicate Section Titles',
              primaryAction: { label: "ABORT", icon: "back_hand" },
            });
          return;
        }
      }

      if(this._getSettingValue(app, 'ABORT_ON_OFFENDING_SECTION_TITLES')) {
        const offendingSections = sections.filter(sec => 
          sec.heading != null
          && sec.heading.text.length > 0
          && this.constants._.INVALID_SECTION_TITLE_CHARS.find(ch => sec.heading.text.includes(ch))
        );
        if(offendingSections.length > 0) {
          app.alert('Below sections have problematic titles.\n' 
            + '(Hint: Fix them by eliminating the offending characters from their titles. Creating TOC now will result in broken linkage.)\n' 
            + 'Current operation is ABORTED!\n\n'
            + '-- Section Title,  Header Level, Offending Character(s) and Count --\n' 
            + offendingSections.reduce((text, sec, index) => {
              const chars = this.constants._.INVALID_SECTION_TITLE_CHARS.filter(ch => sec.heading.text.includes(ch)).join(' ');
              return `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${chars} (${chars.length})`
            }, ''),
            {
              preface: 'Error: Problematic Section Titles',
              primaryAction: { label: "ABORT", icon: "back_hand" },
            });
          return;
        }
      }

      const title = this._getSettingValue(app, 'TITLE')
      const { section, content } = this._generateTOCFromSections(
        noteUUID,
        title,
        sections,
        this._getSettingValue(app, 'CONSIDER_HEADER_BREAKS'),
        insertOnly,
      );

      if(insertOnly) {
        await app.context.replaceSelection(this._getTOCSection(title, content));
        return;
      }

      if(section) await app.replaceNoteContent({ uuid: noteUUID }, content, { section });
      else await app.insertNoteContent({ uuid: noteUUID }, this._getTOCSection(title, content));
    } catch (error) {
      this._handleError(app, error);
    }
  },

  noteOption: {
    /**
     * This is the main trigger option of the plugin. 
     * It first checks for the presence of the TOC. If not present, it simply attaches at the top of the note content. 
     * If the TOC section is present (checks only for the first occurrence), it updates in the existing section inline. 
     * */
    async run(app, noteUUID) {
      this._exec(app, noteUUID, false);
    },
  },

  insertText: {
    /** 
     * This implementation doesn't check for any existing TOC headers.
     * Rather, it generates and directly inserts the TOC at the cursor position. 
     * */
    'Insert TOC': {
      async run(app) {
        await this._exec(app, app.context.noteUUID, true);
      },
    },
  },
}