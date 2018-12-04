import Collision from './Collision.js';
import Point from './Point.js';

export default class Building {
  static get Type() {
    return { RESIDENTIAL: 'residential', SKYSCRAPER: 'skyscraper' };
  }

  constructor(center, direction, diagonal, type, aspectRatio = 1) {
    this.center = center;
    this.direction = direction;
    this.diagonal = diagonal;
    this.type = type;

    // degrees to deviate either end to produce desired aspect ratio
    this.aspectDegree = Math.atan(aspectRatio) * 180 / Math.PI;
    this.corners = this.generateCorners();

    this.collider = new Collision(this, Collision.Type.RECT, { corners: this.corners });
    this.supply = [];
    this.demand = [];
  }

  generateCorners() {
    return [
      new Point(
        this.center.x + this.diagonal * Math.sin((+this.aspectDegree + this.direction) * Math.PI / 180),
        this.center.y + this.diagonal * Math.cos((+this.aspectDegree + this.direction) * Math.PI / 180)),
      new Point(
        this.center.x + this.diagonal * Math.sin((-this.aspectDegree + this.direction) * Math.PI / 180),
        this.center.y + this.diagonal * Math.cos((-this.aspectDegree + this.direction) * Math.PI / 180)),
      new Point(
        this.center.x + this.diagonal * Math.sin((180 + this.aspectDegree + this.direction) * Math.PI / 180),
        this.center.y + this.diagonal * Math.cos((180 + this.aspectDegree + this.direction) * Math.PI / 180)),
      new Point(
        this.center.x + this.diagonal * Math.sin((180 - this.aspectDegree + this.direction) * Math.PI / 180),
        this.center.y + this.diagonal * Math.cos((180 - this.aspectDegree + this.direction) * Math.PI / 180))
    ]
  }

  setCenter(center) {
    this.center = center;
    this.corners = this.generateCorners();
    this.collider.updateCollisionProperties({ corners: this.corners });
  }

  setDirection(direction) {
    this.direction = direction;
    this.corners = this.generateCorners();
    this.collider.updateCollisionProperties({ corners: this.corners });
  }
}
