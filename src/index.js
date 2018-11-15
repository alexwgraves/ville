import Point from './classes/Point.js';
import * as generator from './generation.js';
import * as draw from './draw.js';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.85; // canvas is 85vw
canvas.height = window.innerHeight;

document.getElementById('generate').addEventListener('click', event => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  // seed is the point at which the highway starts
  const seed = new Point(canvas.width / 2, canvas.height / 2);
  const segments = generator.generate(seed);
  segments.forEach(segment => draw.drawSegment(context, segment));
});
