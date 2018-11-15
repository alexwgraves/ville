import * as noise from './../perlin.js';

export default class Heatmap {
  static populationAt(x, y) {
    const one = (noise.simplex2(x / 10000, y / 10000) + 1) / 2;
    const two = (noise.simplex2(x / 20000 + 500, y / 20000 + 500) + 1) / 2;
    const three = (noise.simplex2(x / 20000 + 1000, y / 20000 + 1000) + 1) / 2;
    return Math.pow((one * two + three) / 2, 2);
  }

  static popOnRoad(road) {
    return (Heatmap.populationAt(road.start.x, road.start.y) + Heatmap.populationAt(road.end.x, road.end.y)) / 2;
  }
}
