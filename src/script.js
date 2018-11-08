/* SETUP */

const SUPPORTS_POINTER = 'PointerEvent' in window;
const SUPPORTS_TOUCH = 'ontouchstart' in window;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.lineJoin = 'round';
this.drawing = false;

// create arrays to keep track of painting
this.xClicks = [];
this.yClicks = [];
this.dragClicks = [];

// brush logic
this.currentBrush = document.querySelector('.active').classList[1];
this.lastBrush = this.currentBrush;
const brushes = Array.prototype.slice.call(document.getElementsByClassName('brush'));
const brushColors = {
  skyscrapers: 'rgb(203,203,203)',
  residential: 'rgb(252,139,148)',
  commercial: 'rgb(191,140,190)',
  water: 'rgb(180,207,226)',
  parks: 'rgb(140,191,142)'
}
const brushSize = document.getElementById('brush-size');
const currentBrushSize = document.getElementById('current-brush-size');
this.currentSize = parseInt(brushSize.value);

// other parameters
var debugMode = false;
var scale = 20; // TODO: make this chooseable?

// data for storing canvas colors
this.clickData = { skyscrapers: [], residential: [], commercial: [], water: [], parks: [] };
this.innerPoints = { skyscrapers: [], residential: [], commercial: [], water: [], parks: [] };
this.polygons = [];
this.polygonIndex = 0;

/* CLASSES */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r / 2;
  }
}

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
}

/* FUNCTIONS */

function render() {
  for (let i = 0; i < this.xClicks.length; i++) {
    context.strokeStyle = brushColors[this.currentBrush];
    context.lineWidth = this.currentSize;

    context.beginPath();
    if (this.dragClicks[i] && i > 0) {
      context.moveTo(this.xClicks[i - 1], this.yClicks[i - 1]);
    } else {
      context.moveTo(this.xClicks[i] - 1, this.yClicks[i] - 1);
    }

    context.lineTo(this.xClicks[i], this.yClicks[i]);
    context.closePath();
    context.stroke();
  }
}

function addClick(x, y, dragging) {
  this.xClicks.push(x);
  this.yClicks.push(y);
  this.dragClicks.push(dragging);

  // add to data for generation
  this.clickData[this.currentBrush].push(new Circle(x, y, this.currentSize));
}

function clearActiveBrushes() {
  brushes.forEach(brush => {
    brush.classList.remove('active');
  });
}

function onEventDown(event) {
  const i = this.clickData[this.lastBrush].length - 1;
  if (i > -1) this.polygons.push(detectEdges(this.clickData[this.lastBrush][i], this.lastBrush));

  const mouseX = event.pageX - canvas.offsetLeft;
  const mouseY = event.pageY - canvas.offsetTop;
  this.drawing = true;
  addClick(mouseX, mouseY);
  render();
}

function onEventMove(event) {
  if (this.drawing) {
    addClick(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, true);
    render();
  }
}

function onEventUp(event) {
  this.drawing = false;
  // clear clicks on up so we don't redraw anything
  this.xClicks = [];
  this.yClicks = [];
  this.dragClicks = [];
}

function detectEdges(circle, color) {
  const edges = [];
  const rgb = brushColors[color].slice(4, -1).split(',');

  // start at the rightmost pixel of the circle
  let x = circle.x + circle.r - 1;
  let y = circle.y;

  // find the rightmost pixel of this color
  // TODO: do this better
  let currX = circle.x + circle.r - 1;
  let n = context.getImageData(currX++, y, 1, 1).data;
  while (n[0] == rgb[0] && n[1] == rgb[1] && n[2] == rgb[2]) {
    x = currX;
    n = context.getImageData(currX++, y, 1, 1).data;
  }

  const start = new Point(x - 1, y);

  // recursive function to determine a polygon's edges
  const addEdge = (point, prev) => {
    const neighbors = [
      new Point(point.x + 1, point.y    ),
      new Point(point.x + 1, point.y + 1),
      new Point(point.x,     point.y + 1),
      new Point(point.x - 1, point.y + 1),
      new Point(point.x - 1, point.y    ),
      new Point(point.x - 1, point.y - 1),
      new Point(point.x,     point.y - 1),
      new Point(point.x + 1, point.y - 1)
    ];

    // order neighbors so that it starts right after prev
    const prevIndex = neighbors.findIndex(p => p.x === prev.x && p.y === prev.y);
    if (prevIndex < 7) {
      for (let i = 0; i < prevIndex + 1; i++) {
        neighbors.splice(7, 0, neighbors.shift());
      }
    }

    // check if any of the eight surrounding pixels are a different color
    const firstNot = neighbors.findIndex(p => {
      const pixel = context.getImageData(p.x, p.y, 1, 1).data;
      return Math.abs(pixel[0] - rgb[0]) > 5 ||
             Math.abs(pixel[1] - rgb[1]) > 5 ||
             Math.abs(pixel[2] - rgb[2]) > 5;
    });

    // find the first neighbor that is the same color and not the previous point
    const firstSame = neighbors.findIndex(p => {
      const pixel = context.getImageData(p.x, p.y, 1, 1).data;
      return (p.x !== prev.x || p.y !== prev.y) &&
        Math.abs(pixel[0] - rgb[0]) < 6 &&
        Math.abs(pixel[1] - rgb[1]) < 6 &&
        Math.abs(pixel[2] - rgb[2]) < 6;
    });

    if (firstNot !== -1) {
      edges.push(new Point(point.x, point.y));
      const next = neighbors[firstSame];
      // continue until we reach the original starting point
      if (next.x === start.x && next.y === start.y) return;
      return addEdge(next, point);
    }
  }

  addEdge(start, start);
  return new Polygon(edges, color);
}

function generateCity() {
  // detect edges for the last click
  const i = this.clickData[this.currentBrush].length - 1;
  if (i > -1) this.polygons.push(detectEdges(this.clickData[this.currentBrush][i], this.currentBrush));

  for (const polygon of this.polygons) {
    polygon.boundingBox();
    polygon.scatterPoints();
  }
}

/* EVENT LISTENERS */

// update the canvas size on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
});

if (SUPPORTS_POINTER) {
  canvas.addEventListener('pointerdown', event => { onEventDown(event) });
  canvas.addEventListener('pointermove', event => { onEventMove(event) });
  canvas.addEventListener('pointerup', event => { onEventUp(event) });
  canvas.addEventListener('pointercancel', event => { onEventUp(event) });
} else if (SUPPORTS_TOUCH) {
  canvas.addEventListener('touchstart', event => { onEventDown(event) });
  canvas.addEventListener('touchmove', event => { onEventMove(event) });
  canvas.addEventListener('touchend', event => { onEventUp(event) });
  canvas.addEventListener('touchcancel', event => { onEventUp(event) });
} else {
  canvas.addEventListener('mousedown', event => { onEventDown(event) });
  canvas.addEventListener('mousemove', event => { onEventMove(event) });
  canvas.addEventListener('mouseup', event => { onEventUp(event) });
  canvas.addEventListener('mouseleave', event => { onEventUp(event) });
}

brushes.forEach(brush => {
  brush.addEventListener('click', () => {
    clearActiveBrushes();
    this.lastBrush = this.currentBrush;
    this.currentBrush = brush.classList[1];
    brush.classList.add('active');
  });
});

brushSize.addEventListener('input', event => {
  this.currentSize = parseInt(brushSize.value);
  currentBrushSize.innerText = brushSize.value;
});

document.getElementById('debug').addEventListener('change', event => {
  debugMode = event.target.checked;
  document.getElementById('debug-controls').style.display = debugMode ? 'block' : 'none';
});

document.getElementById('generate').addEventListener('click', event => {
  generateCity();
  event.target.disabled = true;
  event.target.classList.add('disabled');
});

document.getElementById('edges').addEventListener('click', event => {
  // DEBUG MODE: draw edge outlines
  if (debugMode) {
    for (const polygon of this.polygons) {
      for (const point of polygon.edges) {
        context.fillStyle = '#000';
        context.fillRect(point.x, point.y, 1, 1);
      }
    }
  }
});
