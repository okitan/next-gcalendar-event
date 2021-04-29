import dayjs from "dayjs";

import { buildQuery } from "../src/queryBuilder";
import { dayjsMatcher } from "./helper/dayjs";

describe(buildQuery, () => {
  test("after: 1d returns timeMin 1 day away", () => {
    const now = dayjs(new Date(2020, 2 - 1, 29));

    expect(buildQuery({ now, after: "1d" })).toMatchObject({ timeMin: dayjsMatcher(now.add(1, "d")) });
  });

  test("before: -1d returns timeMax 1 day ago", () => {
    const now = dayjs(new Date(2020, 2 - 1, 29));

    expect(buildQuery({ now, before: "-1d" })).toMatchObject({ timeMax: dayjsMatcher(now.add(-1, "d")) });
  });

  test("before: xxx is overridden by done: true", () => {
    const now = dayjs(new Date(2020, 2 - 1, 29));

    expect(buildQuery({ now, before: "-1d", done: true })).toMatchObject({
      timeMax: dayjsMatcher(now),
      finished: true,
    });
  });

  test("after: xxx is overridden by todo: true", () => {
    const now = dayjs(new Date(2020, 2 - 1, 29));

    expect(buildQuery({ now, after: "1d", todo: true })).toMatchObject({ timeMin: dayjsMatcher(now) });
  });

  test("today: true works", () => {
    const now = dayjs(new Date(2020, 2 - 1, 29, 10)); // you should know this is UTC

    expect(buildQuery({ now, today: true })).toMatchObject({
      timeMin: dayjsMatcher(dayjs(new Date(2020, 2 - 1, 29))),
      timeMax: dayjsMatcher(dayjs(new Date(2020, 3 - 1, 1))),
    });
  });
});
