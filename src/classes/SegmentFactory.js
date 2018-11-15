import Segment from './Segment.js';
import Point from './Point.js';

export default class SegmentFactory {
  static fromExisting(segment, time, road, params) {
    time = time || segment.time;
    road = road || segment.road;
    params = params || segment.params;
    return new Segment(road.start, road.end, time, params);
  }

  static usingDirection(start, direction = 90, length = DEFAULT_SEGMENT_LENGTH, time = 0, params = {}) {
    // convert direction to radians
    direction *= Math.PI / 180;
    const x = start.x + length * Math.sin(direction);
    const y = start.y + length * Math.cos(direction);
    return new Segment(start, new Point(x, y), time, params);
  }
}
