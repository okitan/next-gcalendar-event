import moment from "moment";
import yargs from "yargs";

export type QueryOption = {
  now?: moment.Moment;

  query?: string;
  after?: string;
  before?: string;
  todo?: boolean;
  done?: boolean;
  today?: boolean;
  tommorow?: boolean;
  yesterday?: boolean;
};

export function addQueryOptions<T>(yargs: yargs.Argv<T>) {
  return yargs.options({
    // by name
    query: {
      type: "string",
      alias: "q",
      description: "event name to search (partial match)",
    },
    // by date
    after: {
      type: "string",
      description: "moment.js parsable string or relative style like -1h and 1d",
    },
    before: {
      type: "string",
      description: "moment.js parsable string or relative style like -1h and 1d",
    },
    // date shortcut
    todo: {
      type: "boolean",
      description: "it overrides `after` to search events after now",
      default: false,
    },
    done: {
      type: "boolean",
      description: "it overrides `before` to search events before now and omit event not finished",
      default: false,
    },
    today: {
      type: "boolean",
      description: "it overrides `before` and `after` to search events today",
      default: false,
    },
    tommorow: {
      type: "boolean",
      description: "it overrides `before` and `after` to search events tommorow",
      default: false,
    },
    yesterday: {
      type: "boolean",
      description: "it overrides `before` and `after` to search events yesterday",
      default: false,
    },
  });
}

type Query = {
  q?: string;
  timeMin?: moment.Moment;
  timeMax?: moment.Moment;
  finished?: boolean;
};

export function buildQuery(queryOption: QueryOption): Query {
  const now = queryOption.now ?? moment();

  const query: Query = {
    q: queryOption.query,
  };

  // before and after will be overridden other convinience method
  if (queryOption.after) {
    const matched = queryOption.after.match(/^(-?\d+)(m|h|d|w|M|Q|y)$/);
    if (matched) {
      query.timeMin = moment(now).add(matched[1], matched[2] as moment.unitOfTime.DurationConstructor);
    } else {
      query.timeMin = moment(queryOption.after);
    }
  }

  if (queryOption.before) {
    const matched = queryOption.before.match(/^(-?\d+)(m|h|d|w|M|Q|y)$/);
    if (matched) {
      query.timeMax = moment(now).add(matched[1], matched[2] as moment.unitOfTime.DurationConstructor);
    } else {
      query.timeMax = moment(queryOption.before);
    }
  }

  // today > tommorrow > yesterday
  if (queryOption.today) {
    query.timeMin = moment(now).startOf("day");
    query.timeMax = moment(now).startOf("day").add(1, "days");
  } else if (queryOption.tommorow) {
    query.timeMin = moment(now).startOf("day").add(1, "days");
    query.timeMax = moment(now).startOf("day").add(2, "days");
  } else if (queryOption.yesterday) {
    query.timeMin = moment(now).startOf("day").add(-1, "days");
    query.timeMax = moment(now).startOf("day");
  }

  if (queryOption.done) {
    query.timeMax = moment(now);
    query.finished = true;
  }
  if (queryOption.todo) {
    query.timeMin = moment(now);
  }
  // queryOption;
  return query;
}
