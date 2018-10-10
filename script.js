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
const brushes = Array.prototype.slice.call(document.getElementsByClassName('brush'));
const brushColors = {
  skyscrapers: 'rgb(203, 203, 203)',
  residential: 'rgb(252, 139, 148)',
  commercial: 'rgb(191, 140, 190)',
  water: 'rgb(180, 207, 226)',
  parks: 'rgb(140, 191, 142)'
}
const brushSize = document.getElementById('brush-size');
const currentBrushSize = document.getElementById('current-brush-size');
this.currentSize = parseInt(brushSize.value);

// data for storing canvas colors
this.data = { skyscrapers: [], residential: [], commercial: [], water: [], parks: [] };

/* CLASSES */
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

/* FUNCTIONS */

const render = () => {
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

const addClick = (x, y, dragging) => {
  this.xClicks.push(x);
  this.yClicks.push(y);
  this.dragClicks.push(dragging);

  // add to data for generation
  this.data[this.currentBrush].push(new Circle(x, y, this.currentSize));
}

const clearActiveBrushes = () => {
  brushes.forEach(brush => {
    brush.classList.remove('active');
  });
}

const onEventDown = event => {
  const mouseX = event.pageX - canvas.offsetLeft;
  const mouseY = event.pageY - canvas.offsetTop;
  this.drawing = true;
  addClick(mouseX, mouseY);
  render();
}

const onEventMove = event => {
  if (this.drawing) {
    addClick(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, true);
    render();
  }
}

const onEventUp = event => {
  this.drawing = false;
  // clear clicks on up so we don't redraw anything
  this.xClicks = [];
  this.yClicks = [];
  this.dragClicks = [];
}

const generateCity = () => {
  console.log(this.data);
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

document.getElementById('generate').addEventListener('click', event => {
  generateCity();
});
