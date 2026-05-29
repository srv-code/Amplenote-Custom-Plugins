// JavaScript
({
  handleError(app, error) {
    const message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    if (error?.stack)
      console.error("Generate TOC plugin error: %O\n%O", message, error.stack);
    else
      console.error("Generate TOC plugin error: %O\n%O", message, error);

    app.alert('Something went wrong!\nPlease refer the console logs for the technical details and inform the developer.');
  },

  noteOption: {
    'Edit note': {
      check(app) {
        return false; // Disabled action added by original author
      },

      async run(app, noteUUID) {
        try {
          const oldContent = await app.getNoteContent({ uuid: noteUUID })
          const newContent = await app.prompt('Edit note as Markdown:', {
            inputs: [{
              type: 'text',
              value: oldContent
            }]
          })
          if (newContent === null) return
          
          await app.replaceNoteContent({ uuid: noteUUID }, newContent)
        } catch (error) {
          this.handleError(app, error);
        } finally {
          return null;
        }
      },
    },

    View: {
      async run(app, noteUUID) {
        try {
          const content = await app.getNoteContent({ uuid: noteUUID });
          await app.alert(content, { preface: `Viewing note. (${content.length} characters)` });
        } catch (error) {
          this.handleError(app, error);
        } finally {
          return null;
        }
      },
    },
  },

  replaceText: {
    View: {
      async run(app, text) {
        await app.alert(app.context.selectionContent, { 
          preface: `Viewing selection. (${app.context.selectionContent.length} characters)` 
        });
      },
    },
  },

  insertText: {
    Insert: {
      async run(app) {
        try {
          const newContent = await app.prompt('Enter markdown content to insert:');
          if(typeof newContent === 'string') await app.context.replaceSelection(newContent);
          else return '';
        } catch (error) {
          this.handleError(app, error);
          return null;
        }
      }
    }
  }
})