/* SETUP */

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
this.drawing = false;

// create arrays to keep track of painting
this.xClicks = [];
this.yClicks = [];
this.dragClicks = [];
this.clickBrush = [];
this.clickSize = [];

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

/* FUNCTIONS */

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineJoin = 'round';

  let brush, brushSize;
  for (let i = 0; i < this.xClicks.length; i++) {
    // update brush color if it's different from previous
    if (this.clickBrush[i] !== brush) {
      brush = this.clickBrush[i];
      context.strokeStyle = brushColors[brush];
    }

    // update brush size if it's different from previous
    if (this.clickSize[i] !== brushSize) {
      brushSize = this.clickSize[i];
      context.lineWidth = brushSize;
    }

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
  this.clickBrush.push(this.currentBrush);
  this.clickSize.push(this.currentSize);
}

const clearActiveBrushes = () => {
  brushes.forEach(brush => {
    brush.classList.remove('active');
  });
}

/* EVENT LISTENERS */

// update the canvas size on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
});

canvas.addEventListener('mousedown', event => {
  const mouseX = event.pageX - canvas.offsetLeft;
  const mouseY = event.pageY - canvas.offsetTop;
  this.drawing = true;
  addClick(mouseX, mouseY);
  render();
});

canvas.addEventListener('mousemove', event => {
  if (this.drawing) {
    addClick(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, true);
    render();
  }
});

canvas.addEventListener('mouseup', event => {
  this.drawing = false;
});

canvas.addEventListener('mouseleave', event => {
  this.drawing = false;
});

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

/* MAIN */

render();
