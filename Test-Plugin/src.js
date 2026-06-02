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
  },

  validateSettings(app, settings) {
    const booleanValues = ['y', 'n'];
    const errors = [];
    const exceptionList = [
      this.constants.settings.MESSAGE,
    ];
    for(const [name, value] of Object.entries(settings)) {
      if(exceptionList.includes(name)) continue;
      if(!booleanValues.includes(value))
        errors.push(this.constants.messages.INVALID_SETTING_ERROR.replace('$1', name));
    }
    if(errors.length === 0) return false;
    return errors;
  },

  _isRunningOnDesktop() {
    return !window?.navigator?.userAgentData?.mobile;
  },

  // appOption: {
  //   "Open": async function(app) {
  //     app.alert('Invoked!');
  //     // await app.openEmbed();
  //     // await app.navigate(
  //     //   "https://www.amplenote.com/notes/plugins/" + app.context.pluginUUID
  //     // );
  //   },
  // },
  
  // noteOption: {
  //   check(app) {
  //     // const val = app.settings[settingName];
  //     // return boolean value corresponding to the activation of the plugin
  //     return false;
  //   },
  //   async run(app, noteUUID) {
  //     // Do action and return null
  //     console.log(`Ran primary action on note with UUID: ${noteUUID}`);
  //     // app.alert('Plugin ran');
  //     // return null;
  //     // return `Primary action says ${app.context.noteUUID}`;
  //     return false;
  //   },
  // },

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