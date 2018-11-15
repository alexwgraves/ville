import { DEFAULT_SEGMENT_WIDTH,
         HIGHWAY_SEGMENT_WIDTH,
         MIN_SPEED_PROPORTION } from './../config.js';

import Collision from './Collision.js';
import Road from './Road.js';
import Point from './Point.js';
import SegmentFactory from './SegmentFactory.js';

export default class Segment {
  static get End() {
    return { START: 'start', END: 'end' };
  }

  constructor(start, end, time = 0, params = {}) {
    this.start = start;
    this.end = end;
    this.time = time;
    this.params = params;

    this.width = params.highway ? HIGHWAY_SEGMENT_WIDTH : DEFAULT_SEGMENT_WIDTH;
    this.collider = new Collision(this, Collision.Type.LINE, {start: start, end: end, width: this.width});

    this.roadRevision = 0;
    this.road = new Road(start, end, this);

    // time-step delay before this road is evaluated
    this.time = time;
    // meta-information relevant to global goals
    this.params = params;

    this.links = { backwards: [], forwards: [] };

    this.users = [];
    this.maxSpeed = params.highway ? 1200 : 800;
    this.capacity = params.highway ? 12 : 6;
  }

  currentSpeed() {
    return Math.min(MIN_SPEED_PROPORTION, 1 - Math.max(0, this.users.length - 1) / this.capacity) * this.maxSpeed;
  }

  direction() {
    if (this.directionRevision !== this.roadRevision) {
      this.directionRevision = this.roadRevision;
      const vertical = new Point(0, 1);
      const vector = this.road.end.minus(this.road.start);
      const cross = vertical.cross(vector);
      // we want the opposite of the cross sign
      const sign = cross > 0 ? -1 : cross < 0 ? 1 : 0;
      this.cachedDirection = sign * vertical.angle(vector);
    }
    return this.cachedDirection;
  }

  length() {
    if (this.lengthRevision !== this.roadRevision) {
      this.lengthRevision = this.roadRevision;
      this.cachedLength = this.road.start.distance(this.road.end);
    }
    return this.cachedLength;
  }

  startIsBackwards() {
    if (this.links.backwards.length) {
      return this.links.backwards[0].road.start.equals(this.road.start) ||
             this.links.backwards[0].road.end.equals(this.road.start);
    } else {
      return this.links.forwards[0].road.start.equals(this.road.end) ||
             this.links.forwards[0].road.end.equals(this.road.end);
    }
  }

  cost() {
    return this.length() / this.currentSpeed();
  }

  costTo(other, fromFraction) {
    const segmentEnd = this.endContaining(other);
    const fraction = fromFraction ? (segmentEnd === Segment.End.START ? fromFraction : 1 - fromFraction) : 0.5;
    return this.cost() * fraction;
  }

  neighbors() {
    return this.links.forwards.concat(this.links.backwards);
  }

  endContaining(segment) {
    const backwards = this.startIsBackwards();
    if (this.links.backwards.includes(segment)) {
      return backwards ? Segment.End.START : Segment.End.END;
    } else if (this.links.forwards.includes(segment)) {
      return backwards ? Segment.End.END : Segment.End.START;
    }
  }

  linksForEndContaining(segment) {
    if (this.links.backwards.includes(segment)) {
      return this.links.backwards;
    } else if (this.links.forwards.includes(segment)) {
      return this.links.forwards;
    }
  }

  split(point, segment, segments, tree) {
    const backwards = this.startIsBackwards();

    const splitPart = SegmentFactory.fromExisting(this);
    splitPart.addSegment(segments, tree);
    splitPart.road.setEnd(point);
    this.road.setStart(point);

    splitPart.links.backwards = this.links.backwards.slice(0);
    splitPart.links.forwards = this.links.forwards.slice(0);

    // determine which links correspond to which end of the split segment
    const firstSplit = backwards ? splitPart : this;
    const secondSplit = backwards ? this : splitPart;
    const fixLinks = backwards ? splitPart.links.backwards : splitPart.links.forwards;

    fixLinks.forEach(link => {
      let index = link.links.backwards.indexOf(this);
      if (index !== -1) {
        link.links.backwards[index] = splitPart;
      } else {
        index = link.links.forwards.indexOf(this);
        link.links.forwards[index] = splitPart;
      }
    });

    firstSplit.links.forwards = [segment, secondSplit];
    secondSplit.links.backwards = [segment, firstSplit];

    segment.links.forwards.push(firstSplit);
    segment.links.forwards.push(secondSplit);
  }

  addSegment(segments, tree) {
    segments.push(this);
    tree.insert(this.collider.limits());
  }
}
