// JavaScript
({
  constants: {
    messages: {
      UNHANDLED_ERROR: 'Something went wrong!\nPlease refer the console logs for the technical details and inform the developer.',
      EDIT_NOTE_MARKDOWN: 'Edit note as Markdown',
      ENTER_INSERTION_MARKDOWN: 'Enter markdown content to insert',
    },
  },

  _handleError(app, error) {
    const message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Plugin Error: %O\n%O", message, error?.stack ?? error);
    app.alert(this.constants.messages.UNHANDLED_ERROR);
  },

  noteOption: {
    'Edit note': {
      check(app) {
        return false; // Disabled action added by original author
      },

      async run(app, noteUUID) {
        try {
          const oldContent = await app.getNoteContent({ uuid: noteUUID })
          const newContent = await app.prompt(this.constants.messages.EDIT_NOTE_MARKDOWN, {
            inputs: [{ type: 'text', value: oldContent }]
          })
          if (newContent === null) return
          
          await app.replaceNoteContent({ uuid: noteUUID }, newContent)
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
          await app.alert(content, { preface: `Viewing note (${content.length} characters)` });
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
            preface: `Viewing selection (${app.context.selectionContent.length} characters)` 
          });
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