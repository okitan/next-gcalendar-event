import dayjs from "dayjs";

class DayjsMatcher {
  constructor(private target: dayjs.Dayjs) {}

  asymmetricMatch(other: dayjs.Dayjs) {
    // I don't know why Matcher comes right side
    if (other instanceof DayjsMatcher) return false;

    return other.toISOString() === this.target.toISOString();
  }
}

export function dayjsMatcher(target: dayjs.Dayjs) {
  return new DayjsMatcher(target);
}
