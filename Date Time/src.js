// JavaScript
({
  handleError(app, error) {
    const message = error && (error.message || error.toString()) ? error.message || error.toString() : "Unknown Error";
    console.error("Plugin Error: %O\n%O", message, error?.stack ?? error);
    app.alert('Something went wrong!\nPlease refer the console logs for the technical details and inform the developer.');
  },

  get(what) {
    const now = new Date();

    if(what === 'date') 
      return new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric"
        }).format(now);

    if(what === 'time') 
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).format(now);

    if(what === 'datetime')
      return `${this.get('date')} at ${this.get('time')}`;

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

    throw Error(`Illegal argument of what: ${what}`);
  },

  insertText: {
    date: {
      run(app) {
        try {
          return this.get('date');
        } catch (error) {
          this.handleError(app, error);
          return '';
        }
      }
    },

    time: {
      run(app) {
        try {
          return this.get('time');
        } catch (error) {
          this.handleError(app, error);
          return '';
        }
      }
    },

    datetime: {
      run(app) {
        try {
          return this.get('datetime');
        } catch (error) {
          this.handleError(app, error);
          return '';
        }
      }
    },

    timestamp: {
      run(app) {
        try {
          return this.get('timestamp');
        } catch (error) {
          this.handleError(app, error);
          return '';
        }
      }
    },
  }
})