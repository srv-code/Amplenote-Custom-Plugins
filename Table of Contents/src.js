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

      /** Prevents rewriting the TOC if the content is identical */
      PREVENT_IDENTICAL_REWRITE: {
        label: "Prevent Identical Rewrite (y/n | default: y)",
        defaultValue: 'y',
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
            + 'Total count: $1\n'
            + '$2\n',

      ERROR_OFFENDING_SECTION_TITLE: '❌ Error: Problematic Section Titles',
      ERROR_OFFENDING_SECTION_BODY: 'Below sections have problematic titles.\n' 
            + '(Hint: Fix them by eliminating the offending characters from their titles. ' 
            + 'Creating TOC now will result in broken linkage.)\n\n' 
            + 'Total count: $1\n'
            + '$2\n',

      ERROR_NO_SECTIONS_FOUND_TITLE: '❌ Error: No Sections Found',
      ERROR_NO_SECTIONS_FOUND_BODY: 'No sections found in the note.\nPlease ensure that the note has at least one section with a heading.',

      ERROR_INTERNAL_TITLE: '❌ Internal Error Occurred',
      ERROR_INTERNAL_BODY: 'Something unexpected happened:\n$1\n',

      ERROR_INVALID_MODE_BODY: 'Please select the NOTES section to run this plugin.',
      ERROR_INVALID_MODE_TITLE: '❌ Error: Invalid Mode',

      /** Operation success messages */
      OPERATION_SUCCESS_TITLE: '✅ Operation Successful',
      INSERTED_NEW_TOC_SECTION_BODY: 'Inserted new TOC section.',
      UPDATED_EXISTING_TOC_SECTION_BODY: 'Updated existing TOC section.',

      REWRITE_PREVENTION_TITLE: 'Rewrite Prevention',
      REWRITE_PREVENTION_BODY: 'TOC content is already up-to-date. No changes made.',
    },
    _: {
      /** Offending characters are for constructing section titles. */
      INVALID_SECTION_TITLE_CHARS: ['/'],

      /** Quote prefix for the TOC section. */
      TOC_PREFIX: '> .  ',

      /** These characters are used in unordered bullet points. */
      BULLET_H1_CHAR: '•',
      BULLET_H2_CHAR: '‣',
      BULLET_H3_CHAR: '◦',

      /** Text color for the last update message */
      LAST_UPDATE_COLOR: '#777879',
      LAST_UPDATE_COLOR_CYCLE: "44",

      /** Tab character for indentation */
      TAB: '    ',

      /** Regular expression for validating UUIDs */
      UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,


      /** List of invalid modes in the app i.e. the non-notes sections */
      INVALID_MODES: [ "calendar", "tasks", "jots" ],

      /** Base URL prefix for constructing section links */
      BASE_URL_PREFIX: 'https://www.amplenote.com/notes',
    },
  },

  validateSettings(app, settings) {
    console.groupCollapsed('validateSettings', { settings });
    const booleanRegex = /y|n/gi;
    const errors = [];
    const exceptionList = [];

    const {
      settings: { TITLE },
      _: { INVALID_SECTION_TITLE_CHARS },
      messages: {
        ERROR_INVALID_TITLE_SETTING_VALUE,
        ERROR_INVALID_BOOLEAN_SETTING,
      },
    } = this.constants;

    for(const [name, value] of Object.entries(settings)) {
      if(exceptionList.includes(name)) continue;

      const setting = Object.values(this.constants.settings).find(stg => stg.label === name);
      if(!setting.label) throw Error(`Setting name mismatched: ${setting.label}`);

      if(value?.length > 0) {
        if(setting.type === 'string') {
          if(name === TITLE.label 
            && !!INVALID_SECTION_TITLE_CHARS.find(ch => value.includes(ch))
          ) {
            errors.push(
              ERROR_INVALID_TITLE_SETTING_VALUE
                .replace('$1', name)
                .replace('$2', INVALID_SECTION_TITLE_CHARS.join(' '))
            );
          }
        } else if(setting.type === 'boolean') {
          if(!booleanRegex.test(value.trim())) {
            errors.push(ERROR_INVALID_BOOLEAN_SETTING.replace('$1', name));
          }
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

    const {
      BULLET_H1_CHAR,
      BULLET_H2_CHAR,
      BULLET_H3_CHAR,
    } = this.constants._;

    if(level === 1) {
      if(unordered) return BULLET_H1_CHAR;
      if(index[level] === null) index[level] = '1';
      else index[level] = `${parseInt(index[level].trim()) + 1}`;
      index[level] = index[level].padStart(2);

      index[2] = null;
      index[3] = null;
    } else if(level === 2) {
      if(unordered) return BULLET_H2_CHAR;
      if(index[level] === null) index[level] = 'a';
      else index[level] = this._nextAlphabet(index[level].trim());
      index[level] = index[level].padStart(2);

      index[3] = null;
    } else if(level === 3) {
      if(unordered) return BULLET_H3_CHAR;
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

    const { 
      LAST_UPDATE_COLOR,
      LAST_UPDATE_COLOR_CYCLE,
    } = this.constants._;

    return `*<mark style="color:${LAST_UPDATE_COLOR};">Last updated: ${datetime}<!-- {"cycleColor": "${LAST_UPDATE_COLOR_CYCLE}"} --></mark>*\n`;
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
    
    const tocLines = [];
    const indexes = { 1: null, 2: null, 3: null };
    let sectionIndex = 0;
    let section = null;
    
    const { TAB, TOC_PREFIX, INVALID_SECTION_TITLE_CHARS } = this.constants._;
    
    if(!hideLastUpdateMessage) {
      tocLines.push(this._getLastUpdateMessage(new Date()));
    }
    
    for(const { heading, index } of sections) {
      const isTOC = insertOnly ? false : this._isTOCHeader(heading, title);
      if(!!heading && !!heading.text.trim() && (!isTOC || (isTOC && !!section))) {
        const headingLevel = 
          considerHeaderBreaks 
            ? (sectionIndex > 0 && sections[sectionIndex-1].heading === null ? 1 : heading.level) 
            : heading.level;
        let line = 
          TOC_PREFIX
          + TAB.repeat(headingLevel-1) 
          + `${this._getNextIndex(indexes, headingLevel, unordered)}  [${heading.text.trim()}]`;

        if(INVALID_SECTION_TITLE_CHARS.find(ch => heading.anchor.includes(ch))) {
          line += `(#${heading.anchor})`;
        } else {
          line += `(https://www.amplenote.com/notes/${noteUUID}#${heading.anchor})`;
        }
        line += '\n>\n';
        
        tocLines.push(line);
        console.info('  >> line:: %O (H%d)', line, heading.level);
      }
      
      if(!section && isTOC) {
        section = { heading, index };
        console.info('  >> found section::', section);
      }
      sectionIndex++;
    }

    const retval = { section, tocLines };
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

    const { ERROR_INTERNAL_BODY, ERROR_INTERNAL_TITLE } = this.constants.messages;

    let message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Error Message: %O\n%O", message, error?.stack ?? error);
    message = ERROR_INTERNAL_BODY.replace('$1', message);
    
    const response = await app.alert(message, {
      preface: ERROR_INTERNAL_TITLE, 
      primaryAction: { label: "ABORT", icon: "back_hand" },
      actions: [{ icon: "content_copy", label: "COPY", value: "COPY" }],
    });
    console.log('Alert response for error:', response === -1 ? 'ABORT' : response);

    if(response === "COPY") 
      await app.writeClipboardData(
        this._stringifyAlertMessage(ERROR_INTERNAL_TITLE, message),
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
      PREVENT_IDENTICAL_REWRITE: this._getSettingValue(app, 'PREVENT_IDENTICAL_REWRITE'),
    });
    console.groupEnd();
  },

  _getTOCSection(title, content) {
    return `### ${title}\n${content}---\n\n`;
  },

  _stringifyAlertMessage(title, message) {
    return `=== ${title} ===\n\n${message}\n`;
  },

  _getParentSection(sections, section) {
    const index = sections.indexOf(section);
    for(let i=index-1; i>=0; i--) {
      if(sections[i].heading?.text.length > 0) {
          return sections[i];
      }
    }
    return null;
  },

  _matchTOCLines(existingLines, extractedLines) {
    console.groupCollapsed('_matchTOCLines', { existingLines, extractedLines });

    const hasTimestampLine = existingLines[0]?.startsWith('*<mark');
    console.log('hasTimestampLine', hasTimestampLine);

    /** Check if the line counts differ. Handles any missing updated timestamp line. */
    const lineCountDiff = Math.abs(existingLines.length - extractedLines.length);
    if(hasTimestampLine ?  lineCountDiff > 1 : lineCountDiff > 0) {
      console.log('Line counts differ, returning false', { lineCountDiff });
      console.groupEnd();
      return false;
    }

    const { TOC_PREFIX } = this.constants._;

    for(let i = hasTimestampLine ? 1 : 0, j = 0; i < existingLines.length; i++, j++) {
      let line1 = existingLines[i];
      let line2 = extractedLines[j];
      console.log('Inspecting lines', { line1, line2 });
      
      if(line1 && line2 && line1.startsWith(TOC_PREFIX) && line2.startsWith(TOC_PREFIX)) {
        line1 = line1.replace(/\n>\n$/, '').trim();
        line2 = line2.trim();
        console.log('Inspecting lines 2', { line1, line2 });

        if(line1 !== line2) {
          console.log('Diff found, returning false');
          console.groupEnd();
          return false;
        }
      }
    }

    console.log('No diff found, returning true');
    console.groupEnd();
    return true;
  },

  _extractTOCContent(title, content) {
    console.groupCollapsed('_extractTOCContent', { title, content });

    const lines = content.split('\n');
    const { TOC_PREFIX } = this.constants._;

    const startIndex = lines.findIndex(
      (line) => line.trim() === `### ${title}`
    );
    console.log('TOC header index', startIndex);

    if (startIndex === -1) {
      console.log('TOC header not found');
      console.groupEnd();
      return null;
    }

    const result = [];

    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      console.log('Inspecting line', { line });

      if (trimmed === '---') {
        console.log('Horizontal rule found', trimmed);
        break;
      }
      
      if (trimmed.startsWith(TOC_PREFIX)) {
        console.log('TOC line found');
        result.push(line);
      }
    }

    console.log('TOC lines returning', result);
    console.groupEnd();
    return result;
  },

  /**
   * Central execution function of this plugin
   * */
  async _exec(app, noteUUID, insertOnly = false, showAlertOnSuccess = false) {
    try {
      console.groupCollapsed('_exec', { noteUUID, insertOnly, showAlertOnSuccess });

      const {
        _: {
          INVALID_MODES,
          UUID_REGEX,
          INVALID_SECTION_TITLE_CHARS,
        },
        messages: {
          ERROR_INVALID_MODE_BODY,
          ERROR_INVALID_MODE_TITLE,
          ERROR_NO_SECTIONS_FOUND_BODY,
          ERROR_NO_SECTIONS_FOUND_TITLE,
          ERROR_DUPLICATE_SECTION_BODY,
          ERROR_DUPLICATE_SECTION_TITLE,
          ERROR_OFFENDING_SECTION_BODY,
          ERROR_OFFENDING_SECTION_TITLE,
          UPDATED_EXISTING_TOC_SECTION_BODY,
          OPERATION_SUCCESS_TITLE,
          INSERTED_NEW_TOC_SECTION_BODY,
          REWRITE_PREVENTION_TITLE,
          REWRITE_PREVENTION_BODY,
        },
      } = this.constants;

      if(!app) throw Error('Invalid app object specified');
      if(INVALID_MODES.includes(noteUUID)) {
        await app.alert(ERROR_INVALID_MODE_BODY, {
          preface: ERROR_INVALID_MODE_TITLE,
          primaryAction: { label: "ABORT", icon: "back_hand" },
        });
        return;
      }
      if(!UUID_REGEX.test(noteUUID)) throw Error(`Invalid noteUUID specified: ${noteUUID}`);

      this.__diag__checkSettingsParsing(app);
      const sections = await app.getNoteSections({ uuid: noteUUID });
      console.log('Sections', sections);

      if(sections.length === 0 || sections.every(sec => sec.heading === null || sec.heading.text.trim().length === 0)) {
        console.log('No sections found');
        await app.alert(ERROR_NO_SECTIONS_FOUND_BODY, {
          preface: ERROR_NO_SECTIONS_FOUND_TITLE,
          primaryAction: { label: "ABORT", icon: "back_hand" },
        });
        return;
      }

      if(this._getSettingValue(app, 'WARN_ON_DUPLICATE_TITLES')) {
        const dupSections = sections.filter(sec => 
          sec.heading != null 
          && sec.heading.text.length > 0 
          && sec.index != null
        );

        if(dupSections.length > 0) {
          console.log('Duplicate Sections', dupSections);
          
          let headers = '';
          let serialNo = 1;
          for(const index in dupSections) {
            const section = dupSections[index];

            let parent = this._getParentSection(sections, section); 
            if(parent?.heading) parent = `'${parent.heading.text}' (H${parent.heading.level})\n`;
            else parent = 'None';

            headers += 
              `\n~ ${serialNo++} ~\n` + 
              `  HEADER:  '${section.heading.text}' (H${section.heading.level})\n` + 
              `  INSTANCE #:  ${section.index}\n` + 
              `  PARENT HEADER:  ${parent}`;
          }

          const message =  ERROR_DUPLICATE_SECTION_BODY
              .replace('$1', dupSections.length)
              .replace('$2', headers)
              .trim();

          const response = await app.alert(message, {
              preface: ERROR_DUPLICATE_SECTION_TITLE,
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
              this._stringifyAlertMessage(ERROR_DUPLICATE_SECTION_TITLE, message),
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
          && INVALID_SECTION_TITLE_CHARS.find(ch => sec.heading.text.includes(ch))
        );

        if(offendingSections.length > 0) {
          console.log('Offending Sections', offendingSections);

          let headers = '';
          let serialNo = 1;
          for(const index in offendingSections) {
            const section = offendingSections[index];

            let parent = this._getParentSection(sections, section); 
            if(parent?.heading) parent = `'${parent.heading.text}' (H${parent.heading.level})\n`;
            else parent = 'None';

            const chars = INVALID_SECTION_TITLE_CHARS
                .filter(ch => section.heading.text.includes(ch))
                .join(' ');

            headers += 
              `\n~ ${serialNo++} ~\n` + 
              `  HEADER:  '${section.heading.text}' (H${section.heading.level})\n` + 
              `  INVALID CHARACTERS:  ${chars} (${chars.length} nos.)\n` + 
              `  PARENT HEADER:  ${parent}`;
          }

          const message = ERROR_OFFENDING_SECTION_BODY
              .replace('$1', offendingSections.length)
              .replace('$2', headers)
              .trim();

          const response = await app.alert(message, {
              preface: ERROR_OFFENDING_SECTION_TITLE,
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
              this._stringifyAlertMessage(ERROR_OFFENDING_SECTION_TITLE, message),
              "text/plain",
            );
            return;
          }
        }
      }

      const title = this._getSettingValue(app, 'TITLE')
      const { section, tocLines } = this._generateTOCFromSections(
        noteUUID,
        title,
        sections,
        this._getSettingValue(app, 'CONSIDER_HEADER_BREAKS'),
        this._getSettingValue(app, 'USE_BULLET_POINTS'),
        this._getSettingValue(app, 'HIDE_LAST_UPDATE_MESSAGE'),
        insertOnly,
      );

      let result = null;
      if(insertOnly) {
        console.log('Inserting directly at cursor position...');
        result = await app.context.replaceSelection(this._getTOCSection(title, tocLines.join('')));
        console.log('OK', { result });
      } else {
        if(section) {
          const preventIdenticalRewrite = this._getSettingValue(app, 'PREVENT_IDENTICAL_REWRITE');
          let requireUpdate = true;

          if(preventIdenticalRewrite) {
            const noteContent = await app.getNoteContent({ uuid: noteUUID });
            const extractedTOCLines = this._extractTOCContent(title, noteContent);
  
            if(extractedTOCLines === null) {
              console.error('Unexpected Error: TOC section not found in the note content, even though it was detected in the sections.', {
                noteContent,
                extractedTOCLines,
                tocLines,
              });
            } else if(this._matchTOCLines(tocLines, extractedTOCLines)) {
              console.log('Older TOC matched newer TOC.');
              requireUpdate = false;
  
              const response = await app.alert(REWRITE_PREVENTION_BODY, {
                preface: REWRITE_PREVENTION_TITLE, 
                primaryAction: { label: "ABORT", icon: "back_hand" },
                actions: [{ icon: "edit", label: "FORCE UPDATE", value: "FORCED" }],
              });
              
              console.log('Alert response for force update:', response === -1 ? 'ABORT' : response);
              if(response === "FORCED") requireUpdate = true;
            }
          }

          if(requireUpdate) {
            console.log('Updating existing section...');
            result = await app.replaceNoteContent({ uuid: noteUUID }, tocLines.join(''), { section });
            if(showAlertOnSuccess) {
              await app.alert(UPDATED_EXISTING_TOC_SECTION_BODY, {
                preface: OPERATION_SUCCESS_TITLE, 
              });
            }
          }
        } else {
          console.log('Inserting new section...');
          result = await app.insertNoteContent({ uuid: noteUUID }, this._getTOCSection(title, tocLines.join('')));
          if(showAlertOnSuccess) {
            await app.alert(INSERTED_NEW_TOC_SECTION_BODY, {
              preface: OPERATION_SUCCESS_TITLE, 
            });
          }
        }
      }

      console.log('OK', { result });
    } catch (error) {
      this._handleError(app, error);
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Checks if the current URL is in the Notes section of the app.
   */
  _checkIfInNotesSection(url) {
    console.log('TOC::_checkIfInNotesSection | url: %s', url);
    
    const { BASE_URL_PREFIX, INVALID_MODES } = this.constants._;
    const invalidMode = INVALID_MODES.find(mode => url.startsWith(`${BASE_URL_PREFIX}/${mode}`));
    console.log('TOC::_checkIfInNotesSection | invalidMode: %s', invalidMode);

    return !invalidMode;
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
    check(app) {
      return this._checkIfInNotesSection(app.context.url);
    },
    
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
    check(app) {
      return this._checkIfInNotesSection(app.context.url);
    },

    async run(app) {
      const noteUUID = app.context.url?.split?.("/notes/")?.[1]?.split?.("?")?.[0];
      console.groupCollapsed('TOC plugin | running from `appOption`', { noteUUID, url: app.context.url });
      await this._exec(app, noteUUID, false, true);
      console.groupEnd();
    },
  },

  /**
   * This implementation doesn't check for any existing TOC headers.
   * Rather, it generates and directly inserts the TOC at the cursor position. 
   * */
  insertText: {
   check(app) {
      return this._checkIfInNotesSection(app.context.url);
    },

    async run(app) {
      const { noteUUID } = app.context;
      console.groupCollapsed('TOC plugin | running from `insertText`', { noteUUID });
      await this._exec(app, noteUUID, true);
      console.groupEnd();
    },
  },
}