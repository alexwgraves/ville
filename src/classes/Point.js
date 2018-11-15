const EPSILON = 0.00000001;

export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  length() {
    return Math.sqrt(this.length2());
  }

  length2() {
    return this.x * this.x + this.y * this.y;
  }

  distance(other) {
    const v = other.minus(this);
    return v.length();
  }

  distance2(other) {
    const v = other.minus(this);
    return v.length2();
  }

  equals(other) {
    const diff = this.minus(other);
    return diff.length2() < EPSILON;
  }

  scalarMultiply(s) {
    return new Point(this.x * s, this.y * s);
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  cross(other) {
    return this.x * other.y - this.y * other.x;
  }

  angle(other) {
    const radians = Math.acos(this.dot(other) / (this.length() * other.length()));
    return radians * 180 / Math.PI;
  }

  project(other) {
    return other.scalarMultiply(this.dot(other) / other.length());
  }

  distanceToLine(start, end) {
    const toStart = this.minus(start);
    const line = end.minus(start);
    const projected = toStart.project(line);
    const result = start.add(projected);
    const dot = toStart.dot(line);
    const sign = dot < 0 ? -1 : dot > 0 ? 1 : 0;

    return {
      distance2: result.distance2(this),
      pointOnLine: result,
      // distance along line of projected point
      lineProj2:  sign * projected.length2(),
      length2: line.length2()
    }
  }
}
