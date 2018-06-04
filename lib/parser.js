'use strict';

module.exports = {
  parser: require('yargs/yargs')()
    .usage('$0 [Options]')
    .option('calendar-id', {
      description: 'calendar id to search',
      required: true,
    })
    .option('query', {
      alias: 'q',
      description: 'event name to search (partial match)',
    })
    .option('after', {
      description: 'RFC3339 style',
      default: new Date().toISOString(),
      defaultDescription: 'after now',
    })
    .option('before', {
      description: 'RFC3339 style',
    })
    .option('tommorrow', {
      type: 'boolean',
      description: 'it overrides before and after to search events tommorow',
    })
    .option('format', {
      description:
        'mustach format to define output. See: https://developers.google.com/calendar/v3/reference/events to know object schema',
      default: '{{summary}} {{start.dateTime}}-{{end.dateTime}}',
    })
    .option('client-id', {
      description: 'use env NODE_CLIENT_ID is better',
      default: process.env.NODE_CLIENT_ID,
    })
    .option('client-secret', {
      description: 'use env NODE_CLIENT_SECRET is better',
      default: process.env.NODE_CLIENT_SECRET,
    })
    .option('refresh-token', {
      description: 'use env NODE_REFRESH_TOKEN is better',
      default: process.env.NODE_REFRESH_TOKEN,
    })
    .version(false)
    .strict()
    .wrap(null),
};
