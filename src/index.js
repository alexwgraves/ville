import Point from './classes/Point.js';
import * as interaction from './interaction.js';
import * as generator from './generation.js';
import * as draw from './draw.js';

// set up canvas and interaction
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.85; // canvas is 85vw
canvas.height = window.innerHeight;
interaction.init(canvas, context);
