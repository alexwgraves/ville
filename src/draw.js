export function drawSegment(context, segment) {
  context.strokeStyle = segment.params.deleted ? '#0000FF' : segment.params.highway ? '#FF0000' : '#000000';
  context.lineWidth = segment.width;

  context.beginPath();
  context.moveTo(segment.road.start.x, segment.road.start.y);
  context.lineTo(segment.road.end.x, segment.road.end.y);
  context.closePath();
  context.stroke();
}

export function drawBuilding(context, building) {
  context.fillStyle = 'rgba(0,0,0,0.2)';
  // context.fillStyle = '#000000';

  context.beginPath();
  context.moveTo(building.corners[0].x, building.corners[0].y);
  context.lineTo(building.corners[1].x, building.corners[1].y);
  context.lineTo(building.corners[2].x, building.corners[2].y);
  context.lineTo(building.corners[3].x, building.corners[3].y);
  context.closePath();
  context.fill();
}
