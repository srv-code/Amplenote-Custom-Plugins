// JavaScript
{
  constants: {
    settings: {
      MESSAGE: 'Message (string)',
      ENABLE: 'Enable? (y/n)',
      EXPERIMENTS: 'Enable experimental features? (y/n)',
    },
    messages: {
      INVALID_SETTING_ERROR: 'Invalid value provided for "$1". Please enter \'y\' or \'n\'.',
      ERROR_INVALID_SETTING_VALUE: 'Invalid setting value. Please enter y or n',
    },
    _: {
      TAG_EXTRACTION_LIMIT: 5,
    },
  },

  validateSettings(app, settings) {
    const booleanRegex = /y|n/gi;
    const errors = [];
    const exceptionList = [
      this.constants.settings.MESSAGE,
    ];
    for(const [name, value] of Object.entries(settings)) {
      if(exceptionList.includes(name)) continue;
      if(!booleanRegex.test(value.trim()))
        errors.push(this.constants.messages.INVALID_SETTING_ERROR.replace('$1', name));
    }
    if(errors.length === 0) return false;
    return errors;
  },

  _isRunningOnDesktop() {
    return !window?.navigator?.userAgentData?.mobile;
  },

  _getTagsAsText(tags = []) {
    if(tags.length === 0) return 'None';
    return tags.map((tag, index) => `\n  [${index+1}]  ${tag.text}: ${tag.noteCount}`).join('');
  },

  appOption: {
    "New TOC": {
      check(app) {
        return false;
      },

      async run(app, noteUUID) {
        console.clear();
        const uuid = app.context.url.match(/[0-9a-f]*-[0-9a-f]*-[0-9a-f]*-[0-9a-f]*-[0-9a-f]*/)[0];

        // const uuid = app.context.url.replace('https://www.amplenote.com/notes/', '');
        console.log('noteUUID', uuid);
        const note = await app.notes.find(uuid);
        console.log('Note found:', note.name);
        const content = await app.getNoteContent({ uuid });
        console.log('Note content:', {content});
        const sections = await app.getNoteSections({ uuid });
        console.log('Note sections:', sections);

        const TOC = '**TABLE OF CONTENTS**\n\nbla bla bla...\n\n---\n\n\n\n'
        let replaceSection = null; 
        for(const i in sections) {
          if(sections[i].heading == null) replaceSection = sections[i];
          else break;
        }
        // for(const i in sections) {
        //   if(sections[i].heading != null) {
        //     replaceSection = sections[i]; break;
        //   }
        // }
        
        if(replaceSection == null) {
          console.log('Need to insert in the beginning of the note');
          // await app.insertNoteContent({ uuid }, TOC + "---\n\n");
        } else {
          console.log('Replacing the last non-empty section', replaceSection);
          // const success = await app.replaceNoteContent({ uuid }, TOC, { section: replaceSection });
          // console.log('Success:', success);
        }
        console.log('Done');
        


        
        // console.log('Note info:', {
        //   pluginUUID: app.context.pluginUUID, 
        //   'keys of app.context': Object.keys(app.context), 
        //   'keys of app': Object.keys(app), 
        //   url: app.context.url,
            // uuid: app.context.noteUUID,
        // });
        // https://www.amplenote.com/notes/6d863896-6193-11f1-b7d2-51718954e1d8

        // const sections = await app.getNoteSections({ uuid: app.context.noteUUID });
        // console.log('Note sections:', sections);
        // app.alert('Invoked');
      }
    },
    "Tag Stats": async function(app) {
      /* 
        Functions:
          - show all 
          - find the top and least n tags with counts 
      */
      const _tags = await app.getTags();
      const tagStats = {
        COUNTS: {
          length: _tags.length,
          populated: null,
          least: null,
        },
        ALL: {},
      };
      for(const tag of _tags) tagStats.ALL[tag.text] = {...tag};

      const LIMIT = this.constants._.TAG_EXTRACTION_LIMIT;
      const sortedTags = _tags.toSorted((a, b) => b.noteCount - a.noteCount);
      tagStats.COUNTS.populated = sortedTags.filter(tag => tag.noteCount > 0).slice(0, LIMIT);
      tagStats.COUNTS.least = sortedTags.filter(tag => tag.noteCount > 0).slice(-LIMIT);

      if(this._isRunningOnDesktop()) console.log('Tag Statistics', tagStats, { _tags });

      let message = `Total count: ${tagStats.COUNTS.length}\n\n`;
      message += `Top ${LIMIT} most poplulated: ${this._getTagsAsText(tagStats.COUNTS.populated)}\n\n`;
      message += `Top ${LIMIT} least poplulated: ${this._getTagsAsText(tagStats.COUNTS.least)}\n\n`;
      if(this._isRunningOnDesktop()) message += '(See console log for more details)';

      app.alert(message, { preface: 'TAG STATISTICS' });
    },
  },

  _isTOCHeader(heading, TOC_HEADING_TEXT) {
    return heading?.level === 3 && heading?.text === TOC_HEADING_TEXT;
  },

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

  _nextRoman(roman) {
    return this._toRoman(this._fromRoman(roman) + 1);
  },

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
    console.log('_getNextIndex', {index, level});
    
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

  _generateTOCFromSections(noteUUID, sections, INVALID_SECTION_TITLE_CHARS, TOC_HEADING_TEXT, CONSIDER_HEADER_BREAKS) {
    let content = '';
    // const index = {1: 1, 2: 'a', 3: 'i'};
    const indexes = { 1: null, 2: null, 3: null };
    let sectionIndex = 0;
    let section = null;
    let replaceEntireContent = false;

    for(const { heading, index } of sections) {
      console.log('_generateTOCFromSections:: inspecting heading', {
        heading, 
        'consider?': !!heading && !!heading.text.trim() && !this._isTOCHeader(heading, TOC_HEADING_TEXT)
      });
      const isTOC = this._isTOCHeader(heading, TOC_HEADING_TEXT);
      if(!!heading && !!heading.text.trim() && (!isTOC || (isTOC && !!section))) {
        const headingLevel = CONSIDER_HEADER_BREAKS ? (sectionIndex > 0 && sections[sectionIndex-1].heading === null ? 1 : heading.level) : heading.level;
        content += '>.  ' + '    '.repeat(headingLevel-1) + `${this._getNextIndex(indexes, headingLevel)}.  [${heading.text.trim()}]`;
        if(INVALID_SECTION_TITLE_CHARS.find(ch => heading.anchor.includes(ch))) content += `(#${heading.anchor})`;
        else content += `(https://www.amplenote.com/notes/${noteUUID}#${heading.anchor})`;
        content += '\n>\n';
        console.log('_generateTOCFromSections:: building content', content);
      }
      if(!section && isTOC) section = { heading, index };
      sectionIndex++;
    }
    // if(content) content += '---\n';
    console.log(`_generateTOCFromSections:: FINAL: section: %O, content:\n%O`, section, content);
    return { content, section };
  },
  
  noteOption: {
    'Alert': {
      check(app) {
        return true;
      },
      async run(app, noteUUID) {
        const response = await app.alert('Message', {
          preface: 'Error: Duplicate Section Titles',
          primaryAction: { icon: "back_hand", label: "ABORT", value: "ABORT" },
          actions: [
            { icon: "arrow_forward", label: "PROCEED", value: "PROCEED" },
            { icon: "content_copy", label: "COPY", value: "COPY" },
          ],
        });
        console.log('alert response', response);
      },
    },

    'New TOC': {
      check(app) {
        // const val = app.settings[settingName];
        // return boolean value corresponding to the activation of the plugin
        return false;
      },
      async run(app, noteUUID) {
        // Settings 
        /** Resets the indentation of any level of heading if immediately following a break (e.g. horizontal line). */
        const CONSIDER_HEADER_BREAKS = true; 

        /** Show a warning when duplicate titles are found and abort the operation. */
        const ABORT_ON_DUPLICATE_TITLES = true;

        /** Show a warning when invalid characters are found which might break the section linking and abort the operation. */
        const ABORT_ON_OFFENDING_SECTION_TITLES = true;

        /** Offending characters are for constructing section titles. */
        const INVALID_SECTION_TITLE_CHARS = ['/'];


        const sections = await app.getNoteSections({ uuid: noteUUID });
        console.log('>> 1', {sections});

        if(ABORT_ON_DUPLICATE_TITLES) {
          const dupSections = sections.filter(sec => sec.index != null);
          console.log('>> 2', {dupSections});
          if(dupSections.length > 0) {
            app.alert('Below sections have duplicate titles.\n' 
              + '(Hint: Fix them either by changing to a different title or pad them using spaces. Creating TOC now will result in ambiguous linkage.)\n' 
              + 'Current operation is ABORTED!\n\n'
              + '-- Section Title,  Header Level,  Instance Count --\n' 
              + dupSections.reduce((text, sec, index) => `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${sec.index}`, ''),
              { preface: 'Error: Duplicate Section Titles' });
            return;
          }
        }

        if(ABORT_ON_OFFENDING_SECTION_TITLES) {
          const offendingSections = sections.filter(sec => INVALID_SECTION_TITLE_CHARS.find(ch => sec.heading?.text?.includes(ch)));
          console.log('>> 3', {offendingSections});
          if(offendingSections.length > 0) {
            app.alert('Below sections have problematic titles.\n' 
              + '(Hint: Fix them by eliminating the offending characters from their titles. Creating TOC now will result in broken linkage.)\n' 
              + 'Current operation is ABORTED!\n\n'
              + '-- Section Title,  Header Level, Offending Character(s) and Count --\n' 
              + offendingSections.reduce((text, sec, index) => {
                const chars = INVALID_SECTION_TITLE_CHARS.filter(ch => sec.heading.text.includes(ch)).join(' ');
                return `${text}\n${index+1}.  '${sec.heading.text}',  H${sec.heading.level},  ${chars} (${chars.length})`
              }, ''),
              { preface: 'Error: Problematic Section Titles' });
            return;
          }
        }

        const TOC_HEADING_TEXT = 'TABLE OF CONTENTS';
        const { content, section } = this._generateTOCFromSections(
          noteUUID, 
          sections, 
          INVALID_SECTION_TITLE_CHARS,
          TOC_HEADING_TEXT, 
          CONSIDER_HEADER_BREAKS, 
        ); // '- abc\n- def';

        // let sectionToReplace;
        // for(const section of sections) {
        //   console.log('Inspecing section', section);
        //   // if(section.heading?.level === 3 && section.heading?.text === TOC_HEADING_TEXT) {
        //   if(this._isTOCHeader(section.heading, TOC_HEADING_TEXT)) {
        //     sectionToReplace = section;
        //     break;
        //   }
        // } 

        if(section) {
          const success = await app.replaceNoteContent({ uuid: noteUUID }, content, { section });
          console.log('Replaced existing TOC', {success});
          // if(!success) throw Error("Updating TOC Failed!");
        } else {
          const noteContent = await app.getNoteContent({ uuid: noteUUID });
          await app.insertNoteContent({ uuid: noteUUID }, `### ${TOC_HEADING_TEXT}\n${content}---\n\n`);
          console.log('Added TOC at beg');
        } 

        // const newContent = "**new content**";
        // anchor: 'Main_Heading', href: null, level: 1, text: 'Main Heading'
        // const section = {};
        // const success = await app.replaceNoteContent({ uuid: noteUUID }, newContent);
        // console.log('replaceNoteContent success', success);
        // return false;
      },
    },
  },

  insertText: {
    'plugin-settings': {
      check() {
        return this._isRunningOnDesktop();
      },
      
      run(app) {
        console.log('Plugin settings:', {
          pluginUUID: app.context.pluginUUID, 
          noteUUID: app.context.noteUUID, 
          settings: app.settings,
        });
        return 'ok';
      },
    },

    'note-sections': {
      check() {
        return this._isRunningOnDesktop();
      },
      
      async run(app) {
        const sections = await app.getNoteSections({ uuid: app.context.noteUUID });
        console.log('Note sections:', sections);
        return 'ok';
      }
    },

    'note-content': {
      check() {
        return this._isRunningOnDesktop();
      },
      
      async run(app) {
        const content = await app.getNoteContent({ uuid: app.context.noteUUID });
        console.log('Note content:', app.context.noteUUID, content);
        return 'ok';
      }
    },

    'user-agent': {
      async run(app) {
        let agent = null;
        if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
          agent = {
            type: 'Browser', 
            platform: window.navigator.userAgentData?.platform,
            highEntropyValues: await window.navigator.userAgentData?.getHighEntropyValues(["architecture", "model", "platformVersion"]),
            mobile: window.navigator.userAgentData?.mobile,
          };
        } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
          agent = 'Node.js';
        } else {
          agent = 'Unknown Environment';
        }

        console.log('User Agent Info:', agent);
        if(!this._isRunningOnDesktop()) 
          app.alert(JSON.stringify(agent, null, 2), { preface: 'User Agent Info' });

        return 'ok';
      },
    },

    'note-info': {
      check() {
        return this._isRunningOnDesktop();
      },
      
      async run(app) {
        const note = await app.notes.find(app.context.noteUUID);
        const clonedNote = {};
        const whiteListedFunctions = [
          'backlinks', 'images', 'openCounts', 
          'publicURL', 'settings', 'tasks', 'url',
        ];
        for(const key of Object.keys(note)) {
          if(typeof note[key] === 'function') {
            if(whiteListedFunctions.includes(key))
              clonedNote[key] = await note[key]();
          } else clonedNote[key] = note[key];
        }

        console.log('Note info:', clonedNote, {
          _note: note,
        });
        return 'ok';
      },
    },
  },
}