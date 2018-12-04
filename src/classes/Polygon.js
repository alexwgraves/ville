import Point from './Point.js';

export default class Polygon {
  static get Type() {
    return {
      SKYSCRAPERS: 'skyscrapers',
      RESIDENTIAL: 'residential',
      COMMERCIAL: 'commercial',
      WATER: 'water',
      PARKS: 'parks'
    }
  }

  constructor(edges, color) {
    this.edges = edges;
    this.color = color;
  }

  getCenter(options) {
    let minX = options.canvas.width, maxX = 0;
    let minY = options.canvas.height, maxY = 0;
    for (const point of this.edges) {
      minX = point.x < minX ? point.x : minX;
      maxX = point.x > maxX ? point.x : maxX;
      minY = point.y < minY ? point.y : minY;
      maxY = point.y > maxY ? point.y : maxY;
    }

    // find center from average of min and max
    return new Point((minX + maxX) / 2, (minY + maxY) / 2);
  }

  /* Calculates the bounding box for a given Polygon. */
  boundingBox(options) {
    let minX = options.canvas.width, maxX = 0;
    let minY = options.canvas.height, maxY = 0;
    for (const point of this.edges) {
      minX = point.x < minX ? point.x : minX;
      maxX = point.x > maxX ? point.x : maxX;
      minY = point.y < minY ? point.y : minY;
      maxY = point.y > maxY ? point.y : maxY;
    }
    this.boundaries = [
      new Point(minX, minY), // top left
      new Point(maxX, minY), // top right
      new Point(maxX, maxY), // bottom right
      new Point(minX, maxY)  // bottom left
    ];
  }
}
