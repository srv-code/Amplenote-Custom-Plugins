// JavaScript
({
  noteOption: {
    'Edit note': {
      async run (app, noteUUID) {
        const oldContent = await app.getNoteContent({ uuid: noteUUID })
        const newContent = await app.prompt('Edit note as Markdown:', {
          inputs: [{
            type: 'text',
            value: oldContent
          }]
        })
        if (newContent === null) return
        
        await app.replaceNoteContent({ uuid: noteUUID }, newContent)
      }
    }
  },

  insertText: {
    'Insert': {
      async run (app) {
        const newContent = await app.prompt('Enter Markdown content to insert:')
        await app.context.replaceSelection(newContent ?? '')
      }
    }
  }
})