import { calendar_v3, google } from "googleapis";

import { OAuth2ClientArgument } from "./google";

export type CalendarClientArgument = {
  calendarClient: calendar_v3.Calendar;
};

export function injectCalendarClient(argv: any): CalendarClientArgument {
  const { oauth2Client } = argv as OAuth2ClientArgument; // FIXME:

  return {
    calendarClient: google.calendar({ version: "v3", auth: oauth2Client }),
  };
}
