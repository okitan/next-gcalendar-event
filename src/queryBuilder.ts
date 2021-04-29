import dayjs from "dayjs";
import yargs from "yargs";

export type QueryOption = {
  now?: dayjs.Dayjs;

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
  timeMin?: dayjs.Dayjs;
  timeMax?: dayjs.Dayjs;
  finished?: boolean;
};

export function buildQuery(queryOption: QueryOption): Query {
  const now = queryOption.now ?? dayjs();

  const query: Query = {
    q: queryOption.query,
  };

  // before and after will be overridden other convinience method
  if (queryOption.after) {
    const matched = queryOption.after.match(/^(-?\d+)(m|h|d|w|M|Q|y)$/);
    if (matched) {
      query.timeMin = now.add(parseInt(matched[1]), matched[2] as dayjs.OpUnitType);
    } else {
      query.timeMin = dayjs(queryOption.after);
    }
  }

  if (queryOption.before) {
    const matched = queryOption.before.match(/^(-?\d+)(m|h|d|w|M|Q|y)$/);
    if (matched) {
      query.timeMax = now.add(parseInt(matched[1]), matched[2] as dayjs.OpUnitType);
    } else {
      query.timeMax = dayjs(queryOption.before);
    }
  }

  // today > tommorrow > yesterday
  if (queryOption.today) {
    query.timeMin = now.startOf("day");
    query.timeMax = now.startOf("day").add(1, "days");
  } else if (queryOption.tommorow) {
    query.timeMin = now.startOf("day").add(1, "days");
    query.timeMax = now.startOf("day").add(2, "days");
  } else if (queryOption.yesterday) {
    query.timeMin = now.startOf("day").add(-1, "days");
    query.timeMax = now.startOf("day");
  }

  if (queryOption.done) {
    query.timeMax = now;
    query.finished = true;
  }
  if (queryOption.todo) {
    query.timeMin = now;
  }
  // queryOption;
  return query;
}
