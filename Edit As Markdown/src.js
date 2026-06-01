// JavaScript
({
  constants: {
    settings: {
      ENABLED_EXPERIMENTS: 'Enable experimental features? (y/n | default: n)',
      ONLY_ALLOW_EXPERIMENTS_ON_TEST_NOTES: 'Only allow experimental features on notes tagged with `*/test/*`? (y/n | default: y)',
    },
    messages: {
      UNHANDLED_ERROR: 'Something went wrong!\nPlease refer the console logs for the technical details and inform the developer.',
      EDIT_NOTE_MARKDOWN: 'Edit note as Markdown:',
      ENTER_INSERTION_MARKDOWN: 'Enter markdown content to insert:',
      ENTER_REPLACEMENT_MARKDOWN: 'Edit markdown content to replace with:',
      VIEWING_NOTE_MARKDOWN: 'Viewing note ($1 characters)',
      VIEWING_SELECTION_MARKDOWN: 'Viewing selection ($1 characters)'
    },
    _: {
      TEST_TAG_NAME: 'test',
    }
  },

  _handleError(app, error) {
    const message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Plugin Error: %O\n%O", message, error?.stack ?? error);
    app.alert(this.constants.messages.UNHANDLED_ERROR);
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

  async _enableExperiments(app) {
    const experimentsEnabled = this._getSettingValue(app, this.constants.settings.ENABLED_EXPERIMENTS, "boolean")
    if(!experimentsEnabled) return false;
    
    const onlyOnTestNotes = this._getSettingValue(app, this.constants.settings.ONLY_ALLOW_EXPERIMENTS_ON_TEST_NOTES, "boolean", true)
    const note = await app.notes?.find(app.context?.noteUUID);
    const hasTestTag = note?.tags?.some(tag => tag.split('/').includes(this.constants._.TEST_TAG_NAME));

    if(onlyOnTestNotes) return hasTestTag;
    return true;
  },

  noteOption: {
    // EXPERIMENTAL FEATURE //
    Edit: {
      async check(app) {
        return await this._enableExperiments(app);
      },

      async run(app, noteUUID) {
        try {
          const oldContent = await app.getNoteContent({ uuid: noteUUID })
          const newContent = await app.prompt(this.constants.messages.EDIT_NOTE_MARKDOWN, {
            inputs: [{ type: 'text', value: oldContent }]
          });
          if (typeof newContent === 'string') await app.replaceNoteContent({ uuid: noteUUID }, newContent);
        } catch (error) {
          this._handleError(app, error);
        } finally {
          return null;
        }
      },
    },

    View: {
      async run(app, noteUUID) {
        try {
          const content = await app.getNoteContent({ uuid: noteUUID });
          await app.alert(content, { preface: this.constants.messages.VIEWING_NOTE_MARKDOWN.replace('$1', content.length) });
        } catch (error) {
          this._handleError(app, error);
        } finally {
          return null;
        }
      },
    },
  },

  replaceText: {
    View: {
      async run(app, text) {
        try {
          await app.alert(app.context.selectionContent, { 
            preface: this.constants.messages.VIEWING_SELECTION_MARKDOWN.replace('$1', app.context.selectionContent.length)
          });
        } catch (error) {
          this._handleError(app, error);
        }
      },
    },

    Edit: {
      // EXPERIMENTAL FEATURE //
      async check(app) {
        return await this._enableExperiments(app);
      },

      async run(app, text) {
        try {
          const newContent = await app.prompt(this.constants.messages.ENTER_REPLACEMENT_MARKDOWN, {
            inputs: [{ type: 'text', value: app.context.selectionContent }]
          });
          if(typeof newContent === 'string') await app.context.replaceSelection(newContent);
        } catch (error) {
          this._handleError(app, error);
        }
      },
    },
  },

  insertText: {
    Insert: {
      async run(app) {
        try {
          const newContent = await app.prompt(this.constants.messages.ENTER_INSERTION_MARKDOWN);
          if(typeof newContent === 'string') await app.context.replaceSelection(newContent);
          else return '';
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    }
  }
})