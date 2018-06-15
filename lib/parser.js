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
    })
    .option('before', {
      description: 'RFC3339 style',
    })
    .option('done', {
      type: 'boolean',
      description: 'it overrides before, to limit events before now',
    })
    .option('todo', {
      type: 'boolean',
      description: 'it overrides after to limit events after now',
    })
    .option('today', {
      type: 'boolean',
      description: 'it overrides before and after to search events today',
    })
    .option('tommorrow', {
      type: 'boolean',
      description: 'it overrides before and after to search events tommorow',
    })
    .option('yesterday', {
      type: 'boolean',
      description: 'it overrides before and after to search events yesterday',
    })
    .option('format', {
      description:
        'mustach format to define output. See: https://developers.google.com/calendar/v3/reference/events to know object schema',
      default: '{{summary}} {{start.dateTime}}-{{end.dateTime}}',
    })
    .option('client-id', {
      description: 'If not set, fallback to NODE_CLIENT_ID',
      default: process.env.NODE_CLIENT_ID,
      defaultDescription: 'NODE_CLIENT_ID',
    })
    .option('client-secret', {
      description: 'If not set, fallback to NODE_CLIENT_SECRET',
      default: process.env.NODE_CLIENT_SECRET,
      defaultDescription: 'NODE_CLIENT_SECRET',
    })
    .option('refresh-token', {
      description: 'If not set, fallback to NODE_REFRESH_TOKEN',
      default: process.env.NODE_REFRESH_TOKEN,
      defaultDescription: 'NODE_REFRESH_TOKEN',
    })
    .version(false)
    .strict()
    .wrap(null),
};
