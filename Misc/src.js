// JavaScript
{
  replaceText: {
    'Uppercase': {
      async run(app) {
        await app.context.replaceSelection(app.context.selectionContent.toUpperCase());
      },
    },

    'Lowercase': {
      async run(app) {
        await app.context.replaceSelection(app.context.selectionContent.toLowerCase());
      },
    },

    'Capitalize': {
      async run(app) {
        await app.context.replaceSelection(
          app.context.selectionContent
            .replace(/[a-zA-Z]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        );
      },
    },

    'Delete': {
      async run(app) {
        await app.context.replaceSelection('');
      },
    },

    // 'Copy Section Link': {
    //   async check(app, text) {
    //     console.log('>> [check] text: %s, selectionContent: %s', text, app.context.selectionContent);
    //     const valid = app.context.selectionContent.trimStart().startsWith('#');
    //     console.log('>> [check] valid: %s', valid);
    //     return valid;
    //   },
    //   async run(app, text) {
    //     console.log('>> [run] text: %s, selectionContent: %s | url: %s, link: %s, noteUUID: %s', 
    //       text, app.context.selectionContent, app.context.url, app.context.link, app.context.noteUUID);
        
    //     const sectionLink = `${app.context.link}#`;
    //     // await this._copyToClipboard(sectionLink);

    //     // await app.writeClipboardData(
    //     //   '',
    //     //   "text/plain",
    //     // );


    //     // await app.alert(`Copied section link: ${sectionLink}`);
        
    //   },
    // },
  },

  insertText: {
    /* Directional arrows */
    'arrow-right': {
      run(app) { return '→'; },
    },

    '->': {
      run(app) { return '→'; },
    },

    'left-arrow': {
      run(app) { return '←'; },
    },

    '<-': {
      run(app) { return '←'; },
    },

    'hyphen': {
      run(app) { return '－'; },
    },

    '--': {
      run(app) { return '－'; },
    },

    'arrow-up': {
      run(app) { return '↑'; },
    },

    'arrow-down': {
      run(app) { return '↓'; },
    },

    'arrow-horizontal': {
      run(app) { return '↔'; },
    },

    'arrow-vertical': {
      run(app) { return '↕'; },
    },
  },
}