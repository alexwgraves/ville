import * as util from './../util.js';

import Point from './Point.js';

export default class Collision {
  static get Type() {
    return { RECT: 'rect', LINE: 'line', CIRCLE: 'circle' };
  }

  constructor(object, type, properties) {
    this.object = object;
    this.type = type;
    this.properties = properties;
    this.collisionRevision = 0;
    this.limitsRevision = undefined;
    this.cachedLimits = undefined;
  }

  updateCollisionProperties(properties) {
    this.collisionRevision++;
    for (const prop in properties) {
      this.properties[prop] = properties[prop];
    }
  }

  minCorner(axis) {
    let minCorner = this.properties.corners[0];
    this.properties.corners.forEach(corner => {
      if (corner[axis] < minCorner[axis]) minCorner = corner;
    });
    return minCorner;
  }

  maxCorner(axis) {
    let maxCorner = this.properties.corners[0];
    this.properties.corners.forEach(corner => {
      if (corner[axis] > maxCorner[axis]) maxCorner = corner;
    });
    return maxCorner;
  }

  limits() {
    if (this.collisionRevision !== this.limitsRevision) {
      this.limitsRevision = this.collisionRevision;
      if (this.type === Collision.Type.RECT) {
        const minX = this.minCorner('x').x;
        const minY = this.minCorner('y').y;
        this.cachedLimits = {
          x: minX,
          y: minY,
          width: this.maxCorner('x').x - minX,
          height: this.maxCorner('y').y - minY,
          object: this.object
        }
      } else if (this.type === Collision.Type.LINE) {
        this.cachedLimits = {
          x: Math.min(this.properties.start.x, this.properties.end.x),
          y: Math.min(this.properties.start.y, this.properties.end.y),
          width: Math.abs(this.properties.start.x - this.properties.end.x),
          height: Math.abs(this.properties.start.y - this.properties.end.y),
          object: this.object
        }
      } else if (this.type === Collision.Type.CIRCLE) {
        this.cachedLimits = {
          x: this.properties.center.x - this.properties.radius,
          y: this.properties.center.y - this.properties.radius,
          width: this.properties.radius * 2,
          height: this.properties.radius * 2,
          object: this.object
        }
      }
    }
    return this.cachedLimits;
  }

  collide(other) {
    // avoid expensive collision check if possible
    const limits = this.limits();
    const otherLimits = other.limits();
    if (limits && otherLimits &&
        (limits.x + limits.width < otherLimits.x || otherLimits.x + otherLimits.width < limits.x) &&
        (limits.y + limits.height < otherLimits.y || otherLimits.y + otherLimits.height < limits.y)) {
      return false;
    }

    if (this.type === Collision.Type.CIRCLE) {
      if (other.type === Collision.Type.RECT) {
        other.rectCircleCollision(this);
      }
    } else if (this.type === Collision.Type.RECT) {
      if (other.type !== Collision.Type.CIRCLE) {
        this.rectRectIntersection(other);
      } else {
        this.rectCircleCollision(other);
      }
    } else if (this.type === Collision.Type.LINE) {
      if (other.type !== Collision.Type.CIRCLE) {
        this.rectRectIntersection(other);
      }
    }
  }

  rectCircleCollision(circle) {
    // this must be a rectangle or line to call this function
    if (this.type === Collision.Type.CIRCLE) return;
    // other must be a circle to call this function
    if (circle.type !== Collision.Type.CIRCLE) return;

    // get the correct properties
    const properties = this.type === Collision.Type.LINE ? this.rectPropsFromLine() : this.properties;
    const corners = properties.corners;
    const radius = circle.properties.radius;

    // check for corner intersections with circle
    for (const corner of corners) {
      if (corner.distance2(circle.properties.center) <= radius * radius) {
        return true;
      }

      // check for edge intersections with circle
      for (let i = 0; i < corners.length; i++) {
        const start = corners[i];
        const end = corners[(i + 1) % corners.length];
        const {distance2, pointOnLine, lineProj2, length2} = circle.properties.center.distanceToLine(start, end);
        if (lineProj2 > 0 && lineProj2 < length2 && distance2 <= radius * radius) {
          return true;
        }
      }

      // check that the circle is not enclosed by the rectangle
      const axes = [corners[3].minus(corners[0]), corners[3].minus(corners[2])];
      const center0 = circle.properties.center.minus(corners[0]);
      const center2 = circle.properties.center.minus(corners[2]);
      const projections = [center0.project(axes[0]), center2.project(axes[1])];
      const dots = [center0.dot(axes[0]), center2.dot(axes[1])];
      if (dots[0] < 0 || projections[0].length2() > axes[0].length2() ||
          dots[1] < 0 || projections[1].length2() > axes[1].length2()) {
        return false;
      }
      return true;
    }
  }

  rectPropsFromLine() {
    // this must be a line to call this function
    if (this.type !== Collision.Type.LINE) return;

    const direction = this.properties.end.minus(this.properties.start);
    const perpendicular = new Point(-direction.y, direction.x);
    const halfWidth = perpendicular.scalarMultiply(0.5 * this.properties.width / perpendicular.length());
    return {
      corners: [
        this.properties.start.add(halfWidth),
        this.properties.start.minus(halfWidth),
        this.properties.end.minus(halfWidth),
        this.properties.end.add(halfWidth)
      ]
    }
  }

  rectRectIntersection(rect) {
    // this must be a rectangle or line to call this function
    if (this.type === Collision.Type.CIRCLE) return;
    // other must be a rectangle or line to call this function
    if (rect.type === Collision.Type.CIRCLE) return;

    const cornersA = this.type === Collision.Type.LINE ? this.rectPropsFromLine().corners : this.properties.corners;
    const cornersB = rect.type === Collision.Type.LINE ? rect.rectPropsFromLine().corners : rect.properties.corners;
    const axes = [
      cornersA[3].minus(cornersA[0]),
      cornersA[3].minus(cornersA[2]),
      cornersB[0].minus(cornersB[1]),
      cornersB[0].minus(cornersB[3])
    ]

    // find axes with overlaps
    const overlaps = [];
    for (const axis of axes) {
      const projectionsA = cornersA.map(corner => corner.project(axis));
      const projectionsB = cornersB.map(corner => corner.project(axis));

      const positionsA = projectionsA.map(vector => vector.dot(axis));
      const positionsB = projectionsB.map(vector => vector.dot(axis));

      const [maxA, maxA_i] = util.maxAndIndex(positionsA);
      const [minA, minA_i] = util.minAndIndex(positionsA);
      const [maxB, maxB_i] = util.maxAndIndex(positionsB);
      const [minB, minB_i] = util.minAndIndex(positionsB);

      // if the rectangles don't overlaps on at least one axis, they don't collide
      if (maxA < minB || maxB < minA) {
        return false;
      } else {
        // calculate the overlap between the rectangles on this axis
        const maxAminB = projectionsA[maxA_i].minus(projectionsB[minB_i]);
        const maxBminA = projectionsB[maxB_i].minus(projectionsA[minA_i]);
        if (maxAminB.length2() < maxBminA.length2()) overlaps.push(maxAminB);
        // the rectangles overlap on the other side, so invert the vector
        else overlaps.push(maxBminA.scalarMultiply(-1));
      }
    }

    // find axis with the least overlap
    let minVector = overlaps[0];
    overlaps.forEach(vector => {
      if (vector.length2() < minVector.length2()) minVector = vector;
    });

    // return displacement required to remove the rectangle from the collision
    return minVector.scalarMultiply(-1);
  }
}
