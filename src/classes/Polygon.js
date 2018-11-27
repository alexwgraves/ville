import Point from './Point.js';

export default class Polygon {
  constructor(edges, color) {
    this.edges = edges;
    this.color = color;
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

    // DEBUG MODE: draw bounding box
    if (options.debugMode) {
      options.context.lineWidth = 1;
      options.context.strokeStyle = '#FF0000';
      options.context.strokeRect(minX, minY, maxX - minX, maxY - minY);
      options.context.lineWidth = options.currentSize;
    }
  }

  /* Uses stratified sampling to scatter points within the Polygon for roads. */
  scatterPoints(options) {
    // we don't want to generate roads in parks or water
    if (this.color === 'parks' || this.color === 'water') return;

    const points = [];
    // scatter points using stratified sampling within bounding box
    const minX = this.boundaries[0].x, minY = this.boundaries[0].y;
    const maxX = this.boundaries[1].x, maxY = this.boundaries[3].y;
    for (let x = minX; x < maxX; x+=options.scale) {
      for (let y = minY; y < maxY; y+=options.scale) {
        // TODO: change scatter based on brush? (ex. less scatter on skyscrapers)
        const offsetX = Math.min(x + Math.random() * options.scale, maxX);
        const offsetY = Math.min(y + Math.random() * options.scale, maxY);
        points.push(new Point(Math.round(offsetX), Math.round(offsetY)));
      }
    }

    // DEBUG MODE: draw all of the stratified sampled points
    if (options.debugMode) {
      for (const point of points) {
        options.context.fillStyle = '#000';
        options.context.fillRect(point.x, point.y, 1, 1);
      }
    }

    // map edge points y values to their x values
    const edgesMap = {};
    this.edges.forEach(point => {
      if (edgesMap[point.y]) {
        edgesMap[point.y].push(point.x);
      } else {
        edgesMap[point.y] = [point.x];
      }
    });

    // starting at the point, go right and count the edges we hit
    // TODO: handle when points cross tangent to the polygon
    this.points = [];
    points.forEach(point => {
      // keep track of the last time we crossed the polygon's edge
      let lastCrossing = 0;
      let intersections = 0;
      for (let i = point.x; i < maxX + 1; i++) {
        if (edgesMap[point.y].includes(i)) {
          // only count the intersection if the point isn't immediately next
          if (i - lastCrossing > 1) intersections++;
          lastCrossing = i;
        }
      }
      // points are in the polygon if they hit an odd number of edges
      if (intersections % 2 !== 0) this.points.push(point);
    });

    // DEBUG MODE: draw the points within the polygon in red
    if (options.debugMode) {
      for (const point of this.points) {
        options.context.fillStyle = '#FF0000';
        options.context.fillRect(point.x, point.y, 1, 1);
      }
    }
  }
}
