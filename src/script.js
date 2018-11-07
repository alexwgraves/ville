/* SETUP */

const SUPPORTS_POINTER = 'PointerEvent' in window;
const SUPPORTS_TOUCH = 'ontouchstart' in window;
var debugMode = false;

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

// data for storing canvas colors
this.clickData = { skyscrapers: [], residential: [], commercial: [], water: [], parks: [] };
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

  boundingBox() {
    this.boundaries = [
      new Point(0, 0), // top left
      new Point(0, 0), // top right
      new Point(0, 0), // bottom right
      new Point(0, 0)  // bottom left
    ];
    const edges = this.edges;

    // sort edges array on x
    edges.sort((a, b) => a.x === b.x ? 0 : a.x < b.x ? -1 : 1);
    this.boundaries[0].x = edges[0].x;
    this.boundaries[1].x = edges[edges.length - 1].x;
    this.boundaries[2].x = edges[edges.length - 1].x;
    this.boundaries[3].x = edges[0].x;
    const width = edges[edges.length - 1].x - edges[0].x;

    // sort edges array on y
    edges.sort((a, b) => a.y === b.y ? 0 : a.y < b.y ? -1 : 1);
    this.boundaries[0].y = edges[0].y;
    this.boundaries[1].y = edges[0].y;
    this.boundaries[2].y = edges[edges.length - 1].y;
    this.boundaries[3].y = edges[edges.length - 1].y;
    const height = edges[edges.length - 1].y - edges[0].y;

    // DEBUG MODE: draw bounding box
    if (debugMode) {
      context.lineWidth = 1;
      context.strokeStyle = '#FF0000';
      context.strokeRect(this.boundaries[0].x, this.boundaries[0].y, width, height);
      context.lineWidth = this.currentSize;
    }
  }

  scatterPoints() {
    // scatter points using stratified sampling within bounding box
    // delete points if they're not within the shape
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
  // TODO: maybe put this here, maybe do it at the generation step
  // const i = this.clickData[this.currentBrush].length - 1;
  // this.polygons.push(detectEdges(this.clickData[this.currentBrush][i], this.currentBrush));
}

function detectEdges(circle, color) {
  // TODO: if i get a new canvas context at this time, does it snapshot the canvas?
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
      return pixel[0] == 0 && pixel[1] == 0 && pixel[2] == 0;
      // TODO: currently not handling checking against other colors
      // return pixel[0] != rgb[0] && pixel[1] != rgb[1] && pixel[2] != rgb[2];
    });

    // find the first neighbor that is the same color and not the previous point
    const firstSame = neighbors.findIndex(p => {
      const pixel = context.getImageData(p.x, p.y, 1, 1).data;
      return (p.x !== prev.x || p.y !== prev.y) &&
        pixel[0] != 0 && pixel[1] != 0 && pixel[2] != 0;
        // TODO: currently not handling checking against other colors
        // pixel[0] == rgb[0] && pixel[1] == rgb[1] && pixel[2] == rgb[2];
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
  const i = this.clickData[this.currentBrush].length - 1;
  this.polygons.push(detectEdges(this.clickData[this.currentBrush][i], this.currentBrush));
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
});

document.getElementById('generate').addEventListener('click', event => {
  // TODO: currently, this just runs edge detection on the last-drawn point
  generateCity();
});

document.getElementById('edges').addEventListener('click', event => {
  // debug feature; see edges created from detection algorithm
  for (let i = this.polygonIndex; i < this.polygons.length; i++) {
    // generate bounding box
    this.polygons[i].boundingBox();
    for (let point of this.polygons[i].edges) {
      context.fillStyle = '#000';
      context.fillRect(point.x, point.y, 1, 1);
    }
  }
  this.polygonIndex = this.polygons.length;
});
