import { type calendar_v3, google } from "googleapis";
import type yargs from "yargs";

import { type OAuth2ClientArgument } from "./google";

export type CalendarClientArgument = {
  calendarClient: calendar_v3.Calendar;
};

export function addCalendarClientOptions<T extends OAuth2ClientArgument>(yargs: yargs.Argv<T>) {
  return yargs
    .options({
      calendarClient: {
        hidden: true,
        default: google.calendar({ version: "v3" }),
      },
    })
    .middleware([injectCalendarClient]);
}

export function injectCalendarClient(args: OAuth2ClientArgument & CalendarClientArgument): void {
  args.calendarClient = google.calendar({ version: "v3", auth: args.oauth2Client });
}
