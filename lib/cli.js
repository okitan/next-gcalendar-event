"use strict";

const { parser } = require("./parser");

const { google } = require("googleapis");

const Mustache = require("mustache");
const moment = require("moment");

// node's exec is not like exec(3)
const { spawn } = require("child_process");

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

    const event = result.data.items.find(event => {
      if (argv.query && !event.summary.includes(argv.query)) {
        return false;
      }

      // timeMax does not care events are over
      if (argv.done && moment(event.end.dateTime) > timeMax) {
        return false;
      }

      return true;
    });

    if (event) {
      console.log(event);
      if (argv._.length > 0) {
        const command = argv._;
        // boring
        const p = spawn(command[0], command.slice(1));
        p.stdout.on("data", data => {
          process.stdout.write(data);
        });
        p.stderr.on("data", data => {
          process.stderr.write(data);
        });
        p.on("close", code => {
          process.exit(code);
        });
      } else {
        console.log(Mustache.render(argv.format, event));
      }
    } else {
      if (argv._.length > 0) {
        // Do nonthing no events found
      } else {
        throw new Error("no events found");
      }
    }
  }
};
