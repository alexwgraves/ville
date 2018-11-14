function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function minDegreeDifference(a, b) {
  const diff = Math.abs(a - b) % 180;
  return Math.min(diff, Math.abs(diff - 180));
}

export function randomAngle(limit) {
  const nonUniformNorm = Math.pow(Math.abs(limit), 3);
  let value = 0;
  while (value === 0 || Math.random() < Math.pow(Math.abs(value), 3) / nonUniformNorm) {
    value = randomRange(-limit, +limit);
  }
  return value;
}

export function minAndIndex(array) {
  let min = array[0];
  let min_i = 0;
  array.forEach((entry, i) => {
    if (entry < min) {
      min = entry;
      min_i = i;
    }
  });
  return [min, min_i];
}

export function maxAndIndex(array) {
  let max = array[0];
  let max_i = 0;
  array.forEach((entry, i) => {
    if (entry > max) {
      max = entry;
      max_i = i;
    }
  });
  return [max, max_i];
}
