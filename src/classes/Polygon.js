class Polygon {
  constructor(edges, color) {
    this.edges = edges;
    this.color = color;
  }

  /* Calculates the bounding box for a given Polygon. */
  boundingBox() {
    let minX = canvas.width, maxX = 0;
    let minY = canvas.height, maxY = 0;
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
    if (debugMode) {
      context.lineWidth = 1;
      context.strokeStyle = '#FF0000';
      context.strokeRect(minX, minY, maxX - minX, maxY - minY);
      context.lineWidth = this.currentSize;
    }
  }

  /* Uses stratified sampling to scatter points within the Polygon for roads. */
  scatterPoints() {
    // we don't want to generate roads in parks or water
    if (this.color === 'parks' || this.color === 'water') return;

    const points = [];
    // scatter points using stratified sampling within bounding box
    const minX = this.boundaries[0].x, minY = this.boundaries[0].y;
    const maxX = this.boundaries[1].x, maxY = this.boundaries[3].y;
    for (let x = minX; x < maxX; x+=scale) {
      for (let y = minY; y < maxY; y+=scale) {
        // TODO: change scatter based on brush? (ex. less scatter on skyscrapers)
        const offsetX = Math.min(x + Math.random() * scale, maxX);
        const offsetY = Math.min(y + Math.random() * scale, maxY);
        points.push(new Point(Math.round(offsetX), Math.round(offsetY)));
      }
    }

    // DEBUG MODE: draw all of the stratified sampled points
    if (debugMode) {
      for (const point of points) {
        context.fillStyle = '#000';
        context.fillRect(point.x, point.y, 1, 1);
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
    if (debugMode) {
      for (const point of this.points) {
        context.fillStyle = '#FF0000';
        context.fillRect(point.x, point.y, 1, 1);
      }
    }
  }

  createHighway() {
    // sort points on x or y randomly but equally
    const random = Math.random();
    this.points.sort((a, b) => {
      if (random < 0.5) return a.x === b.x ? 0 : a.x < b.x ? -1 : 1;
      return a.y === b.y ? 0 : a.y < b.y ? -1 : 1;
    });

    // DEBUG MODE: draw the main highway
    if (debugMode) {
      context.lineWidth = 1;
      context.strokeStyle = '#000';
      context.beginPath();
      context.moveTo(this.points[0].x, this.points[0].y);
      context.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
      context.closePath();
      context.stroke();
      context.lineWidth = this.currentSize;
    }
  }
}
