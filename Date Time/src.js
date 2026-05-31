// JavaScript
({
  constants: {
    settings: {
      ENABLED_EXPERIMENTS: 'Enable experimental features? (y/n | default: n)',
    },
    messages: {
      UNHANDLED_ERROR: 'Something went wrong!\nPlease refer the console logs for the technical details and inform the developer.',
    },
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

  _get(what, now = new Date()) {
    if(what === 'date') 
      return new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric"
        }).format(now);

    if(what === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return this._get('date', yesterday);
    }

    if(what === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return this._get('date', tomorrow);
    }
    
    if(what === 'time') 
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).format(now);

    if(what === 'datetime')
      return `${this._get('date')} at ${this._get('time')}`;

    if(what === 'timestamp') 
      return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);

    if(what === 'milliseconds')
      return now.getTime().toString();

    throw Error(`Illegal argument of what: ${what}`);
  },

  insertText: {
    date: {
      run(app) {
        try {
          return this._get('date');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    // EXPERIMENTAL FEATURE //
    today: {
      check(app) {
        return this._getSettingValue(app, this.constants.settings.ENABLED_EXPERIMENTS, "boolean");
      },

      run(app) {
        try {
          return this._get('date');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    // EXPERIMENTAL FEATURE //
    yesterday: {
      check(app) {
        return this._getSettingValue(app, this.constants.settings.ENABLED_EXPERIMENTS, "boolean");
      },

      run(app) {
        try {
          return this._get('yesterday');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    // EXPERIMENTAL FEATURE //
    tomorrow: {
      check(app) {
        return this._getSettingValue(app, this.constants.settings.ENABLED_EXPERIMENTS, "boolean");
      },

      run(app) {
        try {
          return this._get('tomorrow');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    time: {
      run(app) {
        try {
          return this._get('time');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },
    
    // EXPERIMENTAL FEATURE //
    now: {
      check(app) {
        return this._getSettingValue(app, this.constants.settings.ENABLED_EXPERIMENTS, "boolean");
      },

      run(app) {
        try {
          return this._get('time');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    datetime: {
      run(app) {
        try {
          return this._get('datetime');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    timestamp: {
      run(app) {
        try {
          return this._get('timestamp');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    milliseconds: {
      run(app) {
        try {
          return this._get('milliseconds');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },
  }
})