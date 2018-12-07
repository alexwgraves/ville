import { BUILDING_PLACEMENT_LOOP_LIMIT,
         RESIDENTIAL_BUILDING_SIZE,
         SKYSCRAPER_BUILDING_SIZE } from './../config.js';
import { randomRange } from './../util.js';

import Building from './Building.js';
import Point from './Point.js';

export default class BuildingFactory {
  static byType(type) {
    if (type === Building.Type.SKYSCRAPER) {
      return new Building(new Point(0, 0), 0, SKYSCRAPER_BUILDING_SIZE, type);
    } else {
      return new Building(new Point(0, 0), 0, RESIDENTIAL_BUILDING_SIZE, type, randomRange(0.5, 2));
    }
  }

  static aroundSegment(type, segment, count, radius, tree) {
    const buildings = [];
    for (let i = 0; i < count; i++) {
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomRadius = Math.random() * radius;
      const center = new Point(
        0.5 * (segment.road.start.x + segment.road.end.x) + randomRadius * Math.sin(randomAngle),
        0.5 * (segment.road.start.y + segment.road.end.y) + randomRadius * Math.cos(randomAngle)
      );
      const building = BuildingFactory.byType(type);
      building.setCenter(center);
      building.setDirection(segment.direction());

      let permitBuilding = false;
      for (let i = 0; i < BUILDING_PLACEMENT_LOOP_LIMIT; i++) {
        let collisionCount = 0;
        // query tree since building limits may have changed from previous collision
        const potentialCollisions = tree.retrieve(building.collider.limits()).concat(buildings);
        for (let object of potentialCollisions) {
          // unpack if necessary
          if (object.object) object = object.object;
          const result = building.collider.collide(object.collider);
          if (result) {
            collisionCount++;
            if (i === BUILDING_PLACEMENT_LOOP_LIMIT - 1) break;
            // shift building to avoid colliding with existing object
            building.setCenter(building.center.add(result));
          }
        }

        if (collisionCount === 0) {
          permitBuilding = true;
          break;
        }
      }

      if (permitBuilding) buildings.push(building);
    }

    return buildings;
  }
}
