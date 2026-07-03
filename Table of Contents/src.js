// JavaScript 
{
  constants: {
    settings: {
      /** Title which should be displayed as the TOC section header. 
       * This is the anchoring header title, where future TOC updates will be made. 
       * Keep this unique to avoid ambiguity with other section titles. */
      TITLE: {
        label: "Title (string | default: TABLE OF CONTENTS)",
        defaultValue: 'TABLE OF CONTENTS',
        type: 'string',
      },
      
      /** Resets the indentation of any level of heading if immediately following 
       * a break (e.g. horizontal line). */
      CONSIDER_HEADER_BREAKS: {
        label: "Consider Header Breaks (y/n | default: y)",
        defaultValue: 'y',
        type: 'boolean',
      },

      /** Show a warning when duplicate titles are found and presented with two options, 
       * abort and proceed the operation. */
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

      /** Hides the last updated message below the TOC section header */
      HIDE_LAST_UPDATE_MESSAGE: {
        label: "Hide Last Update Message (y/n | default: n)",
        defaultValue: 'n',
        type: 'boolean',
      },
    },
    messages: {
      ERROR_INVALID_TITLE_SETTING_VALUE: 'Invalid value provided for "$1". Please remove the following characters: $2',
      ERROR_INVALID_BOOLEAN_SETTING: 'Invalid value provided for "$1". Please enter \'y\' or \'n\'.',

      ERROR_DUPLICATE_SECTION_TITLE: '❌ Error: Duplicate Section Titles',
      ERROR_DUPLICATE_SECTION_BODY: 'Below sections have duplicate titles.\n' 
            + '(Hint: Fix them either by changing to a different title or pad them using spaces. '
            + 'Creating TOC now will result in ambiguous linkage.)\n\n' 
            + '-- Section Title,  Header Level,  Instance Count --\n' 
            + '$1\n',

      ERROR_OFFENDING_SECTION_TITLE: '❌ Error: Problematic Section Titles',
      ERROR_OFFENDING_SECTION_BODY: 'Below sections have problematic titles.\n' 
            + '(Hint: Fix them by eliminating the offending characters from their titles. ' 
            + 'Creating TOC now will result in broken linkage.)\n\n' 
            + '-- Section Title,  Header Level, Offending Character(s) and Count --\n'
            + '$1\n',

      ERROR_INTERNAL_TITLE: '❌ Internal Error Occurred',
      ERROR_INTERNAL_BODY: 'Something unexpected happened:\n$1\n',

      /** Operation success messages */
      OPERATION_SUCCESS_TITLE: '✅ Operation Successful',
      INSERTED_NEW_TOC_SECTION_BODY: 'Inserted new TOC section.',
      UPDATED_EXISTING_TOC_SECTION_BODY: 'Updated existing TOC section.',
    },
    _: {
      /** Offending characters are for constructing section titles. */
      INVALID_SECTION_TITLE_CHARS: ['/'],

      /** These characters are used in unordered bullet points. */
      BULLET_H1_CHAR: '•',
      BULLET_H2_CHAR: '‣',
      BULLET_H3_CHAR: '◦',

      /** Text color for the last update message */
      LAST_UPDATE_COLOR: '#777879',
      LAST_UPDATE_COLOR_CYCLE: "44",

      /** Tab character for indentation */
      TAB: '    ',
    },
  },

  validateSettings(app, settings) {
    console.groupCollapsed('validateSettings', { settings });
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
    
    console.log('Errors', errors);
    console.groupEnd();

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
    console.groupCollapsed('_getNextIndex', { index, level, unordered });

    if(level === 1) {
      if(unordered) return this.constants._.BULLET_H1_CHAR;
      if(index[level] === null) index[level] = '1';
      else index[level] = `${parseInt(index[level].trim()) + 1}`;
      index[level] = index[level].padStart(2);

      index[2] = null;
      index[3] = null;
    } else if(level === 2) {
      if(unordered) return this.constants._.BULLET_H2_CHAR;
      if(index[level] === null) index[level] = 'a';
      else index[level] = this._nextAlphabet(index[level].trim());
      index[level] = index[level].padStart(2);

      index[3] = null;
    } else if(level === 3) {
      if(unordered) return this.constants._.BULLET_H3_CHAR;
      if(index[level] === null) index[level] = 'i';
      else index[level] = this._nextRoman(index[level].trim());
      index[level] = index[level].padStart(6);
    } else throw Error(`Invalid level specified: ${level}.`);

    const retval = `${index[level]}.`;
    console.log('return', retval);
    console.groupEnd();
    return retval;
  },

  _getLastUpdateMessage(date) {
    const datetime = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

    return `*<mark style="color:${
        this.constants._.LAST_UPDATE_COLOR
      };">Last updated: ${
        datetime
      }<!-- {"cycleColor": "${
        this.constants._.LAST_UPDATE_COLOR_CYCLE
      }"} --></mark>*\n`;
  },

  _generateTOCFromSections(
    noteUUID, 
    title, 
    sections, 
    considerHeaderBreaks, 
    unordered, 
    hideLastUpdateMessage, 
    insertOnly = false,
  ) {
    console.groupCollapsed('_generateTOCFromSections', { 
      noteUUID, 
      title, 
      sections, 
      considerHeaderBreaks, 
      unordered, 
      hideLastUpdateMessage, 
      insertOnly 
    });
    
    let content = hideLastUpdateMessage ? '' : this._getLastUpdateMessage(new Date());
    const indexes = { 1: null, 2: null, 3: null };
    let sectionIndex = 0;
    let section = null;
    let replaceEntireContent = false;

    for(const { heading, index } of sections) {
      const isTOC = insertOnly ? false : this._isTOCHeader(heading, title);
      if(!!heading && !!heading.text.trim() && (!isTOC || (isTOC && !!section))) {
        const headingLevel = 
          considerHeaderBreaks 
            ? (sectionIndex > 0 && sections[sectionIndex-1].heading === null ? 1 : heading.level) 
            : heading.level;
        let line = 
          '>.  ' 
          + this.constants._.TAB.repeat(headingLevel-1) 
          + `${this._getNextIndex(indexes, headingLevel, unordered)}  [${heading.text.trim()}]`;

        if(this.constants._.INVALID_SECTION_TITLE_CHARS.find(ch => heading.anchor.includes(ch))) 
          line += `(#${heading.anchor})`;
        else 
          line += `(https://www.amplenote.com/notes/${noteUUID}#${heading.anchor})`;
        line += '\n>\n';
        
        content += line;
        console.info('  >> line:: %O (H%d)', line, heading.level);
      }
      
      if(!section && isTOC) {
        section = { heading, index };
        console.info('  >> found section::', section);
      }
      sectionIndex++;
    }

    const retval = { section, content };
    console.log('return', retval);
    console.groupEnd();
    return retval;
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

  async _handleError(app, error) {
    console.groupCollapsed('_handleError', { error });

    let message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Error Message: %O\n%O", message, error?.stack ?? error);
    message = this.constants.messages.ERROR_INTERNAL_BODY.replace('$1', message);
    
    const response = await app.alert(message, {
      preface: this.constants.messages.ERROR_INTERNAL_TITLE, 
      primaryAction: { label: "ABORT", icon: "back_hand" },
      actions: [{ icon: "content_copy", label: "COPY", value: "COPY" }],
    });
    console.log('Alert response for error:', response === -1 ? 'ABORT' : response);

    if(response === "COPY") 
      await app.writeClipboardData(
        this._stringifyAlertMessage(this.constants.messages.ERROR_INTERNAL_TITLE, message),
        "text/plain",
      );

    console.groupEnd();
  },

  __diag__checkSettingsParsing(app) {
    console.groupCollapsed('__diag__checkSettingsParsing');
    console.log('Settings', app.settings);
    console.log('Parsed', {
      TITLE: this._getSettingValue(app, 'TITLE'),
      CONSIDER_HEADER_BREAKS: this._getSettingValue(app, 'CONSIDER_HEADER_BREAKS'),
      WARN_ON_DUPLICATE_TITLES: this._getSettingValue(app, 'WARN_ON_DUPLICATE_TITLES'),
      WARN_ON_OFFENDING_SECTION_TITLES: this._getSettingValue(app, 'WARN_ON_OFFENDING_SECTION_TITLES'),
      USE_BULLET_POINTS: this._getSettingValue(app, 'USE_BULLET_POINTS'),
      HIDE_LAST_UPDATE_MESSAGE: this._getSettingValue(app, 'HIDE_LAST_UPDATE_MESSAGE'),
    });
    console.groupEnd();
  },

  _getTOCSection(title, content) {
    return `### ${title}\n${content}---\n\n`;
  },

  _stringifyAlertMessage(title, message) {
    return `=== ${title} ===\n\n${message}\n`;
  },

  /**
   * Central execution function of this plugin
   * */
  async _exec(app, noteUUID, insertOnly = false, showAlertOnSuccess = false) {
    try {
      console.groupCollapsed('_exec', { noteUUID, insertOnly, showAlertOnSuccess });

      this.__diag__checkSettingsParsing(app);
      const sections = await app.getNoteSections({ uuid: noteUUID });
      console.log('Sections', sections);

      if(this._getSettingValue(app, 'WARN_ON_DUPLICATE_TITLES')) {
        const dupSections = sections.filter(sec => 
          sec.heading != null 
          && sec.heading.text.length > 0 
          && sec.index != null
        );

        if(dupSections.length > 0) {
          console.log('Duplicate Sections', dupSections);
          const message = this.constants.messages.ERROR_DUPLICATE_SECTION_BODY.replace(
              '$1', 
              dupSections.reduce((text, sec, index) => 
                `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${sec.index}`, 
              ''),
            );
          const response = await app.alert(
            message,
            {
              preface: this.constants.messages.ERROR_DUPLICATE_SECTION_TITLE,
              primaryAction: { label: "ABORT", icon: "back_hand" },
              actions: [
                { icon: "arrow_forward", label: "PROCEED", value: "PROCEED" },
                { icon: "content_copy", label: "COPY & ABORT", value: "COPY" },
              ],
            });
          console.log('Alert response for duplicate sections:', response === -1 ? 'ABORT' : response);

          if(response === -1) return;
          else if(response === "COPY") {
            await app.writeClipboardData(
              this._stringifyAlertMessage(this.constants.messages.ERROR_DUPLICATE_SECTION_TITLE, message),
              "text/plain",
            );
            return;
          }
        }
      }

      if(this._getSettingValue(app, 'WARN_ON_OFFENDING_SECTION_TITLES')) {
        const offendingSections = sections.filter(sec => 
          sec.heading != null
          && sec.heading.text.length > 0
          && this.constants._.INVALID_SECTION_TITLE_CHARS.find(ch => sec.heading.text.includes(ch))
        );
        console.log('Offending Sections', offendingSections);
        if(offendingSections.length > 0) {
          const message = this.constants.messages.ERROR_OFFENDING_SECTION_BODY.replace(
              '$1', 
              offendingSections.reduce((text, sec, index) => {
                const chars = this.constants._.INVALID_SECTION_TITLE_CHARS.filter(ch => sec.heading.text.includes(ch)).join(' ');
                return `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${chars} (${chars.length})`
              }, ''),
            );
          const response = await app.alert(
            message,
            {
              preface: this.constants.messages.ERROR_OFFENDING_SECTION_TITLE,
              primaryAction: { label: "ABORT", icon: "back_hand" },
              actions: [
                { icon: "arrow_forward", label: "PROCEED", value: "PROCEED" },
                { icon: "content_copy", label: "COPY & ABORT", value: "COPY" },
              ],
            });
          console.log('Alert response for offending sections:', response === -1 ? 'ABORT' : response);
     
          if(response === -1) return;
          else if(response === "COPY") {
            await app.writeClipboardData(
              this._stringifyAlertMessage(this.constants.messages.ERROR_OFFENDING_SECTION_TITLE, message),
              "text/plain",
            );
            return;
          }
        }
      }

      const title = this._getSettingValue(app, 'TITLE')
      const { section, content } = this._generateTOCFromSections(
        noteUUID,
        title,
        sections,
        this._getSettingValue(app, 'CONSIDER_HEADER_BREAKS'),
        this._getSettingValue(app, 'USE_BULLET_POINTS'),
        this._getSettingValue(app, 'HIDE_LAST_UPDATE_MESSAGE'),
        insertOnly,
      );

      if(insertOnly) {
        console.log('Inserting directly at cursor position...');
        await app.context.replaceSelection(this._getTOCSection(title, content));
        console.log('OK');
        return;
      }

      if(section) {
        console.log('Updating existing section...');
        await app.replaceNoteContent({ uuid: noteUUID }, content, { section });
        if(showAlertOnSuccess) 
          await app.alert(this.constants.messages.UPDATED_EXISTING_TOC_SECTION_BODY, {
            preface: this.constants.messages.OPERATION_SUCCESS_TITLE, 
          });
      } else {
        console.log('Inserting new section...');
        await app.insertNoteContent({ uuid: noteUUID }, this._getTOCSection(title, content));
        if(showAlertOnSuccess)
          await app.alert(this.constants.messages.INSERTED_NEW_TOC_SECTION_BODY, {
            preface: this.constants.messages.OPERATION_SUCCESS_TITLE, 
          });
      }

      console.log('OK');
    } catch (error) {
      this._handleError(app, error);
    } finally {
      console.groupEnd();
    }
  },

  /****** EXECUTION POINTS ******/

  /**
   * This is the main trigger option of the plugin. 
   * It first checks for the presence of the TOC. 
   * If not present, it simply attaches at the top of the note content. 
   * If the TOC section is present (checks only for the first occurrence), 
   * it updates in the existing section inline. 
   * */
  noteOption: {
    async run(app, noteUUID) {
      console.groupCollapsed('TOC plugin | running from `noteOption`', { noteUUID });
      await this._exec(app, noteUUID);
      console.groupEnd();
    },
  },

  /**
   * Same as in `noteOption`. 
   * This is only useful when the note is too big and is scrolled in the 
   * middle and the note option ellipsis is not easily accessible. 
   * */
  appOption: {
    async run(app) {
      const noteUUID = app.context.url.substring(app.context.url.lastIndexOf('/') + 1);
      console.groupCollapsed('TOC plugin | running from `appOption`', { noteUUID });
      await this._exec(app, noteUUID, false, true);
      console.groupEnd();
    },
  },

  /**
   * This implementation doesn't check for any existing TOC headers.
   * Rather, it generates and directly inserts the TOC at the cursor position. 
   * */
  insertText: {
    async run(app) {
      const { noteUUID } = app.context;
      console.groupCollapsed('TOC plugin | running from `insertText`', { noteUUID });
      await this._exec(app, noteUUID, true);
      console.groupEnd();
    },
  },
}