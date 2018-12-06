import * as interaction from './interaction.js';

// set up canvas and interaction
const canvas = document.getElementById('interaction');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.85; // canvas is 85vw
canvas.height = window.innerHeight;
interaction.init(canvas, context);
