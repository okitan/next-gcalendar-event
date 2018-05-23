# next-gcalendar-event

Get next google calendar event CLI

## Install

```console
$ npx install next-gcalendar-event
```

## Setup

Yo need these environment variables of client.

* NODE_CLIENT_ID
* NODE_CLEINT_SECRET
* NODE_REFRESH_TOKEN
  * https://www.googleapis.com/auth/calendar.readonly scope needed

## Usage

```console
$ npx next-gcalendar-event --calendar-id CALENDER_ID
Meeting 2018-05-24T11:00:00+09:00-2018-05-24T11:30:00+09:00
# You can search by event summary
$ npx next-gcalendar-event --calendar-id CALENDER_ID --query "Drinking"
Drinking  2018-05-25T18:00:00+09:00-2018-05-25T22:00:00+09:00
# You can format output by Mustache
$ npx next-gcalendar-event --calendar-id CALENDER_ID --format "{{summary}} - {{description}}"
Meeting - There are no agendas.
```

### Options

* calendar-id (required)
  * calendar id to search
* query
  * search events summary
* format
  * configure your output (using Mustache)
  * See: https://developers.google.com/calendar/v3/reference/events to know event object schema

Other options can be found by `--help`
