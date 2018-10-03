"use strict";

const { parser } = require("./parser");

const { google } = require("googleapis");

const Mustache = require("mustache");
const moment = require("moment");

module.exports = {
  cli: async args => {
    const argv = parser.parse(args);

    const oauth2Client = new google.auth.OAuth2(
      argv.clientId,
      argv.clientSecret
    );
    oauth2Client.credentials = {
      refresh_token: argv.refreshToken
    };

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    let timeMin, timeMax;
    // before and after will be overridden other convinience method
    if (argv.after) {
      const matched = argv.after.match(/^(-?\d+)(m|h|d|w|M|Q|y)$/);
      if (matched) {
        timeMin = moment().add(matched[1], matched[2]);
      } else {
        timeMin = moment(argv.after);
      }
    }

    if (argv.before) {
      const matched = argv.before.match(/^(-?\d+)(m|h|d|w|M|Q|y)$/);
      if (matched) {
        timeMax = moment().add(matched[1], matched[2]);
      } else {
        timeMax = moment(argv.before);
      }
    }

    if (argv.today) {
      timeMin = moment().startOf("day");
      timeMax = moment()
        .startOf("day")
        .add(1, "days");
    } else if (argv.tommorrow) {
      timeMin = moment()
        .startOf("day")
        .add(1, "days");
      timeMax = moment()
        .startOf("day")
        .add(2, "days");
    } else if (argv.yesterday) {
      timeMin = moment()
        .startOf("day")
        .add(-1, "days");
      timeMax = moment().startOf("day");
    }

    if (argv.done) {
      timeMax = moment();
    }
    if (argv.todo) {
      timeMin = moment();
    }

    const searchOptions = {
      orderBy: "startTime",
      singleEvents: true,
      calendarId: argv.calendarId
    };

    if (timeMin) {
      searchOptions.timeMin = timeMin.toISOString();
    }
    if (timeMax) {
      searchOptions.timeMax = timeMax.toISOString();
    }

    if (argv.query) {
      searchOptions.query = argv.query;
    }

    const result = await calendar.events.list(searchOptions);

    let event;
    if (argv.query) {
      event = result.data.items.find(event =>
        event.summary.includes(argv.query)
      );
    } else {
      event = result.data.items[0];
    }

    if (event) {
      console.log(Mustache.render(argv.format, event));
    } else {
      throw new Error("no events found");
    }
  }
};
