import * as noise from './../perlin.js';

export default class Heatmap {
  static populationAt(x, y) {
    const one = (noise.simplex2(x / 500, y / 500) + 1) / 2;
    const two = (noise.simplex2(x / 1000 + 50, y / 1000 + 50) + 1) / 2;
    const three = (noise.simplex2(x / 1000 + 100, y / 1000 + 100) + 1) / 2;
    return Math.pow((one * two + three) / 2, 2);
  }

  static popOnRoad(road) {
    return (Heatmap.populationAt(road.start.x, road.start.y) + Heatmap.populationAt(road.end.x, road.end.y)) / 2;
  }
}
