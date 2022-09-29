import type yargs from "yargs";

import { calendar, type calendar_v3 } from "@googleapis/calendar";

import { type OAuth2ClientArgument } from "./google";

export type CalendarClientArgument = {
  calendarClient: calendar_v3.Calendar;
};

export function addCalendarClientOptions<T extends OAuth2ClientArgument>(yargs: yargs.Argv<T>) {
  return yargs
    .options({
      calendarClient: {
        hidden: true,
        default: calendar({ version: "v3" }),
      },
    })
    .middleware([injectCalendarClient]);
}

export function injectCalendarClient(args: OAuth2ClientArgument & CalendarClientArgument): void {
  args.calendarClient = calendar({ version: "v3", auth: args.oauth2Client });
}
