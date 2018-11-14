export default class QuadTree {
  constructor(bounds, maxObjects = 10, maxLevels = 4, level = 0) {
    this.bounds = bounds;
    this.maxObjects = maxObjects;
    this.maxLevels = maxLevels;
    this.level = level;

    this.objects = [];
    this.nodes = [];
  }

  subdivide() {
    const width = Math.round(this.bounds.width / 2);
    const height = Math.round(this.bounds.height / 2);
    const x = Math.round(this.bounds.x);
    const y = Math.round(this.bounds.y);

    // top right node
    this.nodes[0] = new QuadTree({
      x: x + width,
      y: y,
      width: width,
      height: height
    }, this.maxObjects, this.maxLevels, this.level + 1);

    // top left node
    this.nodes[1] = new QuadTree({
      x: x,
      y: y,
      width: width,
      height: height
    }, this.maxObjects, this.maxLevels, this.level + 1);

    // bottom left node
    this.nodes[2] = new QuadTree({
      x: x,
      y: y + height,
      width: width,
      height: height
    }, this.maxObjects, this.maxLevels, this.level + 1);

    // bottom right node
    this.nodes[3] = new QuadTree({
      x: x + width,
      y: y + height,
      width: width,
      height: height
    }, this.maxObjects, this.maxLevels, this.level + 1);
  }

  // determines which node the given rectangle is in
  getIndex(rect) {
    let index = -1;
    const midpointX = this.bounds.x + this.bounds.width / 2;
    const midpointY = this.bounds.y + this.bounds.height / 2;

    const top = rect.y < midpointY && rect.y + rect.height < midpointY;
    const bottom = rect.y > midpointY;

    if (rect.x < midpointX && rect.x + rect.width < midpointX) {
      index = top ? 1 : bottom ? 2 : index;
    } else if (rect.x > midpointX) {
      index = top ? 0 : bottom ? 3 : index;
    }
    return index;
  }

  insert(rect) {
    if (this.nodes.length) {
      const i = this.getIndex(rect);
      if (i !== -1) return this.nodes[i].insert(rect);
    }

    this.objects.push(rect);

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      if (this.nodes.length === 0) this.subdivide();

      let i = 0;
      while (i < this.objects.length) {
        const index = this.getIndex(this.objects[i]);
        if (index !== -1) this.nodes[index].insert(this.objects.splice(i, 1)[0]);
        else i++;
      }
    }
  }

  // returns all objects that collide with the given object
  retrieve(rect) {
    const index = this.getIndex(rect);
    let objects = this.objects;

    if (this.nodes.length) {
      if (index !== -1) {
        objects = objects.concat(this.nodes[index].retrieve(rect));
      } else {
        // check against all subnodes
        for (const node of this.nodes) {
          objects = objects.concat(node.retrieve(rect));
        }
      }
    }
    return objects;
  }

  clear() {
    this.objects = [];
    for (const node of this.nodes) {
      node.clear();
    }
  }
}
