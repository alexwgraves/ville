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
}
