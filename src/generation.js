import { ROAD_SNAP_DISTANCE,
         MINIMUM_INTERSECTION_DEVIATION,
         DEFAULT_SEGMENT_LENGTH,
         HIGHWAY_SEGMENT_LENGTH,
         NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY,
         BRANCH_ANGLE, FORWARD_ANGLE,
         SKYSCRAPER_BRANCH_ANGLE, SKYSCRAPER_FORWARD_ANGLE,
         HIGHWAY_BRANCH_POPULATION_THRESHOLD,
         NORMAL_BRANCH_POPULATION_THRESHOLD,
         HIGHWAY_BRANCH_PROBABILITY,
         DEFAULT_BRANCH_PROBABILITY,
         QUADTREE_PARAMS, QUADTREE_MAX_OBJECTS, QUADTREE_MAX_LEVELS,
         SEGMENT_COUNT_LIMIT } from './config.js';
import * as util from './util.js';
import * as noise from './noise.js';

import Point from './classes/Point.js';
import Polygon from './classes/Polygon.js';
import Heatmap from './classes/Heatmap.js';
import Segment from './classes/Segment.js';
import Building from './classes/Building.js';
import SegmentFactory from './classes/SegmentFactory.js';
import BuildingFactory from './classes/BuildingFactory.js';

function localConstraints(segment, segments, tree) {
  const action = { priority: 0, params: {} };

  const matches = tree.retrieve(segment.collider.limits());
  for (const match of matches) {
    const other = match.object;
    // only check local constraints for segments
    if (!other.start) continue;

    // intersection check
    if (action.priority < 5) {
      const intersection = segment.road.intersects(other.road);
      if (intersection) {
        if (!action.params.time || intersection.time < actions.params.time) {
          action.params.time = intersection.time;
          action.priority = 4;
          // if intersecting lines are too similar don't continue
          if (util.minDegreeDifference(other.direction(), segment.direction()) < MINIMUM_INTERSECTION_DEVIATION) {
            return false;
          }

          other.split(intersection, segment, segments, tree);
          segment.road.end = intersection;
          segment.params.severed = true;

          return true;
        }
      }
    }

    // snap to crossing within radius check
    if (action.priority < 4) {
      // current segment's start must have been checked to have been created
      // other segment's start must have a corresponding end
      if (segment.road.end.distance(other.road.end) <= ROAD_SNAP_DISTANCE) {
        const point = other.road.end;
        action.priority = 3;
        segment.road.end = point;
        segment.params.severed = true;

        // update other's links corresponding to other.road.end
        const links = other.startIsBackwards() ? other.links.forwards : other.links.backwards;

        // check for duplicate lines, don't add if it exists
        const duplicates = links.some(link => {
          return (link.road.start.equals(segment.road.end) && link.road.end.equals(segment.road.start)) ||
            (link.road.start.equals(segment.road.start) && link.road.end.equals(segment.road.end));
        });
        if (duplicates) return false;

        links.forEach(link => {
          // pick links of remaining segments at junction corresponding to other.road.end
          link.linksForEndContaining(other).push(segment);

          // add junction segments to snapped segment
          segment.links.forwards.push(link);
        });

        links.push(segment);
        segment.links.forwards.push(other);

        return true;
      }
    }

    // intersection with radius check
    if (action.priority < 3) {
      const { distance2, pointOnLine, lineProj2, length2 } =
        segment.road.end.distanceToLine(other.road.start, other.road.end);
      if (distance2 < ROAD_SNAP_DISTANCE * ROAD_SNAP_DISTANCE && lineProj2 >= 0 && lineProj2 <= length2) {
        const point = pointOnLine;
        action.priority = 2;
        segment.road.end = point;
        segment.params.severed = true;

        // if intersecting lines are too similar don't continue
        if (util.minDegreeDifference(other.direction(), segment.direction()) < MINIMUM_INTERSECTION_DEVIATION) {
          return false;
        }

        other.split(point, segment, segments, tree);

        return true;
      }
    }
  }

  return true;
}

function globalGoals(previousSegment, color) {
  const newBranches = [];
  if (!previousSegment.params.severed) {
    const template = (direction, length, time, params) => SegmentFactory.usingDirection(previousSegment.road.end, direction, length, time, params);

    // used for highways or going straight on a normal branch
    const templateContinue = (direction) => template(direction, previousSegment.length(), 0, previousSegment.params);
    // not using params, i.e. not highways
    const templateBranch = (direction) => template(direction, DEFAULT_SEGMENT_LENGTH, previousSegment.params.highway ? NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY : 0);

    const continueStraight = templateContinue(previousSegment.direction());
    const straightPop = Heatmap.popOnRoad(continueStraight.road);

    const F_ANGLE = color === Polygon.Type.SKYSCRAPER ? SKYSCRAPER_FORWARD_ANGLE : FORWARD_ANGLE;
    const B_ANGLE = color === Polygon.Type.SKYSCRAPER ? SKYSCRAPER_BRANCH_ANGLE : BRANCH_ANGLE;

    if (previousSegment.params.highway) {
      const randomStraight = templateContinue(previousSegment.direction() + util.randomAngle(F_ANGLE));
      const randomPop = Heatmap.popOnRoad(randomStraight.road);
      const roadPop = randomPop > straightPop ? randomPop : straightPop;
      newBranches.push(randomPop > straightPop ? randomStraight : continueStraight);

      if (roadPop > HIGHWAY_BRANCH_POPULATION_THRESHOLD) {
        if (Math.random() < HIGHWAY_BRANCH_PROBABILITY) {
          const leftHighwayBranch = templateContinue(previousSegment.direction() - 90 + util.randomAngle(B_ANGLE));
          newBranches.push(leftHighwayBranch);
        } else if (Math.random() < HIGHWAY_BRANCH_PROBABILITY) {
          const rightHighwayBranch = templateContinue(previousSegment.direction() + 90 + util.randomAngle(B_ANGLE));
          newBranches.push(rightHighwayBranch);
        }
      }
    } else if (straightPop > NORMAL_BRANCH_POPULATION_THRESHOLD) {
      newBranches.push(continueStraight);
    }

    if (straightPop > NORMAL_BRANCH_POPULATION_THRESHOLD) {
      if (Math.random() < DEFAULT_BRANCH_PROBABILITY) {
        const leftBranch = templateBranch(previousSegment.direction() - 90 + util.randomAngle(B_ANGLE));
        newBranches.push(leftBranch);
      } else if (Math.random() < DEFAULT_BRANCH_PROBABILITY) {
        const rightBranch = templateBranch(previousSegment.direction() + 90 + util.randomAngle(B_ANGLE));
        newBranches.push(rightBranch);
      }
    }
  }

  for (const branch of newBranches) {
    branch.setUpBranchLinks = () => {
      // set up links between each current branch and each existing branch stemming from the previous segment
      previousSegment.links.forwards.forEach(link => {
        branch.links.backwards.push(link);
        link.linksForEndContaining(previousSegment).push(branch);
      });

      previousSegment.links.forwards.push(branch);
      branch.links.backwards.push(previousSegment);
    }
  }

  return newBranches;
}

export function generate(polygon, context, tree) {
  noise.seed(Math.random());

  const queue = [];
  const seed = polygon.getCenter();
  const rootSegment = new Segment(seed, new Point(seed.x + HIGHWAY_SEGMENT_LENGTH, seed.y), 0, { highway: true });
  const oppositeDirection = SegmentFactory.fromExisting(rootSegment);
  const newEnd = new Point(rootSegment.road.start.x - HIGHWAY_SEGMENT_LENGTH, oppositeDirection.road.end.y);
  oppositeDirection.road.setEnd(newEnd);
  oppositeDirection.links.backwards.push(rootSegment);
  rootSegment.links.backwards.push(oppositeDirection);
  queue.push(rootSegment);
  queue.push(oppositeDirection);

  const segments = [];
  while (queue.length && segments.length < SEGMENT_COUNT_LIMIT) {
    // pop smallest road from the priority queue (i.e. smallest time)
    let minT = queue[0].time;
    let minT_i = 0;
    queue.forEach((segment, i) => {
      if (segment.time < minT) {
        minT = segment.time;
        minT_i = i;
      }
    });

    const minSegment = queue.splice(minT_i, 1)[0];
    const accepted = localConstraints(minSegment, segments, tree);
    if (accepted) {
      if (minSegment.setUpBranchLinks) {
        minSegment.setUpBranchLinks();
      }
      minSegment.addSegment(segments, tree);

      // only add more segments if this segment ends within the polygon
      const end = context.getImageData(minSegment.road.end.x, minSegment.road.end.y, 1, 1).data;
      const rgb = Polygon.Color[polygon.color].slice(4, -1).split(',');
      if (util.colorsEqual(end, rgb)) {
        globalGoals(minSegment, polygon.color).forEach(segment => {
          segment.time += minSegment.time + 1;
          queue.push(segment);
        });
      }
    }
  }

  let id = 0;
  for (const segment of segments) {
    segment.id = id++;
  }

  // building generation
  let buildings = [];
  segments.forEach(segment => {
    const count = polygon.color === Polygon.Type.SKYSCRAPER ? 5 : 10;
    const newBuildings = BuildingFactory.aroundSegment(polygon.color, segment, count, 20, tree);
    newBuildings.forEach(building => tree.insert(building.collider.limits()));
    buildings = buildings.concat(newBuildings);
  });

  return { segments, buildings };
}
