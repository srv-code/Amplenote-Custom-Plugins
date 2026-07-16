// JavaScript
{
  replaceText: {
    'Uppercase': {
      async run(app, text) {
        await app.context.replaceSelection(text.toUpperCase());
      },
    },

    'Lowercase': {
      async run(app, text) {
        await app.context.replaceSelection(text.toLowerCase());
      },
    },

    'Capitalize': {
      async run(app, text) {
        await app.context.replaceSelection(
          text.replace(/[a-zA-Z]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        );
      },
    },

    'Delete': {
      async run(app, text) {
        await app.context.replaceSelection('');
      },
    },
  },

  insertText: {
    /* Directional arrows */
    'arrow-right': {
      run(app) { return '→'; },
    },

    'left-arrow': {
      run(app) { return '←'; },
    },

    'hyphen': {
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