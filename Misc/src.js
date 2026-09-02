// JavaScript
a = {
  replaceText: {
    Uppercase: {
      async run(app) {
        await app.context.replaceSelection(app.context.selectionContent.toUpperCase());
      },
    },

    Lowercase: {
      async run(app) {
        await app.context.replaceSelection(app.context.selectionContent.toLowerCase());
      },
    },

    Capitalize: {
      async run(app) {
        await app.context.replaceSelection(
          app.context.selectionContent.replace(
            /[a-zA-Z]+/g,
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          ),
        );
      },
    },

    Delete: {
      async run(app) {
        await app.context.replaceSelection('');
      },
    },
  },

  insertText: {
    /* Directional arrows */
    'arrow-right': {
      run(app) {
        return '→';
      },
    },

    '->': {
      run(app) {
        return '→';
      },
    },

    'left-arrow': {
      run(app) {
        return '←';
      },
    },

    '<-': {
      run(app) {
        return '←';
      },
    },

    hyphen: {
      run(app) {
        return '－';
      },
    },

    '--': {
      run(app) {
        return '－';
      },
    },

    'arrow-up': {
      run(app) {
        return '↑';
      },
    },

    'arrow-down': {
      run(app) {
        return '↓';
      },
    },

    'arrow-horizontal': {
      run(app) {
        return '↔';
      },
    },

    'arrow-vertical': {
      run(app) {
        return '↕';
      },
    },
  },

  imageOption: {
    Alter: {
      check() {
        return false;
      },

      async run(app, image) {
        console.log({ image });
        //   const response = await app.context.updateImage({
        //     index: 0,
        //     src: '',
        //     text: 'TEXT',
        //     caption: 'CAPTION',
        //  });
        //  console.log('response', response)

        const noteUUID = app.context.url?.split?.('/notes/')?.[1]?.split?.('?')?.[0];

        const linkId = Date.now(); // TODO: Can this be replaced with note link count?
        const linkCaption = image.caption || 'Image caption';
        const linkAddress = 'https://www.google.com' || '';
        const linkDescription = 'This is description.' || '';

        const replaceMd = `[${linkCaption}][^${linkId}]`;

        console.log({ replaceMd, linkId, linkCaption, linkAddress, linkDescription });
        const replaceResponse = await app.context.replaceSelection(replaceMd);
        console.log({ replaceResponse });

        const insertMd = `
[^${linkId}]: [${linkCaption}](${linkAddress})
    ${linkDescription}
    ![](${image.src})
`;
        console.log({ insertMd });
        const insertResponse = await app.insertNoteContent({ uuid: noteUUID }, insertMd, {
          atEnd: true,
        });
        console.log({ insertResponse });
      },
    },

    Embed: {
      check() {
        return false;
      },

      async run(app, image) {
        console.log({ image });
        // {
        //     "caption": null,
        //     "index": 0,
        //     "src": "https://images.amplenote.com/9316f050-96e5-11f1-b01c-910f1b3a2a2e/6b64084e-7726-493d-a5f4-c7de234efd14.png",
        //     "text": "1. Mark your house location on the map to assign your\nSE ID to respective enumerator for confirmation.\n2. NECESSARILY move the red location marker to your\nhouse or near to your house.\n3. If the marker is already on your house, still move it\nslightly and bring it on your house or near to your house\nagain.\n4. For SE on mobile, use two fingers to move the red\nlocation marker on your house or near your house.\n5. It is OK even if you don't find exact house address on\nthe map.\nOK"
        // }

        const result = await app.prompt(
          `Add properties to embedded image link.\nImage properties:\nSource: ${image.src}\nExtracted Text: ${image.text}`,
          {
            preface: 'PREFACE',
            inputs: [
              {
                label: 'Caption*',
                placeholder: 'Set a link caption',
                type: 'string',
                value: image.caption || '',
              },
              { label: 'Description', placeholder: 'Set a link description', type: 'text' },
              { label: 'Address URL', placeholder: 'Set a link address', type: 'string' },
              { label: 'Include extracted text?', type: 'checkbox' },
            ],
            actions: [{ label: 'View', value: 'View', icon: 'auto_awesome' }],
          },
        );
        console.log({ result });
        // [
        //     "CAPTIONNNNN",
        //     "DESCCC",
        //     "URLLLLL",
        //     true,
        //     -1
        // ]

        console.log({ 'app.context.url': app.context.url });
        const noteUUID = app.context.url?.split?.('/notes/')?.[1]?.split?.('?')?.[0];

        const images = await app.getNoteImages({ uuid: noteUUID });
        console.log('note images', { noteUUID, images });
        //   [
        //     {
        //         "index": 0,
        //         "src": "https://images.amplenote.com/9316f050-96e5-11f1-b01c-910f1b3a2a2e/6b64084e-7726-493d-a5f4-c7de234efd14.png",
        //         "text": "1. Mark your house location on the map to assign your\nSE ID to respective enumerator for confirmation.\n2. NECESSARILY move the red location marker to your\nhouse or near to your house.\n3. If the marker is already on your house, still move it\nslightly and bring it on your house or near to your house\nagain.\n4. For SE on mobile, use two fingers to move the red\nlocation marker on your house or near your house.\n5. It is OK even if you don't find exact house address on\nthe map.\nOK",
        //         "width": 489.4444580078125
        //     },
        //     {
        //         "index": 0,
        //         "src": "https://images.amplenote.com/9316f050-96e5-11f1-b01c-910f1b3a2a2e/d864da19-c4eb-4763-8e40-a906b6c4cc52.png",
        //         "text": "Confirm Location\nState/UT West Bengal\nDistrict Paschim Bardhaman\nYour Residential Location: 23.820041,\n86.890812\nPlease confirm the location of your house. In case of\nwrong location, your SE data will not be fetched to the\nEnumerator.\nDo you want to continue with the selected location?\nX\nNo\nYes",
        //         "width": 496.4496765136719
        //     },
        //     {
        //         "index": 0,
        //         "src": "https://images.amplenote.com/9316f050-96e5-11f1-b01c-910f1b3a2a2e/24ceb654-1c05-401e-9c2a-23c60c8d0bca.png",
        //         "text": ""
        //     },
        //     {
        //         "index": 1,
        //         "src": "https://images.amplenote.com/9316f050-96e5-11f1-b01c-910f1b3a2a2e/24ceb654-1c05-401e-9c2a-23c60c8d0bca.png",
        //         "text": ""
        //     },
        //     {
        //         "index": 2,
        //         "src": "https://images.amplenote.com/9316f050-96e5-11f1-b01c-910f1b3a2a2e/24ceb654-1c05-401e-9c2a-23c60c8d0bca.png",
        //         "text": ""
        //     },
        //     {
        //         "index": 3,
        //         "src": "https://images.amplenote.com/9316f050-96e5-11f1-b01c-910f1b3a2a2e/24ceb654-1c05-401e-9c2a-23c60c8d0bca.png",
        //         "text": "Submitted Successfully\nYour Self-Enumeration (SE) form has been successfully submitted.\nYour Self-Enumeration ID (SE ID) is:\nH33033522977\nYou are requested to share this SE ID with the enumerator to complete your\nHLO. If not, a fresh enumeration may be required by the Enumerator.\nThis SE ID has been sent to your mobile and e-mail (if provided).",
        //         "width": 475.451416015625,
        //         "caption": "This is sample caption"
        //     }
        // ]

        console.log({ 'app.context keys': Object.keys(app.context) });
        //   [
        //     "lightDarkMode",
        //     "noteUUID",
        //     "pluginUUID",
        //     "subscriptionLevel",
        //     "url",
        //     "refreshSettings",
        //     "replaceSelection",
        //     "setStatus",
        //     "updateImage"
        // ]

        console.log({ 'app keys': Object.keys(app) });
        //   {
        //     "app keys": [
        //         "context",
        //         "fetch",
        //         "notes",
        //         "saveFile",
        //         "settings",
        //         "addNoteTag",
        //         "addShortcut",
        //         "addTaskDomainNote",
        //         "alert",
        //         "attachNoteMedia",
        //         "callPlugin",
        //         "createNote",
        //         "deleteNote",
        //         "evaluateExpression",
        //         "filterNotes",
        //         "findNote",
        //         "getAttachmentURL",
        //         "getCompletedTasks",
        //         "getExternalCalendarEvents",
        //         "getMoodRatings",
        //         "getNoteAttachments",
        //         "getNoteBacklinkContents",
        //         "getNoteBacklinks",
        //         "getNoteContent",
        //         "getNoteImages",
        //         "getNoteOpenCounts",
        //         "getNotePublicURL",
        //         "getNoteSections",
        //         "getNoteSettings",
        //         "getNoteTasks",
        //         "getNoteURL",
        //         "getPeople",
        //         "getShortcuts",
        //         "getTags",
        //         "getTask",
        //         "getTaskDomains",
        //         "getTaskDomainTasks",
        //         "htmlFromContent",
        //         "insertNoteContent",
        //         "insertTask",
        //         "navigate",
        //         "openEmbed",
        //         "openSidebarEmbed",
        //         "prompt",
        //         "publishNote",
        //         "recordMoodRating",
        //         "removeNoteTag",
        //         "removeShortcut",
        //         "replaceNoteContent",
        //         "searchNotes",
        //         "setNoteName",
        //         "setNoteSetting",
        //         "setSetting",
        //         "unpublishNote",
        //         "updateMoodRating",
        //         "updateNoteImage",
        //         "updateTask",
        //         "writeClipboardData",
        //         "insertContent"
        //     ]
        // }
        console.log({ 'note attachments': await app.getNoteAttachments({ uuid: noteUUID }) });
      },
    },
  },
};
