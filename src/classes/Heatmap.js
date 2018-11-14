import noise from './../../third_party/perlin.js';

export default class Heatmap {
  static populationAt(x, y) {
    const one = (noise.simplex2(x / 20000, y / 10000) + 1) / 2;
    const two = (noise.simplex2(x / 20000 + 500, y / 20000 + 500) + 1) / 2;
    const three = (noise.simplex2(x / 10000 + 1000, y / 20000 + 1000) + 1) / 2;
    return Math.pow((one * two + three) / 2, 2);
  }

  static popOnRoad(road) {
    return (this.populationAt(road.start.x, road.start.y) + this.populationAt(road.end.x, road.end.y)) / 2;
  }
}
