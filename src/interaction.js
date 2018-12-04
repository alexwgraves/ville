import Point from './classes/Point.js';
import Circle from './classes/Circle.js';
import Polygon from './classes/Polygon.js';
import * as generator from './generation.js';
import * as draw from './draw.js';
import * as scene from './scene.js';

const SUPPORTS_POINTER = 'PointerEvent' in window;
const SUPPORTS_TOUCH = 'ontouchstart' in window;
const options = {
  drawing: false,
  // create arrays to keep track of painting
  xClicks: [],
  yClicks: [],
  dragClicks: [],
  // brush parameters
  currentBrush: document.querySelector('.active').classList[1],
  lastBrush: document.querySelector('.active').classList[1],
  currentSize: parseInt(document.getElementById('brush-size').value),
  brushes: Array.prototype.slice.call(document.getElementsByClassName('brush')),
  brushColors: {
    skyscrapers: 'rgb(203,203,203)',
    residential: 'rgb(252,139,148)',
    commercial: 'rgb(191,140,190)',
    water: 'rgb(180,207,226)',
    parks: 'rgb(140,191,142)'
  },
  // data for storing canvas colors
  clickData: { skyscrapers: [], residential: [], commercial: [], water: [], parks: [] },
  innerPoints: { skyscrapers: [], residential: [], commercial: [], water: [], parks: [] },
  polygons: [],
  polygonIndex: 0,
  scale: 20,
  segments: [],
  buildings: []
}

/* FUNCTIONS */

function render() {
  for (let i = 0; i < options.xClicks.length; i++) {
    options.context.strokeStyle = options.brushColors[options.currentBrush];
    options.context.lineWidth = options.currentSize;

    options.context.beginPath();
    if (options.dragClicks[i] && i > 0) {
      options.context.moveTo(options.xClicks[i - 1], options.yClicks[i - 1]);
    } else {
      options.context.moveTo(options.xClicks[i] - 1, options.yClicks[i] - 1);
    }

    options.context.lineTo(options.xClicks[i], options.yClicks[i]);
    options.context.closePath();
    options.context.stroke();
  }
}

function addClick(x, y, dragging) {
  options.xClicks.push(x);
  options.yClicks.push(y);
  options.dragClicks.push(dragging);

  // add to data for generation
  options.clickData[options.currentBrush].push(new Circle(x, y, options.currentSize));
}

function clearActiveBrushes() {
  options.brushes.forEach(brush => {
    brush.classList.remove('active');
  });
}

function onEventDown(event) {
  const i = options.clickData[options.lastBrush].length - 1;
  if (i > -1) options.polygons.push(detectEdges(options.clickData[options.lastBrush][i], options.lastBrush));

  const mouseX = event.pageX - canvas.offsetLeft;
  const mouseY = event.pageY - canvas.offsetTop;
  options.drawing = true;
  addClick(mouseX, mouseY);
  render();
}

function onEventMove(event) {
  if (options.drawing) {
    addClick(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, true);
    render();
  }
}

function onEventUp(event) {
  options.drawing = false;
  // clear clicks on up so we don't redraw anything
  options.xClicks = [];
  options.yClicks = [];
  options.dragClicks = [];
}

function detectEdges(circle, color) {
  const edges = [];
  const rgb = options.brushColors[color].slice(4, -1).split(',');

  // start at the rightmost pixel of the circle
  let x = circle.x + circle.r - 1;
  let y = circle.y;

  // find the rightmost pixel of this color
  // TODO: do this better
  let currX = circle.x + circle.r - 1;
  let n = options.context.getImageData(currX++, y, 1, 1).data;
  while (n[0] == rgb[0] && n[1] == rgb[1] && n[2] == rgb[2]) {
    x = currX;
    n = options.context.getImageData(currX++, y, 1, 1).data;
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
      const pixel = options.context.getImageData(p.x, p.y, 1, 1).data;
      return Math.abs(pixel[0] - rgb[0]) > 5 ||
             Math.abs(pixel[1] - rgb[1]) > 5 ||
             Math.abs(pixel[2] - rgb[2]) > 5;
    });

    // find the first neighbor that is the same color and not the previous point
    const firstSame = neighbors.findIndex(p => {
      const pixel = options.context.getImageData(p.x, p.y, 1, 1).data;
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

function interpretInput() {
  // detect edges for the last click
  const i = options.clickData[options.currentBrush].length - 1;
  if (i > -1) options.polygons.push(detectEdges(options.clickData[options.currentBrush][i], options.currentBrush));
  options.polygons.forEach(polygon => polygon.boundingBox(options));
}

export function init(canvas, context) {
  /* SETUP */
  context.lineJoin = 'round';
  options.canvas = canvas;
  options.context = context;

  // brush logic
  const brushSize = document.getElementById('brush-size');
  const currentBrushSize = document.getElementById('current-brush-size');

  /* EVENT LISTENERS */

  // update the canvas size on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.85;
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

  options.brushes.forEach(brush => {
    brush.addEventListener('click', () => {
      clearActiveBrushes();
      options.lastBrush = options.currentBrush;
      options.currentBrush = brush.classList[1];
      brush.classList.add('active');
    });
  });

  brushSize.addEventListener('input', event => {
    options.currentSize = parseInt(brushSize.value);
    currentBrushSize.innerText = brushSize.value;
  });

  document.getElementById('generate').addEventListener('click', event => {
    // disable generation button
    event.target.classList.add('disabled');

    // detect edges for the last click
    const i = options.clickData[options.currentBrush].length - 1;
    if (i > -1) options.polygons.push(detectEdges(options.clickData[options.currentBrush][i], options.currentBrush));

    // create road networks seeded from each polygon
    options.polygons.forEach(polygon => {
      if (polygon.color !== Polygon.Type.PARKS && polygon.color !== Polygon.Type.WATER) {
        // only generate roads for skyscrapers, commercial, and residential
        const { segments, buildings } = generator.generate(polygon.getCenter(options), polygon.color);
        options.segments.push(...segments);
        options.buildings.push(...buildings);

        // draw generation roads and building on map
        segments.forEach(segment => draw.drawSegment(options.context, segment));
        buildings.forEach(building => draw.drawBuilding(options.context, building));
      }
    });
  });

  document.getElementById('3d').addEventListener('click', event => {
    scene.init();
    scene.create(options.segments, options.buildings);
  });
}
