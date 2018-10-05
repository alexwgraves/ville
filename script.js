/* SETUP */

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
this.drawing = false;
this.xClicks = [];
this.yClicks = [];
this.dragClicks = [];

/* FUNCTIONS */

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#000000';
  context.lineJoin = 'round';
  context.lineWidth = 20;

  for (let i = 0; i < this.xClicks.length; i++) {
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

/* MAIN */

render();
