export function drawSegment(context, segment) {
  context.strokeStyle = segment.params.highway ? '#FF0000' : '#000000';
  context.lineWidth = segment.width;

  context.beginPath();
  context.moveTo(segment.road.start.x, segment.road.start.y);
  context.lineTo(segment.road.end.x, segment.road.end.y);
  context.closePath();
  context.stroke();
}
