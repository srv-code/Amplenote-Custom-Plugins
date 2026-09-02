// JavaScript
(() => {
  const ERROR_MESSAGE = 'Incorrect input provided.';
  const SETTING_USE_RESULT_TAG = 'Create tag instead of a new note for the result? (y/n)';
  const SETTING_RESULT_TAG_NAME = 'Search result tag name (default: search-result)';
  const DEFAULT_RESULT_TAG_NAME = 'search-result';
  const TAG_NAME_PROMPT_MESSAGE =
    "Please provide a name for the required setting 'Search result tag name (default: search-result)':";
  const TAG_NAME_VALIDATION_WARNING =
    'Incorrect value provided for tag. Only hyphens and alphanumeric value is accepted. Please try again.';
  const PROMPT_ABORT_ACTION = 'abort';
  const USER_ABORTED_MESSAGE = 'User aborted the operation.';

  function tokenize(input) {
    const tokens = [];
    let i = 0;
    const text = input.trim();

    if (!text) {
      throw new Error(ERROR_MESSAGE);
    }

    while (i < text.length) {
      if (/\s/.test(text[i])) {
        i += 1;
        continue;
      }

      if (text[i] === '(') {
        tokens.push({ type: 'LPAREN' });
        i += 1;
        continue;
      }

      if (text[i] === ')') {
        tokens.push({ type: 'RPAREN' });
        i += 1;
        continue;
      }

      const operatorMatch = text.slice(i).match(/^(AND|OR|NOT)\b/i);
      if (operatorMatch) {
        tokens.push({ type: operatorMatch[1].toUpperCase() });
        i += operatorMatch[0].length;
        continue;
      }

      const tagMatch = text.slice(i).match(/^[\w][\w./-]*/);
      if (tagMatch) {
        tokens.push({ type: 'TAG', value: tagMatch[0] });
        i += tagMatch[0].length;
        continue;
      }

      throw new Error(ERROR_MESSAGE);
    }

    return tokens;
  }

  class TagExpressionParser {
    constructor(tokens) {
      this.tokens = tokens;
      this.position = 0;
    }

    parse() {
      const expression = this.parseOr();

      if (this.position < this.tokens.length) {
        throw new Error(ERROR_MESSAGE);
      }

      if (!expression) {
        throw new Error(ERROR_MESSAGE);
      }

      return expression;
    }

    current() {
      return this.tokens[this.position];
    }

    consume(expectedType) {
      const token = this.current();

      if (!token || token.type !== expectedType) {
        throw new Error(ERROR_MESSAGE);
      }

      this.position += 1;
      return token;
    }

    parseOr() {
      let left = this.parseAnd();

      while (this.current()?.type === 'OR') {
        this.consume('OR');
        const right = this.parseAnd();
        left = { type: 'OR', left, right };
      }

      return left;
    }

    parseAnd() {
      let left = this.parseNot();

      while (this.current()?.type === 'AND') {
        this.consume('AND');
        const right = this.parseNot();
        left = { type: 'AND', left, right };
      }

      return left;
    }

    parseNot() {
      if (this.current()?.type === 'NOT') {
        this.consume('NOT');
        return { type: 'NOT', operand: this.parseNot() };
      }

      return this.parsePrimary();
    }

    parsePrimary() {
      const token = this.current();

      if (token?.type === 'LPAREN') {
        this.consume('LPAREN');
        const expression = this.parseOr();

        if (!expression) {
          throw new Error(ERROR_MESSAGE);
        }

        this.consume('RPAREN');
        return expression;
      }

      if (token?.type === 'TAG') {
        this.consume('TAG');
        return { type: 'TAG', value: token.value };
      }

      throw new Error(ERROR_MESSAGE);
    }
  }

  function parseTagExpression(input) {
    const tokens = tokenize(input);
    return new TagExpressionParser(tokens).parse();
  }

  function noteMatchesExpression(ast, tags) {
    const tagSet = new Set(tags);

    function evaluate(node) {
      switch (node.type) {
        case 'TAG':
          return tagSet.has(node.value);
        case 'NOT':
          return !evaluate(node.operand);
        case 'AND':
          return evaluate(node.left) && evaluate(node.right);
        case 'OR':
          return evaluate(node.left) || evaluate(node.right);
        default:
          throw new Error(ERROR_MESSAGE);
      }
    }

    return evaluate(ast);
  }

  function escapeMarkdownTableCell(value) {
    return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  }

  function noteTitleWithLink(note) {
    const title = escapeMarkdownTableCell(note.name || '(Untitled)');

    if (!note.uuid) {
      return title;
    }

    const noteURL = 'https://www.amplenote.com/notes/' + note.uuid;
    return `[${title}](${noteURL})`;
  }

  function buildResultsMarkdown(query, matchingNotes) {
    const timestamp = new Date().toLocaleString();
    const lines = [
      `# Tag filter results`,
      ``,
      `**Query:** \`${query}\``,
      `**Generated:** ${timestamp}`,
      `**Matches:** ${matchingNotes.length}`,
      ``,
    ];

    if (matchingNotes.length === 0) {
      lines.push(`No notes matched this tag expression.`);
      return lines.join('\n');
    }

    lines.push(`| Title | Tags |`);
    lines.push(`| --- | --- |`);

    for (const note of matchingNotes) {
      const title = noteTitleWithLink(note);
      const tags = escapeMarkdownTableCell((note.tags || []).join(', ') || '—');
      lines.push(`| ${title} | ${tags} |`);
    }

    return lines.join('\n');
  }

  function shouldUseResultTag(app) {
    const settingValue = (app.settings[SETTING_USE_RESULT_TAG] || '').trim().toLowerCase();
    return settingValue === 'y';
  }

  function normalizeResultTagName(tagName) {
    return tagName.trim().toLowerCase();
  }

  function isValidResultTagName(tagName) {
    const value = tagName.trim();

    if (!value) {
      return false;
    }

    // Alphanumeric and hyphens only; leading/trailing hyphens are allowed (e.g. -search-result-)
    if (!/^[a-zA-Z0-9-]+$/.test(value)) {
      return false;
    }

    // Disallow consecutive hyphens anywhere in the value
    if (/--/.test(value)) {
      return false;
    }

    if (!/[a-zA-Z0-9]/.test(value)) {
      return false;
    }

    return true;
  }

  async function promptForSearchResultTagName(app) {
    let previousValue = DEFAULT_RESULT_TAG_NAME;
    let showValidationWarning = false;

    while (true) {
      let message = TAG_NAME_PROMPT_MESSAGE;

      if (showValidationWarning) {
        message = TAG_NAME_VALIDATION_WARNING + '\n\n' + TAG_NAME_PROMPT_MESSAGE;
      }

      const promptResult = await app.prompt(message, {
        inputs: [
          {
            type: 'string',
            value: previousValue,
            placeholder: 'Please enter the tag name',
          },
        ],
        actions: [{ label: 'Abort', value: PROMPT_ABORT_ACTION }],
      });

      if (promptResult === null) {
        await app.alert(USER_ABORTED_MESSAGE);
        return null;
      }

      const [textResult, actionResult] = promptResult;

      if (actionResult === PROMPT_ABORT_ACTION) {
        await app.alert(USER_ABORTED_MESSAGE);
        return null;
      }

      const tagName = (textResult || '').trim();

      if (isValidResultTagName(tagName)) {
        return normalizeResultTagName(tagName);
      }

      previousValue = tagName || previousValue;
      showValidationWarning = true;
    }
  }

  async function resolveSearchResultTagName(app) {
    const configuredTagName = (app.settings[SETTING_RESULT_TAG_NAME] || '').trim();

    if (configuredTagName) {
      return normalizeResultTagName(configuredTagName);
    }

    const tagNameFromPrompt = await promptForSearchResultTagName(app);

    if (tagNameFromPrompt === null) {
      return null;
    }

    await app.setSetting(SETTING_RESULT_TAG_NAME, tagNameFromPrompt);

    return tagNameFromPrompt;
  }

  async function applySearchResultTagToNotes(matchingNotes, tagName) {
    for (const note of matchingNotes) {
      const existingTags = note.tags || [];

      if (!existingTags.includes(tagName)) {
        await note.addTag(tagName);
      }
    }
  }

  function buildTagFilterNavigateUrl(tagName) {
    return 'https://www.amplenote.com/notes?tag=' + encodeURIComponent(tagName);
  }

  async function filterNotesByTagExpression(app, query) {
    const ast = parseTagExpression(query);
    const noteHandles = await app.filterNotes();
    const matchingNotes = [];

    for (const noteHandle of noteHandles) {
      const note = await app.notes.find(noteHandle);

      if (!note) {
        continue;
      }

      if (noteMatchesExpression(ast, note.tags)) {
        matchingNotes.push(note);
      }
    }

    matchingNotes.sort((a, b) =>
      (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }),
    );

    return matchingNotes;
  }

  return {
    async noteOption(app, noteUUID) {
      try {
        const query = (
          await app.prompt(
            'Enter a tag filter expression using AND, OR, NOT, and parentheses.\n\nExample: amplenote OR (help AND docs)',
          )
        )?.trim();

        if (!query) {
          return;
        }

        let resultTagName = null;

        if (shouldUseResultTag(app)) {
          resultTagName = await resolveSearchResultTagName(app);

          if (resultTagName === null) {
            return;
          }
        }

        const matchingNotes = await filterNotesByTagExpression(app, query);

        if (shouldUseResultTag(app)) {
          await applySearchResultTagToNotes(matchingNotes, resultTagName);
          await app.navigate(buildTagFilterNavigateUrl(resultTagName));
          return;
        }

        const resultTitle = `Tag filter: ${query}`;
        const resultNote = await app.notes.create(resultTitle, ['tag-filter-results']);
        const markdown = buildResultsMarkdown(query, matchingNotes);

        await resultNote.replaceContent(markdown);
        await app.navigate(await resultNote.url());
      } catch (error) {
        await app.alert(error?.message || String(error));
      }
    },
  };
})();
