import moment from "moment";

import { buildQuery } from "../src/queryBuilder";
import { momentMatcher } from "./helper/moment";

describe(buildQuery, () => {
  test("after: 1d returns timeMin 1 day away", () => {
    const now = moment([2020, 2 - 1, 29]);

    expect(buildQuery({ now, after: "1d" })).toMatchObject({ timeMin: momentMatcher(now.add(1, "d")) });
  });

  test("before: -1d returns timeMax 1 day ago", () => {
    const now = moment([2020, 2 - 1, 29]);

    expect(buildQuery({ now, before: "-1d" })).toMatchObject({ timeMax: momentMatcher(now.add(-1, "d")) });
  });

  test("before: xxx is overridden by done: true", () => {
    const now = moment([2020, 2 - 1, 29]);

    expect(buildQuery({ now, before: "-1d", done: true })).toMatchObject({
      timeMax: momentMatcher(now),
      finished: true,
    });
  });

  test("after: xxx is overridden by todo: true", () => {
    const now = moment([2020, 2 - 1, 29]);

    expect(buildQuery({ now, after: "1d", todo: true })).toMatchObject({ timeMin: momentMatcher(now) });
  });

  test("today: true works", () => {
    const now = moment([2020, 2 - 1, 29, 10]); // you should know this is UTC

    expect(buildQuery({ now, today: true })).toMatchObject({
      timeMin: momentMatcher(moment([2020, 2 - 1, 29])),
      timeMax: momentMatcher(moment([2020, 3 - 1, 1])),
    });
  });
});
