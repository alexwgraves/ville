import Point from './classes/Point.js';
import Circle from './classes/Circle.js';
import Polygon from './classes/Polygon.js';
import QuadTree from './classes/QuadTree.js';
import * as generator from './generation.js';
import * as draw from './draw.js';
import * as scene from './scene.js';
import { colorsEqual, colorsDifferent } from './util.js';

import { QUADTREE_PARAMS, QUADTREE_MAX_OBJECTS, QUADTREE_MAX_LEVELS } from './config.js';

const SUPPORTS_POINTER = 'PointerEvent' in window;
const SUPPORTS_TOUCH = 'ontouchstart' in window;
const options = {
  drawing: false,
  // create arrays to keep track of painting
  xClicks: [],
  yClicks: [],
  dragClicks: [],
  // brush parameters
  currentBrush: document.querySelector('.active').getAttribute('data-type'),
  lastBrush: document.querySelector('.active').getAttribute('data-type'),
  currentSize: parseInt(document.getElementById('brush-size').value),
  brushes: Array.prototype.slice.call(document.getElementsByClassName('brush')),
  // data for storing canvas colors
  clickData: { skyscraper: [], residential: [], commercial: [], water: [], parks: [] },
  polygons: [],
  scale: 20,
  segments: [],
  buildings: []
}

/* FUNCTIONS */

function render() {
  for (let i = 0; i < options.xClicks.length; i++) {
    options.context.strokeStyle = Polygon.Color[options.currentBrush];
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

  const mouseX = event.pageX - options.canvas.offsetLeft;
  const mouseY = event.pageY - options.canvas.offsetTop;
  options.drawing = true;
  addClick(mouseX, mouseY);
  render();
}

function onEventMove(event) {
  if (options.drawing) {
    addClick(event.pageX - options.canvas.offsetLeft, event.pageY - options.canvas.offsetTop, true);
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
  const rgb = Polygon.Color[color].slice(4, -1).split(',');

  // start at the rightmost pixel of the circle
  let x = circle.x + circle.r - 1;
  let y = circle.y;

  // find the rightmost pixel of this color
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
      return colorsDifferent(pixel, rgb);
    });

    // find the first neighbor that is the same color and not the previous point
    const firstSame = neighbors.findIndex(p => {
      const pixel = options.context.getImageData(p.x, p.y, 1, 1).data;
      return (p.x !== prev.x || p.y !== prev.y) && colorsEqual(pixel, rgb);
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

export function init(canvas, context) {
  /* SETUP */
  context.lineJoin = 'round';
  options.canvas = canvas;
  options.context = context;

  options.map = document.getElementById('map');
  options.mapContext = options.map.getContext('2d');
  options.map.width = window.innerWidth * 0.85; // canvas is 85vw
  options.map.height = window.innerHeight;

  // brush logic
  const brushSize = document.getElementById('brush-size');
  const currentBrushSize = document.getElementById('current-brush-size');

  /* EVENT LISTENERS */

  // update the canvas size on window resize
  window.addEventListener('resize', () => {
    options.context.lineJoin = 'round';
    options.canvas.width = window.innerWidth * 0.85;
    options.canvas.height = window.innerHeight;
    render();
  });

  if (SUPPORTS_POINTER) {
    options.canvas.addEventListener('pointerdown', event => { onEventDown(event) });
    options.canvas.addEventListener('pointermove', event => { onEventMove(event) });
    options.canvas.addEventListener('pointerup', event => { onEventUp(event) });
    options.canvas.addEventListener('pointercancel', event => { onEventUp(event) });
  } else if (SUPPORTS_TOUCH) {
    options.canvas.addEventListener('touchstart', event => { onEventDown(event) });
    options.canvas.addEventListener('touchmove', event => { onEventMove(event) });
    options.canvas.addEventListener('touchend', event => { onEventUp(event) });
    options.canvas.addEventListener('touchcancel', event => { onEventUp(event) });
  } else {
    options.canvas.addEventListener('mousedown', event => { onEventDown(event) });
    options.canvas.addEventListener('mousemove', event => { onEventMove(event) });
    options.canvas.addEventListener('mouseup', event => { onEventUp(event) });
    options.canvas.addEventListener('mouseleave', event => { onEventUp(event) });
  }

  options.brushes.forEach(brush => {
    brush.addEventListener('click', () => {
      clearActiveBrushes();
      options.lastBrush = options.currentBrush;
      options.currentBrush = brush.getAttribute('data-type');
      brush.classList.add('active');
    });
  });

  brushSize.addEventListener('input', event => {
    options.currentSize = parseInt(brushSize.value);
    currentBrushSize.innerText = brushSize.value;
  });

  document.getElementById('reset').addEventListener('click', event => {
    options.clickData = { skyscraper: [], residential: [], commercial: [], water: [], parks: [] };
    options.polygons = [];
    options.segments = [];
    options.buildings = [];
    options.canvas.style.zIndex = 1;
    options.map.style.zIndex = '';
    options.context.clearRect(0, 0, options.canvas.width, options.canvas.height);
    options.mapContext.clearRect(0, 0, options.map.width, options.map.height);
  });

  document.getElementById('generate').addEventListener('click', event => {
    // clear previous map and move map to the top
    options.mapContext.clearRect(0, 0, options.map.width, options.map.height);
    options.canvas.style.zIndex = 0;
    options.map.style.zIndex = 1;
    options.segments = [];
    options.buildings = [];

    // detect edges for the last click
    const i = options.clickData[options.currentBrush].length - 1;
    if (i > -1) options.polygons.push(detectEdges(options.clickData[options.currentBrush][i], options.currentBrush));

    // create road networks seeded from each polygon
    const tree = new QuadTree(QUADTREE_PARAMS, QUADTREE_MAX_OBJECTS, QUADTREE_MAX_LEVELS);
    options.polygons.forEach(polygon => {
      if (polygon.color !== Polygon.Type.PARKS && polygon.color !== Polygon.Type.WATER) {
        // only generate roads for skyscraper, commercial, and residential
        const { segments, buildings } = generator.generate(polygon, options.context, tree);
        options.segments.push(...segments);
        options.buildings.push(...buildings);

        // draw generation roads and building on map
        segments.forEach(segment => draw.drawSegment(options.mapContext, segment));
        buildings.forEach(building => draw.drawBuilding(options.mapContext, building));
      }
    });

    // don't enable the render button until done generating
    document.getElementById('3d').classList.remove('disabled');
  });

  document.getElementById('3d').addEventListener('click', event => {
    // disable render and generate buttons
    event.target.classList.add('disabled');
    document.getElementById('generate').classList.add('disabled');

    scene.init();
    const polygons = options.polygons.filter(polygon => polygon.color === Polygon.Type.PARKS || polygon.color === Polygon.Type.WATER);
    scene.create(options.segments, options.buildings, polygons);
  });

  document.getElementById('toggle').addEventListener('click', event => {
    if (event.target.innerHTML.includes('Hide')) {
      event.target.innerHTML = 'Show 3D';
      document.getElementById('scene').style.zIndex = -5;
    } else {
      event.target.innerHTML = 'Hide 3D';
      document.getElementById('scene').style.zIndex = 5;
    }
  });

  document.getElementById('restart').addEventListener('click', event => {
    location.reload();
  });
}
