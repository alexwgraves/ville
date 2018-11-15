export default class Road {
  constructor(start, end, segment) {
    this.start = start;
    this.end = end;
    this.segment = segment;
  }

  setStart(start) {
    this.start = start;
    this.segment.collider.updateCollisionProperties({ start: start });
    this.segment.roadRevision++;
  }

  setEnd(end) {
    this.end = end;
    this.segment.collider.updateCollisionProperties({ end: end });
    this.segment.roadRevision++;
  }

  intersects(other) {
    const r = this.end.minus(this.start);
    const s = other.end.minus(other.start);
    const starts = other.start.minus(this.start);

    const numerator = starts.cross(r);
    const denominator = r.cross(s);

    if (denominator === 0 || numerator === 0) return false;

    const u = numerator / denominator;
    const t = starts.cross(s) / denominator;
    const epsilon = 0.001;
    return t > epsilon && t < 1 - epsilon && u > epsilon && u < 1 - epsilon;
  }
}
