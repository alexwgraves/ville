import Point from './Point.js';

export default class Polygon {
  static get Type() {
    return {
      SKYSCRAPER: 'skyscraper',
      RESIDENTIAL: 'residential',
      COMMERCIAL: 'commercial',
      WATER: 'water',
      PARKS: 'parks'
    }
  }

  static get Color() {
    return {
      skyscraper: 'rgb(203,203,203)',
      residential: 'rgb(252,139,148)',
      commercial: 'rgb(191,140,190)',
      water: 'rgb(180,207,226)',
      parks: 'rgb(140,191,142)'
    }
  }

  constructor(edges, color) {
    this.edges = edges;
    this.color = color;
  }

  getCenter() {
    let minX = Infinity, maxX = 0;
    let minY = Infinity, maxY = 0;
    for (const point of this.edges) {
      minX = point.x < minX ? point.x : minX;
      maxX = point.x > maxX ? point.x : maxX;
      minY = point.y < minY ? point.y : minY;
      maxY = point.y > maxY ? point.y : maxY;
    }

    // find center from average of min and max
    return new Point((minX + maxX) / 2, (minY + maxY) / 2);
  }

  bounds() {
    let minX = Infinity, maxX = 0;
    let minY = Infinity, maxY = 0;
    for (const point of this.edges) {
      minX = point.x < minX ? point.x : minX;
      maxX = point.x > maxX ? point.x : maxX;
      minY = point.y < minY ? point.y : minY;
      maxY = point.y > maxY ? point.y : maxY;
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }
}
