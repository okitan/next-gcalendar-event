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
      timeMax: argv.before,
    };

    if (argv.today) {
      const today = new Date();
      searchOptions.timeMin = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      searchOptions.timeMax = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    } else if (argv.tommorrow) {
      const today = new Date();
      searchOptions.timeMin = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      searchOptions.timeMax = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    } else if (argv.yesterday) {
      const today = new Date();
      searchOptions.timeMin = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      searchOptions.timeMax = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    if (argv.done) {
      searchOptions.timeMax = new Date();
    }
    if (argv.todo) {
      searchOptions.timeMin = new Date();
    }

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
      throw new Error('no events found');
    }
  },
};
