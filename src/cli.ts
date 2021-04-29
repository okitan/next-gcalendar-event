import { spawn } from "child_process";
import dayjs from "dayjs";
import { calendar_v3 } from "googleapis";
import Mustache from "mustache";
import yargs from "yargs";

import { addQueryOptions, buildQuery } from "./queryBuilder";
import { CalendarClientArgument, injectCalendarClient } from "./services/gcaledar";
import { addGoogleCredentialsOptions } from "./services/google";

export const command = "$0";
export const description = "check next google calendar event";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addGoogleCredentialsOptions(
    addQueryOptions(
      yargs.options({
        calendarId: {
          type: "string",
          description: "calendar id to search",
          required: true,
        },
      })
    )
  )
    .middleware([injectCalendarClient])
    .option("format", {
      description:
        "mustach format to define output. See: https://developers.google.com/calendar/v3/reference/events to know object schema",
      default: "{{summary}} {{start.dateTime}}-{{end.dateTime}}",
    })
    .version(false)
    .strict()
    .wrap(120);
}

export type Extract<T> = T extends yargs.Argv<infer U> ? U : never;

export async function hander({
  calendarClient,
  calendarId,
  ...args
}: yargs.Arguments<Extract<ReturnType<typeof builder>>> & CalendarClientArgument) {
  const { timeMin, timeMax, finished, ...query } = buildQuery(args);

  const searchOptions: calendar_v3.Params$Resource$Events$List = {
    calendarId,
    orderBy: "startTime",
    singleEvents: true,
    timeMin: timeMin?.toISOString(),
    timeMax: timeMax?.toISOString(),
    ...query,
  };

  const result = await calendarClient.events.list(searchOptions);

  const found = result.data.items?.find((event) => {
    // because calendar search do not care spaces
    if (searchOptions.q && !event.summary?.includes(searchOptions.q)) return false;

    // timeMax does not care events are over
    if (timeMax && finished) {
      if (!event.end || !event.end.dateTime) return false;
      if (dayjs(event.end.dateTime) > timeMax) return false;
    }

    return true;
  });

  if (!found) {
    if (args._.length) return; // Do not execute trail command
    throw new Error("no events found");
  }

  // execute trail command
  if (!args._.length) {
    const [command, ...argv] = args._;

    const p = spawn(command as string, argv as string[]);
    p.stdout.on("data", process.stdout.write);
    p.stderr.on("data", process.stderr.write);
    p.on("close", process.exit);
    return;
  }

  console.log(Mustache.render(args.format, event));
}
