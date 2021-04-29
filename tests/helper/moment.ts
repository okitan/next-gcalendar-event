import moment from "moment";

class MomentMatcher {
  constructor(private target: moment.Moment) {}

  asymmetricMatch(other: moment.Moment) {
    // I don't know why Matcher comes right side
    if (other instanceof MomentMatcher) return false;

    return other.toISOString() === this.target.toISOString();
  }
}

export function momentMatcher(target: moment.Moment) {
  return new MomentMatcher(target);
}
