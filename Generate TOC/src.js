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

      /** Show a warning when duplicate titles are found and presented with two options, abort and proceed the operation. */
      WARN_ON_DUPLICATE_TITLES: {
        label: "Warn On Duplicate Titles (y/n | default: y)",
        defaultValue: 'y',
        type: 'boolean',
      },

      /** Show a warning when invalid characters are found which might break the section linking 
       * and presented with two options, abort and proceed the operation. */
      WARN_ON_OFFENDING_SECTION_TITLES: {
        label: "Warn On Offending Section Titles (y/n | default: y)",
        defaultValue: 'y',
        type: 'boolean',
      },

      /** Use unordered list i.e. show bullet points instead of ordered list. */
      USE_BULLET_POINTS: {
        label: "Use Bullet Points (y/n | default: n)",
        defaultValue: 'n',
        type: 'boolean',
      },
    },
    messages: {
      ERROR_INVALID_TITLE_SETTING_VALUE: 'Invalid value provided for "$1". Please remove the following characters: $2',
      ERROR_INVALID_BOOLEAN_SETTING: 'Invalid value provided for "$1". Please enter \'y\' or \'n\'.',
      ERROR_DUPLICATE_SECTION_TITLE: 'Error: Duplicate Section Titles',
      ERROR_DUPLICATE_SECTION_BODY: 'Below sections have duplicate titles.\n' 
            + '(Hint: Fix them either by changing to a different title or pad them using spaces. Creating TOC now will result in ambiguous linkage.)\n\n' 
            + '-- Section Title,  Header Level,  Instance Count --\n' 
            + '$1\n',
      ERROR_OFFENDING_SECTION_TITLE: 'Error: Problematic Section Titles',
      ERROR_OFFENDING_SECTION_BODY: 'Below sections have problematic titles.\n' 
            + '(Hint: Fix them by eliminating the offending characters from their titles. Creating TOC now will result in broken linkage.)\n\n' 
            + '-- Section Title,  Header Level, Offending Character(s) and Count --\n'
            + '$1\n',
      ERROR_INTERNAL_TITLE: 'Internal Error Occurred',
      ERROR_INTERNAL_BODY: 'Something unexpected happened:\n$1\n',
    },
    _: {
      /** Offending characters are for constructing section titles. */
      INVALID_SECTION_TITLE_CHARS: ['/'],

      /** These characters are used in unordered bullet points. */
      BULLET_H1_CHAR: '•',
      BULLET_H2_CHAR: '‣',
      BULLET_H3_CHAR: '◦',
    },
  },

  validateSettings(app, settings) {
    const booleanRegex = /y|n/gi;
    const errors = [];
    const exceptionList = [];

    for(const [name, value] of Object.entries(settings)) {
      if(exceptionList.includes(name)) continue;

      const setting = Object.values(this.constants.settings).find(stg => stg.label === name);
      if(!setting.label) throw Error(`Setting name mismatched: ${setting.label}`);

      if(value?.length > 0) {
        if(setting.type === 'string') {
          if(name === this.constants.settings.TITLE.label 
            && !!this.constants._.INVALID_SECTION_TITLE_CHARS.find(ch => value.includes(ch))
          )
            errors.push(
              this.constants.messages.ERROR_INVALID_TITLE_SETTING_VALUE
                .replace('$1', name)
                .replace('$2', this.constants._.INVALID_SECTION_TITLE_CHARS.join(' '))
            );
        } else if(setting.type === 'boolean') {
          if(!booleanRegex.test(value.trim()))
            errors.push(this.constants.messages.ERROR_INVALID_BOOLEAN_SETTING.replace('$1', name));
        } else throw Error(`Setting type mismatched: ${setting.label} of type ${setting.type}`);
      }
    }
    
    if(errors.length === 0) return false;
    return errors;
  },

  _isTOCHeader(heading, headingTitle) {
    return heading?.level === 3 && heading?.text === headingTitle;
  },

  /** Generated using ChatGPT ✨ */
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
  
  /** Generated using ChatGPT ✨ */
  _nextRoman(roman) {
    return this._toRoman(this._fromRoman(roman) + 1);
  },

  /** Generated using ChatGPT ✨ */
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

  /** Generated using ChatGPT ✨ */
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

  _getNextIndex(index, level, unordered) {
    if(level === 1) {
      if(unordered) return this.constants._.BULLET_H1_CHAR; 
      if(index[level] === null) index[level] = 1;
      else index[level] += 1;

      index[2] = null;
      index[3] = null;
    } else if(level === 2) {
      if(unordered) return this.constants._.BULLET_H2_CHAR; 
      if(index[level] === null) index[level] = 'a';
      else index[level] = this._nextAlphabet(index[level]);

      index[3] = null;
    } else if(level === 3) {
      if(unordered) return this.constants._.BULLET_H3_CHAR; 
      if(index[level] === null) index[level] = 'i';
      else index[level] = this._nextRoman(index[level]);
    } else throw Error('Invalid level');

    return `${index[level]}.`;
  },

  _generateTOCFromSections(noteUUID, title, sections, considerHeaderBreaks, unordered, insertOnly = false) {
    let content = '';
    const indexes = { 1: null, 2: null, 3: null };
    let sectionIndex = 0;
    let section = null;
    let replaceEntireContent = false;

    for(const { heading, index } of sections) {
      const isTOC = insertOnly ? false : this._isTOCHeader(heading, title);
      if(!!heading && !!heading.text.trim() && (!isTOC || (isTOC && !!section))) {
        const headingLevel = considerHeaderBreaks ? (sectionIndex > 0 && sections[sectionIndex-1].heading === null ? 1 : heading.level) : heading.level;
        content += '>.  ' + '    '.repeat(headingLevel-1) + `${this._getNextIndex(indexes, headingLevel, unordered)}  [${heading.text.trim()}]`;
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
    const setting = this.constants.settings[settingKey];
    if(!setting.label) throw Error(`Invalid setting key '${settingKey}' specified`);
    
    const { label, defaultValue, type } = setting;
    const val = app.settings[label];
    if (type === "boolean") return val?.length > 0 ? val.trim().toLowerCase() === 'y' : (defaultValue === 'y' || false);
    if (type === "string") return val || defaultValue;
    throw Error(`Invalid setting type: ${label} of type ${type}`);
  },

  _handleError(app, error) {
    const message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Plugin Error: %O\n%O", message, error?.stack ?? error);
    app.alert(this.constants.messages.ERROR_INTERNAL_BODY.replace('$1', message), {
      preface: this.constants.messages.ERROR_INTERNAL_TITLE, 
      primaryAction: { label: "ABORT", icon: "back_hand" },
    });
  },

  __diag__checkSettingsParsing(app) {
    console.group('__diagnostics__checkSettingsParsing');
    console.log('Settings', app.settings);
    console.log('Parsed', {
      TITLE: this._getSettingValue(app, 'TITLE'),
      CONSIDER_HEADER_BREAKS: this._getSettingValue(app, 'CONSIDER_HEADER_BREAKS'),
      WARN_ON_DUPLICATE_TITLES: this._getSettingValue(app, 'WARN_ON_DUPLICATE_TITLES'),
      WARN_ON_OFFENDING_SECTION_TITLES: this._getSettingValue(app, 'WARN_ON_OFFENDING_SECTION_TITLES'),
      USE_BULLET_POINTS: this._getSettingValue(app, 'USE_BULLET_POINTS'),
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
      if(this._getSettingValue(app, 'WARN_ON_DUPLICATE_TITLES')) {
        const dupSections = sections.filter(sec => sec.heading != null && sec.heading.text.length > 0 && sec.index != null);
        if(dupSections.length > 0) {
          const response = await app.alert(
            this.constants.messages.ERROR_DUPLICATE_SECTION_BODY.replace(
              '$1', 
              dupSections.reduce((text, sec, index) => `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${sec.index}`, '')
            ),
            {
              preface: this.constants.messages.ERROR_DUPLICATE_SECTION_TITLE,
              primaryAction: { label: "ABORT", icon: "back_hand" },
              actions: [{ icon: "arrow_forward", label: "PROCEED", value: 'PROCEED' }],
            });
          if(response === -1) return;
        }
      }

      if(this._getSettingValue(app, 'WARN_ON_OFFENDING_SECTION_TITLES')) {
        const offendingSections = sections.filter(sec => 
          sec.heading != null
          && sec.heading.text.length > 0
          && this.constants._.INVALID_SECTION_TITLE_CHARS.find(ch => sec.heading.text.includes(ch))
        );
        if(offendingSections.length > 0) {
          const response = await app.alert(
            this.constants.messages.ERROR_OFFENDING_SECTION_BODY.replace(
              '$1', 
              offendingSections.reduce((text, sec, index) => {
                const chars = this.constants._.INVALID_SECTION_TITLE_CHARS.filter(ch => sec.heading.text.includes(ch)).join(' ');
                return `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${chars} (${chars.length})`
              }, ''),
            ),
            {
              preface: this.constants.messages.ERROR_OFFENDING_SECTION_TITLE,
              primaryAction: { label: "ABORT", icon: "back_hand" },
              actions: [{ icon: "arrow_forward", label: "PROCEED", value: 'PROCEED' }],
            });
          if(response === -1) return;
        }
      }

      const title = this._getSettingValue(app, 'TITLE')
      const { section, content } = this._generateTOCFromSections(
        noteUUID,
        title,
        sections,
        this._getSettingValue(app, 'CONSIDER_HEADER_BREAKS'),
        this._getSettingValue(app, 'USE_BULLET_POINTS'),
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
      await this._exec(app, noteUUID, false);
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