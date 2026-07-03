// JavaScript
({
  constants: {
    settings: {
      ENABLED_EXPERIMENTS: 'Enable experimental features? (y/n | default: n)',
    },
    messages: {
      ERROR_INVALID_SETTING_BODY: 'Invalid value provided for "$1". Please enter \'y\' or \'n\'.',
      ERROR_INTERNAL_TITLE: 'Internal Error Occurred',
      ERROR_INTERNAL_BODY: 'Something unexpected happened:\n$1\n',
    },
  },

  validateSettings(app, settings) {
    const booleanRegex = /y|n/gi;
    const errors = [];
    for(const [name, value] of Object.entries(settings)) {
      if(!booleanRegex.test(value.trim()))
        errors.push(this.constants.messages.ERROR_INVALID_SETTING_BODY.replace('$1', name));
    }
    if(errors.length === 0) return false;
    return errors;
  },

  async _handleError(app, error) {
    let message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Plugin Error: %O\n%O", message, error?.stack ?? error);
    message = this.constants.messages.ERROR_INTERNAL_BODY.replace('$1', message);
    
    const response = await app.alert(message, {
      preface: this.constants.messages.ERROR_INTERNAL_TITLE, 
      primaryAction: { label: "ABORT", icon: "back_hand" },
      actions: [{ icon: "content_copy", label: "COPY", value: "COPY" }],
    });

    if(response === "COPY") 
      await app.writeClipboardData(
        this._stringifyAlertMessage(this.constants.messages.ERROR_INTERNAL_TITLE, message),
        "text/plain",
      );
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


    /* Generated using Claude ✨ */
    /* Made obsolete */
    if(what === 'date-new') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      
      const suffix = 
        dayNum % 10 === 1 && dayNum !== 11 ? 'st' :
        dayNum % 10 === 2 && dayNum !== 12 ? 'nd' :
        dayNum % 10 === 3 && dayNum !== 13 ? 'rd' :
        'th';
      
      return `${dayName}, ${dayNum}${suffix} ${monthName} ${year}`;
    }


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
        hour12: true,
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
    
    'date-new': {
      run(app) {
        try {
          return this._get('date-new');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    today: {
      run(app) {
        try {
          return this._get('date');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    yesterday: {
      run(app) {
        try {
          return this._get('yesterday');
        } catch (error) {
          this._handleError(app, error);
          return '';
        }
      }
    },

    tomorrow: {
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
    
    now: {
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