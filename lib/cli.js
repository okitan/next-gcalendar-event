'use strict';

const { parser } = require('./parser');

const { google } = require('googleapis');
const Mustache = require('mustache');

module.exports = {
  cli: async args => {
    const argv = parser.parse(args);

    const oauth2Client = new google.auth.OAuth2(argv.clientId, argv.clientSecret);
    oauth2Client.credentials = {
      refresh_token: argv.refreshToken,
    };

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const searchOptions = {
      orderBy: 'startTime',
      singleEvents: true,
      calendarId: argv.calendarId,
      timeMin: argv.after,
    };

    if (argv.query) {
      searchOptions.query = argv.query;
    }

    const result = await calendar.events.list(searchOptions);

    let event;
    if (argv.query) {
      event = result.data.items.find(event => event.summary.includes(argv.query));
    } else {
      event = result.data.items[0];
    }

    if (event) {
      console.log(Mustache.render(argv.format, event));
    } else {
      console.error('no events found');
      process.exit(1);
    }
  },
};
