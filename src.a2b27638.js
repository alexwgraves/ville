// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/classes/Point.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Point =
/*#__PURE__*/
function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "length",
    value: function length() {
      return Math.sqrt(this.length2());
    }
  }, {
    key: "length2",
    value: function length2() {
      return this.x * this.x + this.y * this.y;
    }
  }, {
    key: "distance",
    value: function distance(other) {
      var v = other.minus(this);
      return v.length();
    }
  }, {
    key: "distance2",
    value: function distance2(other) {
      var v = other.minus(this);
      return v.length2();
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return this.x === other.x && this.y === other.y;
    }
  }, {
    key: "scalarMultiply",
    value: function scalarMultiply(s) {
      return new Point(this.x * s, this.y * s);
    }
  }, {
    key: "add",
    value: function add(other) {
      return new Point(this.x + other.x, this.y + other.y);
    }
  }, {
    key: "minus",
    value: function minus(other) {
      return new Point(this.x - other.x, this.y - other.y);
    }
  }, {
    key: "dot",
    value: function dot(other) {
      return this.x * other.x + this.y * other.y;
    }
  }, {
    key: "cross",
    value: function cross(other) {
      return this.x * other.y - this.y * other.x;
    }
  }, {
    key: "angle",
    value: function angle(other) {
      var radians = Math.acos(this.dot(other) / (this.length() * other.length()));
      return radians * 180 / Math.PI;
    }
  }, {
    key: "project",
    value: function project(other) {
      return other.scalarMultiply(this.dot(other) / other.length());
    }
  }, {
    key: "distanceToLine",
    value: function distanceToLine(start, end) {
      var toStart = this.minus(start);
      var line = end.minus(start);
      var projected = toStart.project(line);
      var result = start.add(projected);
      var dot = toStart.dot(line);
      var sign = dot < 0 ? -1 : dot > 0 ? 1 : 0;
      return {
        distance2: result.distance2(this),
        pointOnLine: result,
        // distance along line of projected point
        lineProj2: sign * projected.length2(),
        length2: line.length2()
      };
    }
  }]);

  return Point;
}();

exports.default = Point;
},{}],"src/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QUADTREE_MAX_LEVELS = exports.QUADTREE_MAX_OBJECTS = exports.NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY = exports.MIN_SPEED_PROPORTION = exports.MINIMUM_INTERSECTION_DEVIATION = exports.ROAD_SNAP_DISTANCE = exports.NORMAL_BRANCH_POPULATION_THRESHOLD = exports.HIGHWAY_BRANCH_POPULATION_THRESHOLD = exports.DEFAULT_BRANCH_PROBABILITY = exports.HIGHWAY_BRANCH_PROBABILITY = exports.FORWARD_ANGLE = exports.BRANCH_ANGLE = exports.SEGMENT_COUNT_LIMIT = exports.HIGHWAY_SEGMENT_LENGTH = exports.DEFAULT_SEGMENT_LENGTH = exports.HIGHWAY_SEGMENT_WIDTH = exports.DEFAULT_SEGMENT_WIDTH = void 0;
var DEFAULT_SEGMENT_WIDTH = 1;
exports.DEFAULT_SEGMENT_WIDTH = DEFAULT_SEGMENT_WIDTH;
var HIGHWAY_SEGMENT_WIDTH = 2;
exports.HIGHWAY_SEGMENT_WIDTH = HIGHWAY_SEGMENT_WIDTH;
var DEFAULT_SEGMENT_LENGTH = 30;
exports.DEFAULT_SEGMENT_LENGTH = DEFAULT_SEGMENT_LENGTH;
var HIGHWAY_SEGMENT_LENGTH = 40;
exports.HIGHWAY_SEGMENT_LENGTH = HIGHWAY_SEGMENT_LENGTH;
var SEGMENT_COUNT_LIMIT = 500;
exports.SEGMENT_COUNT_LIMIT = SEGMENT_COUNT_LIMIT;
var BRANCH_ANGLE = 3; // in degrees

exports.BRANCH_ANGLE = BRANCH_ANGLE;
var FORWARD_ANGLE = 15; // in degrees

exports.FORWARD_ANGLE = FORWARD_ANGLE;
var HIGHWAY_BRANCH_PROBABILITY = 0.05;
exports.HIGHWAY_BRANCH_PROBABILITY = HIGHWAY_BRANCH_PROBABILITY;
var DEFAULT_BRANCH_PROBABILITY = 0.4;
exports.DEFAULT_BRANCH_PROBABILITY = DEFAULT_BRANCH_PROBABILITY;
var HIGHWAY_BRANCH_POPULATION_THRESHOLD = 0.1;
exports.HIGHWAY_BRANCH_POPULATION_THRESHOLD = HIGHWAY_BRANCH_POPULATION_THRESHOLD;
var NORMAL_BRANCH_POPULATION_THRESHOLD = 0.1;
exports.NORMAL_BRANCH_POPULATION_THRESHOLD = NORMAL_BRANCH_POPULATION_THRESHOLD;
var ROAD_SNAP_DISTANCE = 500;
exports.ROAD_SNAP_DISTANCE = ROAD_SNAP_DISTANCE;
var MINIMUM_INTERSECTION_DEVIATION = 30; // in degrees

exports.MINIMUM_INTERSECTION_DEVIATION = MINIMUM_INTERSECTION_DEVIATION;
var MIN_SPEED_PROPORTION = 0.1;
exports.MIN_SPEED_PROPORTION = MIN_SPEED_PROPORTION;
var NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY = 5;
exports.NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY = NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY;
var QUADTREE_MAX_OBJECTS = 10;
exports.QUADTREE_MAX_OBJECTS = QUADTREE_MAX_OBJECTS;
var QUADTREE_MAX_LEVELS = 10;
exports.QUADTREE_MAX_LEVELS = QUADTREE_MAX_LEVELS;
},{}],"src/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minDegreeDifference = minDegreeDifference;
exports.randomAngle = randomAngle;
exports.minAndIndex = minAndIndex;
exports.maxAndIndex = maxAndIndex;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function minDegreeDifference(a, b) {
  var diff = Math.abs(a - b) % 180;
  return Math.min(diff, Math.abs(diff - 180));
}

function randomAngle(limit) {
  var nonUniformNorm = Math.pow(Math.abs(limit), 3);
  var value = 0;

  while (value === 0 || Math.random() < Math.pow(Math.abs(value), 3) / nonUniformNorm) {
    value = randomRange(-limit, +limit);
  }

  return value;
}

function minAndIndex(array) {
  var min = array[0];
  var min_i = 0;
  array.forEach(function (entry, i) {
    if (entry < min) {
      min = entry;
      min_i = i;
    }
  });
  return [min, min_i];
}

function maxAndIndex(array) {
  var max = array[0];
  var max_i = 0;
  array.forEach(function (entry, i) {
    if (entry > max) {
      max = entry;
      max_i = i;
    }
  });
  return [max, max_i];
}
},{}],"third_party/perlin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seed = seed;
exports.simplex2 = simplex2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 * Adapted from https://github.com/josephg/noisejs
 */
var Grad =
/*#__PURE__*/
function () {
  function Grad(x, y, z) {
    _classCallCheck(this, Grad);

    this.x = x;
    this.y = y;
    this.z = z;
  }

  _createClass(Grad, [{
    key: "dot2",
    value: function dot2(x, y) {
      return this.x * x + this.y * y;
    }
  }]);

  return Grad;
}();

var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0), new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1), new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
var p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
var perm = new Array(512);
var gradP = new Array(512);

function seed(seed) {
  if (seed > 0 && seed < 1) {
    // Scale the seed out
    seed *= 65536;
  }

  seed = Math.floor(seed);

  if (seed < 256) {
    seed |= seed << 8;
  }

  for (var i = 0; i < 256; i++) {
    var v = i & 1 ? p[i] ^ seed & 255 : p[i] ^ seed >> 8 & 255;
    perm[i] = perm[i + 256] = v;
    gradP[i] = gradP[i + 256] = grad3[v % 12];
  }
}

seed(0); // Skewing and unskewing factors for 2, 3, and 4 dimensions

var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2 = (3 - Math.sqrt(3)) / 6;
var F3 = 1 / 3;
var G3 = 1 / 6; // 2D simplex noise

function simplex2(xin, yin) {
  var n0, n1, n2; // Noise contributions from the three corners
  // Skew the input space to determine which simplex cell we're in

  var s = (xin + yin) * F2; // Hairy factor for 2D

  var i = Math.floor(xin + s);
  var j = Math.floor(yin + s);
  var t = (i + j) * G2;
  var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.

  var y0 = yin - j + t; // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.
  // Offsets for second (middle) corner of simplex in (i,j) coords

  var i1 = x0 > y0 ? 1 : 0;
  var j1 = x0 > y0 ? 0 : 1; // x0 > y0 is lower triangle, XY order: (0,0)->(1,0)->(1,1)
  // otherwise is upper triangle, YX order: (0,0)->(0,1)->(1,1)
  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3-sqrt(3))/6

  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords

  var y1 = y0 - j1 + G2;
  var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords

  var y2 = y0 - 1 + 2 * G2; // Work out the hashed gradient indices of the three simplex corners

  i &= 255;
  j &= 255;
  var gi0 = gradP[i + perm[j]];
  var gi1 = gradP[i + i1 + perm[j + j1]];
  var gi2 = gradP[i + 1 + perm[j + 1]]; // Calculate the contribution from the three corners

  var t0 = 0.5 - x0 * x0 - y0 * y0;

  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
  }

  var t1 = 0.5 - x1 * x1 - y1 * y1;

  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot2(x1, y1);
  }

  var t2 = 0.5 - x2 * x2 - y2 * y2;

  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot2(x2, y2);
  } // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].


  return 70 * (n0 + n1 + n2);
}
},{}],"src/classes/Heatmap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var noise = _interopRequireWildcard(require("./../../third_party/perlin.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Heatmap =
/*#__PURE__*/
function () {
  function Heatmap() {
    _classCallCheck(this, Heatmap);
  }

  _createClass(Heatmap, null, [{
    key: "populationAt",
    value: function populationAt(x, y) {
      var one = (noise.simplex2(x / 20000, y / 10000) + 1) / 2;
      var two = (noise.simplex2(x / 20000 + 500, y / 20000 + 500) + 1) / 2;
      var three = (noise.simplex2(x / 10000 + 1000, y / 20000 + 1000) + 1) / 2;
      return Math.pow((one * two + three) / 2, 2);
    }
  }, {
    key: "popOnRoad",
    value: function popOnRoad(road) {
      return (this.populationAt(road.start.x, road.start.y) + this.populationAt(road.end.x, road.end.y)) / 2;
    }
  }]);

  return Heatmap;
}();

exports.default = Heatmap;
},{"./../../third_party/perlin.js":"third_party/perlin.js"}],"src/classes/Collision.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Point = _interopRequireDefault(require("./Point.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Collision =
/*#__PURE__*/
function () {
  _createClass(Collision, null, [{
    key: "Type",
    get: function get() {
      return {
        RECT: 'rect',
        LINE: 'line',
        CIRCLE: 'circle'
      };
    }
  }]);

  function Collision(object, type, properties) {
    _classCallCheck(this, Collision);

    this.object = object;
    this.type = type;
    this.properties = properties;
    this.collisionRevision = 0;
    this.limitsRevision = undefined;
    this.cachedLimits = undefined;
  }

  _createClass(Collision, [{
    key: "updateCollisionProperties",
    value: function updateCollisionProperties(properties) {
      this.collisionRevision++;

      for (var prop in properties) {
        this.properties[prop] = properties[prop];
      }
    }
  }, {
    key: "minCorner",
    value: function minCorner(axis) {
      var minCorner = this.properties.corners[0];
      this.properties.corners.forEach(function (corner) {
        if (corner[axis] < minCorner[axis]) minCorner = corner;
      });
      return minCorner;
    }
  }, {
    key: "maxCorner",
    value: function maxCorner(axis) {
      var maxCorner = this.properties.corners[0];
      this.properties.corners.forEach(function (corner) {
        if (corner[axis] > maxCorner[axis]) maxCorner = corner;
      });
      return maxCorner;
    }
  }, {
    key: "limits",
    value: function limits() {
      if (this.collisionRevision !== this.limitsRevision) {
        this.limitsRevision = this.collisionRevision;

        if (this.type === Collision.Type.RECT) {
          minX = this.minCorner('x').x;
          minY = this.minCorner('y').y;
          this.cachedLimits = {
            x: minX,
            y: minY,
            width: this.maxCorner('x').x - minX,
            height: this.maxCorner('y').y - minY,
            object: this.object
          };
        } else if (this.type === Collision.Type.LINE) {
          this.cachedLimits = {
            x: Math.min(this.properties.start.x, this.properties.end.x),
            y: Math.min(this.properties.start.y, this.properties.end.y),
            width: Math.abs(this.properties.start.x - this.properties.end.x),
            height: Math.abs(this.properties.start.y - this.properties.end.y),
            object: this.object
          };
        } else if (this.type === Collision.Type.CIRCLE) {
          this.cachedLimits = {
            x: this.properties.center.x - this.properties.radius,
            y: this.properties.center.y - this.properties.radius,
            width: this.properties.radius * 2,
            height: this.properties.radius * 2,
            object: this.object
          };
        }
      }

      return this.cachedLimits;
    }
  }, {
    key: "collide",
    value: function collide(other) {
      // avoid expensive collision check if possible
      var limits = this.limits();
      var otherLimits = other.limits();

      if (limits && otherLimits && (limits.x + limits.width < otherLimits.x || otherLimits.x + otherLimits.width < limits.x) && (limits.y + limits.height < otherLimits.y || otherLimits.y + otherLimits.height < limits.y)) {
        return false;
      }

      if (this.type === Collision.Type.CIRCLE) {
        if (other.type === Collision.Type.RECT) {
          other.rectCircleCollision(this);
        }
      } else if (this.type === Collision.Type.RECT) {
        if (other.type !== Collision.Type.CIRCLE) {
          this.rectRectIntersection(other);
        } else {
          this.rectCircleCollision(other);
        }
      } else if (this.type === Collision.Type.LINE) {
        if (other.type !== Collision.Type.CIRCLE) {
          this.rectRectIntersection(other);
        }
      }
    }
  }, {
    key: "rectCircleCollision",
    value: function rectCircleCollision(circle) {
      // this must be a rectangle or line to call this function
      if (this.type === Collision.Type.CIRCLE) return; // other must be a circle to call this function

      if (circle.type !== Collision.Type.CIRCLE) return; // get the correct properties

      var properties = this.type === Collision.Type.LINE ? this.rectPropsFromLine() : this.properties;
      var corners = properties.corners;
      var radius = circle.properties.radius; // check for corner intersections with circle

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = corners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var corner = _step.value;

          if (corner.distance2(circle.properties.center) <= radius * radius) {
            return true;
          } // check for edge intersections with circle


          for (var i = 0; i < corners.length; i++) {
            var start = corners[i];
            var end = corners[(i + 1) % corners.length];

            var _circle$properties$ce = circle.properties.center.distanceToLine(start, end),
                distance2 = _circle$properties$ce.distance2,
                pointOnLine = _circle$properties$ce.pointOnLine,
                lineProj2 = _circle$properties$ce.lineProj2,
                length2 = _circle$properties$ce.length2;

            if (lineProj2 > 0 && lineProj2 < length2 && distance2 <= radius * radius) {
              return true;
            }
          } // check that the circle is not enclosed by the rectangle


          var axes = [corners[3].minus(corners[0]), corners[3].minus(corners[2])];
          var center0 = circle.properties.center.minus(corners[0]);
          var center2 = circle.properties.center.minus(corners[2]);
          var projections = [center0.project(axes[0]), center2.project(axes[1])];
          var dots = [center0.dot(axes[0]), center2.dot(axes[1])];

          if (dots[0] < 0 || projections[0].length2() > axes[0].length2() || dots[1] < 0 || projections[1].length2() > axes[1].length2()) {
            return false;
          }

          return true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "rectPropsFromLine",
    value: function rectPropsFromLine() {
      // this must be a line to call this function
      if (this.type !== Collision.Type.LINE) return;
      var direction = this.properties.end.minus(this.properties.start);
      var perpendicular = new _Point.default(-direction.y, direction.x);
      var halfWidth = perpendicular.scalarMultiply(0.5 * this.properties.width / perpendicular.length());
      return {
        corners: [this.properties.start.add(halfWidth), this.properties.start.minus(halfWidth), this.properties.end.minus(halfWidth), this.properties.end.add(halfWidth)]
      };
    }
  }, {
    key: "rectRectIntersection",
    value: function rectRectIntersection(rect) {
      // this must be a rectangle or line to call this function
      if (this.type === Collision.Type.CIRCLE) return; // other must be a rectangle or line to call this function

      if (rect.type === Collision.Type.CIRCLE) return;
      var cornersA = this.type === Collision.Type.LINE ? this.rectPropsFromLine().corners : this.properties.corners;
      var cornersB = rect.type === Collision.Type.LINE ? rect.rectPropsFromLine().corners : rect.properties.corners;
      var axes = [cornersA[3].minus(cornersA[0]), cornersA[3].minus(cornersA[2]), cornersB[0].minus(cornersB[1]), cornersB[0].minus(cornersB[3])]; // find axes with overlaps

      var overlaps = [];

      var _loop = function _loop() {
        var axis = axes[_i];
        var projectionsA = cornersA.map(function (corner) {
          return corner.project(axis);
        });
        var projectionsB = cornersB.map(function (corner) {
          return corner.project(axis);
        });
        var positionsA = projectionsA.map(function (vector) {
          return vector.dot(axis);
        });
        var positionsB = projectionsB.map(function (vector) {
          return vector.dot(axis);
        });

        var _util$maxAndIndex = util.maxAndIndex(positionsA),
            _util$maxAndIndex2 = _slicedToArray(_util$maxAndIndex, 2),
            maxA = _util$maxAndIndex2[0],
            maxA_i = _util$maxAndIndex2[1];

        var _util$minAndIndex = util.minAndIndex(positionsA),
            _util$minAndIndex2 = _slicedToArray(_util$minAndIndex, 2),
            minA = _util$minAndIndex2[0],
            minA_i = _util$minAndIndex2[1];

        var _util$maxAndIndex3 = util.maxAndIndex(positionsB),
            _util$maxAndIndex4 = _slicedToArray(_util$maxAndIndex3, 2),
            maxB = _util$maxAndIndex4[0],
            maxB_i = _util$maxAndIndex4[1];

        var _util$minAndIndex3 = util.minAndIndex(positionsB),
            _util$minAndIndex4 = _slicedToArray(_util$minAndIndex3, 2),
            minB = _util$minAndIndex4[0],
            minB_i = _util$minAndIndex4[1]; // if the rectangles don't overlaps on at least one axis, they don't collide


        if (maxA < minB || maxB < minA) {
          return {
            v: false
          };
        } else {
          // calculate the overlap between the rectangles on this axis
          var maxAminB = projectionsA[maxA_i].minus(projectionsB[minB_i]);
          var maxBminA = projectionsB[maxB_i].minus(projectionsA[minA_i]);
          if (maxAminB.length2() < maxBminA.length2()) overlaps.push(maxAminB); // the rectangles overlap on the other side, so invert the vector
          else overlaps.push(maxBminA.scalarMultiply(-1));
        }
      };

      for (var _i = 0; _i < axes.length; _i++) {
        var _ret = _loop();

        if (_typeof(_ret) === "object") return _ret.v;
      } // find axis with the least overlap


      var minVector = overlaps[0];
      overlaps.forEach(function (vector) {
        if (vector.length2() < minVector.length2()) minVector = vector;
      }); // return displacement required to remove the rectangle from the collision

      return minVector.scalarMultiply(-1);
    }
  }]);

  return Collision;
}();

exports.default = Collision;
},{"./Point.js":"src/classes/Point.js"}],"src/classes/Road.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Road =
/*#__PURE__*/
function () {
  function Road(start, end, segment) {
    _classCallCheck(this, Road);

    this.start = start;
    this.end = end;
    this.segment = segment;
  }

  _createClass(Road, [{
    key: "setStart",
    value: function setStart(start) {
      this.start = start;
      this.segment.collider.updateCollisionProperties({
        start: start
      });
      this.segment.roadRevision++;
    }
  }, {
    key: "setEnd",
    value: function setEnd(end) {
      this.end = end;
      this.segment.collider.updateCollisionProperties({
        end: end
      });
      this.segment.roadRevision++;
    }
  }]);

  return Road;
}();

exports.default = Road;
},{}],"src/classes/SegmentFactory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Segment = _interopRequireDefault(require("./Segment.js"));

var _Point = _interopRequireDefault(require("./Point.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SegmentFactory =
/*#__PURE__*/
function () {
  function SegmentFactory() {
    _classCallCheck(this, SegmentFactory);
  }

  _createClass(SegmentFactory, null, [{
    key: "fromExisting",
    value: function fromExisting(segment, time, road, params) {
      time = time || segment.time;
      road = road || segment.road;
      params = params || segment.params;
      return new _Segment.default(road.start, road.end, time, params);
    }
  }, {
    key: "usingDirection",
    value: function usingDirection(start) {
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 90;
      var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_SEGMENT_LENGTH;
      var time = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      // convert direction to radians
      direction *= Math.PI / 180;
      var x = start.x + length * Math.sin(direction);
      var y = start.y + length * Math.cos(direction);
      return new _Segment.default(start, new _Point.default(x, y), time, params);
    }
  }]);

  return SegmentFactory;
}();

exports.default = SegmentFactory;
},{"./Segment.js":"src/classes/Segment.js","./Point.js":"src/classes/Point.js"}],"src/classes/Segment.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("./../config.js");

var _Collision = _interopRequireDefault(require("./Collision.js"));

var _Road = _interopRequireDefault(require("./Road.js"));

var _Point = _interopRequireDefault(require("./Point.js"));

var _SegmentFactory = _interopRequireDefault(require("./SegmentFactory.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Segment =
/*#__PURE__*/
function () {
  _createClass(Segment, null, [{
    key: "End",
    get: function get() {
      return {
        START: 'start',
        END: 'end'
      };
    }
  }]);

  function Segment(start, end) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Segment);

    this.start = start;
    this.end = end;
    this.time = time;
    this.params = params;
    this.width = params.highway ? _config.HIGHWAY_SEGMENT_WIDTH : _config.DEFAULT_SEGMENT_WIDTH;
    this.collider = new _Collision.default(this, _Collision.default.Type.LINE, {
      start: start,
      end: end,
      width: this.width
    });
    this.roadRevision = 0;
    this.directionRevision = undefined;
    this.lengthRevision = undefined;
    this.cachedDirection = undefined;
    this.cachedLength = undefined;
    this.road = new _Road.default(start, end, this); // time-step delay before this road is evaluated

    this.time = time; // meta-information relevant to global goals

    this.params = params;
    this.links = {
      backwards: [],
      forwards: []
    };
    this.users = [];
    this.maxSpeed = params.highway ? 1200 : 800;
    this.capacity = params.highway ? 12 : 6;
  }

  _createClass(Segment, [{
    key: "currentSpeed",
    value: function currentSpeed() {
      return Math.min(_config.MIN_SPEED_PROPORTION, 1 - Math.max(0, this.users.length - 1) / this.capacity) * this.maxSpeed;
    }
  }, {
    key: "direction",
    value: function direction() {
      if (this.directionRevision !== this.roadRevision) {
        this.directionRevision = this.roadRevision;
        var vertical = new _Point.default(0, 1);
        var vector = this.road.end.minus(this.road.start);
        var cross = vertical.cross(vector); // we want the opposite of the cross sign

        var sign = cross > 0 ? -1 : cross < 0 ? 1 : 0;
        this.cachedDirection = sign * vertical.angle(vector);
      }

      return this.cachedDirection;
    }
  }, {
    key: "length",
    value: function length() {
      if (this.lengthRevision !== this.roadRevision) {
        this.lengthRevision = this.roadRevision;
        this.cachedLength = this.road.start.distance(this.road.end);
      }

      return this.cachedLength;
    }
  }, {
    key: "startIsBackwards",
    value: function startIsBackwards() {
      if (this.links.backwards.length) {
        return this.links.backwards[0].road.start.equals(this.road.start) || this.links.backwards[0].road.end.equals(this.road.start);
      } else {
        return this.links.forwards[0].road.start.equals(this.road.end) || this.links.forwards[0].road.end.equals(this.road.end);
      }
    }
  }, {
    key: "cost",
    value: function cost() {
      return this.length() / this.currentSpeed();
    }
  }, {
    key: "costTo",
    value: function costTo(other, fromFraction) {
      var segmentEnd = this.endContaining(other);
      var fraction = fromFraction ? segmentEnd === Segment.End.START ? fromFraction : fromFraction : 0.5;
      return this.cost() * fraction;
    }
  }, {
    key: "neighbors",
    value: function neighbors() {
      return this.links.forwards.concat(this.links.backwards);
    }
  }, {
    key: "endContaining",
    value: function endContaining(segment) {
      var backwards = this.startIsBackwards();

      if (this.links.backwards.includes(segment)) {
        return backwards ? Segment.End.START : Segment.End.END;
      } else if (this.links.forwards.includes(segment)) {
        return backwards ? Segment.End.END : Segment.End.START;
      } else {
        return undefined;
      }
    }
  }, {
    key: "linksForEndContaining",
    value: function linksForEndContaining(segment) {
      if (this.links.backwards.includes(segment)) {
        return this.links.backwards;
      } else if (this.links.forwards.includes(segment)) {
        return this.links.forwards;
      } else {
        return undefined;
      }
    }
  }, {
    key: "split",
    value: function split(point, segment, segments, tree) {
      var _this = this;

      var backwards = this.startIsBackwards();

      var splitPart = _SegmentFactory.default.fromExisting(this);

      splitPart.addSegment(segments, tree);
      splitPart.road.setEnd(point);
      this.road.setStart(point);
      splitPart.links.backwards = this.links.backwards.slice(0);
      splitPart.links.forwards = this.links.forwards.slice(0); // determine which links correspond to which end of the split segment

      var firstSplit = backwards ? splitPart : this;
      var secondSplit = backwards ? this : splitPart;
      var fixLinks = backwards ? splitPart.links.backwards : splitPart.links.forwards;
      fixLinks.forEach(function (link) {
        var index = link.links.backwards.indexOf(_this);

        if (index !== -1) {
          link.links.backwards[index] = splitPart;
        } else {
          index = link.links.forwards.indexOf(_this);
          link.links.forwards[index] = splitPart;
        }
      });
      firstSplit.links.forwards = [segment, secondSplit];
      secondSplit.links.backwards = [segment, firstSplit];
      segment.links.forwards.push(firstSplit);
      segment.links.forwards.push(secondSplit);
    }
  }, {
    key: "addSegment",
    value: function addSegment(segments, tree) {
      segments.push(this);
      tree.insert(this.collider.limits());
    }
  }]);

  return Segment;
}();

exports.default = Segment;
},{"./../config.js":"src/config.js","./Collision.js":"src/classes/Collision.js","./Road.js":"src/classes/Road.js","./Point.js":"src/classes/Point.js","./SegmentFactory.js":"src/classes/SegmentFactory.js"}],"src/classes/QuadTree.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var QuadTree =
/*#__PURE__*/
function () {
  function QuadTree(bounds) {
    var maxObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    var maxLevels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, QuadTree);

    this.bounds = bounds;
    this.maxObjects = maxObjects;
    this.maxLevels = maxLevels;
    this.level = level;
    this.objects = [];
    this.nodes = [];
  }

  _createClass(QuadTree, [{
    key: "subdivide",
    value: function subdivide() {
      var width = Math.round(this.bounds.width / 2);
      var height = Math.round(this.bounds.height / 2);
      var x = Math.round(this.bounds.x);
      var y = Math.round(this.bounds.y); // top right node

      this.nodes[0] = new QuadTree({
        x: x + width,
        y: y,
        width: width,
        height: height
      }, this.maxObjects, this.maxLevels, this.level + 1); // top left node

      this.nodes[1] = new QuadTree({
        x: x,
        y: y,
        width: width,
        height: height
      }, this.maxObjects, this.maxLevels, this.level + 1); // bottom left node

      this.nodes[2] = new QuadTree({
        x: x,
        y: y + height,
        width: width,
        height: height
      }, this.maxObjects, this.maxLevels, this.level + 1); // bottom right node

      this.nodes[3] = new QuadTree({
        x: x + width,
        y: y + height,
        width: width,
        height: height
      }, this.maxObjects, this.maxLevels, this.level + 1);
    } // determines which node the given rectangle is in

  }, {
    key: "getIndex",
    value: function getIndex(rect) {
      var index = -1;
      var midpointX = this.bounds.x + this.bounds.width / 2;
      var midpointY = this.bounds.y + this.bounds.height / 2;
      var top = rect.y < midpointY && rect.y + rect.height < midpointY;
      var bottom = rect.y > midpointY;

      if (rect.x < midpointX && rect.x + rect.width < midpointX) {
        index = top ? 1 : bottom ? 2 : index;
      } else if (rect.x > midpointX) {
        index = top ? 0 : bottom ? 3 : index;
      }

      return index;
    }
  }, {
    key: "insert",
    value: function insert(rect) {
      if (this.nodes.length) {
        var i = this.getIndex(rect);
        if (i !== -1) return this.nodes[i].insert(rect);
      }

      this.objects.push(rect);

      if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
        if (this.nodes.length === 0) this.subdivide();
        var _i = 0;

        while (_i < this.objects.length) {
          var index = this.getIndex(this.objects[_i]);
          if (index !== -1) this.nodes[index].insert(this.objects.splice(_i, 1)[0]);else _i++;
        }
      }
    } // returns all objects that collide with the given object

  }, {
    key: "retrieve",
    value: function retrieve(rect) {
      var index = this.getIndex(rect);
      var objects = this.objects;

      if (this.nodes.length) {
        if (index !== -1) {
          objects = objects.concat(this.nodes[index].retrieve(rect));
        } else {
          // check against all subnodes
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var node = _step.value;
              objects = objects.concat(node.retrieve(rect));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }

      return objects;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.objects = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var node = _step2.value;
          node.clear();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  return QuadTree;
}();

exports.default = QuadTree;
},{}],"src/generation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = generate;

var _config = require("./config.js");

var util = _interopRequireWildcard(require("./util.js"));

var noise = _interopRequireWildcard(require("./../third_party/perlin.js"));

var _Point = _interopRequireDefault(require("./classes/Point.js"));

var _Heatmap = _interopRequireDefault(require("./classes/Heatmap.js"));

var _Segment = _interopRequireDefault(require("./classes/Segment.js"));

var _QuadTree = _interopRequireDefault(require("./classes/QuadTree.js"));

var _SegmentFactory = _interopRequireDefault(require("./classes/SegmentFactory.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function doRoadSegmentsIntersect(a, b) {
  var intersectX = false;

  for (var i = a.start.x; i < a.end.x; i++) {
    if (i > b.start.x && i < b.end.x) {
      intersectX = true;
      break;
    }
  }

  var intersectY = false;

  for (var _i = a.start.y; _i < a.end.y; _i++) {
    if (_i > b.start.y && _i < b.end.y) {
      intersectY = true;
      break;
    }
  }

  return intersectX && intersectY;
}

function localConstraints(segment, segments, tree, debugData) {
  var action = {
    priority: 0,
    params: {}
  };
  var matches = tree.retrieve(segment.collider.limits());
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var match = _step.value;
      var other = match.object; // intersection check

      if (action.priority < 5) {
        var intersection = doRoadSegmentsIntersect(segment.road, other.road);

        if (intersection) {
          if (!action.params.time || intersection.time < actions.params.time) {
            action.params.time = intersection.time;
            action.priority = 4;
            return {
              v: action.function = function () {
                // if intersecting lines are too similar don't continue
                if (util.minDegreeDifference(other.direction(), segment.direction()) < _config.MINIMUM_INTERSECTION_DEVIATION) {
                  return false;
                }

                other.split(intersection, segment, segments, tree);
                segment.road.end = intersection;
                segmentEnd.params.severed = true;

                if (debugData) {
                  debugData.intersections = debugData.intersections || [];
                  debugData.intersections.push(new _Point.default(intersection.x, intersection.y));
                }

                return true;
              }
            };
          }
        }
      } // snap to crossing within radius check


      if (action.priority < 4) {
        // current segment's start must have been checked to have been created
        // other segment's start must have a corresponding end
        if (segment.road.end.distance(other.road.end) <= _config.ROAD_SNAP_DISTANCE) {
          var point = other.road.end;
          action.priority = 3;
          return {
            v: action.function = function () {
              segment.road.end = point;
              segment.params.severed = true; // update other's links corresponding to other.road.end

              var links = other.startIsBackwards() ? other.links.forwards : other.links.backwards; // check for duplicate lines, don't add if it exists

              var duplicates = links.some(function (link) {
                return link.road.start.equals(segment.road.end) && link.road.end.equals(segment.road.start) || link.road.start.equals(segment.road.start) && link.road.end.equals(segment.road.end);
              });
              if (duplicates) return false;
              links.forEach(function (link) {
                // pick links of remaining segments at junction corresponding to other.road.end
                link.linksForEndContaining(other).push(segment); // add junction segments to snapped segment

                segment.links.forwards.push(link);
              });
              links.push(segment);
              segment.links.forwards.push(other);

              if (debugData) {
                debugData.snaps = debugData.snaps || [];
                debugData.snaps.push(new _Point.default(point.x, point.y));
              }

              return true;
            }
          };
        }
      } // intersection with radius check


      if (action.priority < 3) {
        var _segment$road$end$dis = segment.road.end.distanceToLine(other.road.start, other.road.end),
            distance2 = _segment$road$end$dis.distance2,
            pointOnLine = _segment$road$end$dis.pointOnLine,
            lineProj2 = _segment$road$end$dis.lineProj2,
            length2 = _segment$road$end$dis.length2;

        if (distance2 < _config.ROAD_SNAP_DISTANCE * _config.ROAD_SNAP_DISTANCE && lineProj2 >= 0 && lineProj2 <= length2) {
          var _point = pointOnLine;
          action.priority = 2;
          return {
            v: action.function = function () {
              segment.road.end = _point;
              segment.params.severed = true; // if intersecting lines are too similar don't continue

              if (util.minDegreeDifference(other.direction(), segment.direction() < _config.MINIMUM_INTERSECTION_DEVIATION)) {
                return false;
              }

              other.split(_point, segment, segments, tree);

              if (debugData) {
                debugData.intersectionsRadius = debugData.intersectionsRadius || [];
                debugData.intersectionsRadius.push(new _Point.default(_point.x, _point.y));
              }

              return true;
            }
          };
        }
      }
    };

    for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ret = _loop();

      if (_typeof(_ret) === "object") return _ret.v;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (action.function) return action.function();
  return true;
}

function globalGoals(previousSegment) {
  var newBranches = [];

  if (!previousSegment.params.severed) {
    var template = function template(direction, length, time, params) {
      return _SegmentFactory.default.usingDirection(previousSegment.road.end, direction, length, time, params);
    }; // used for highways or going straight on a normal branch


    var templateContinue = function templateContinue(direction) {
      return template(direction, previousSegment.length(), 0, previousSegment.params);
    }; // not using params, i.e. not highways


    var templateBranch = function templateBranch(direction) {
      return template(direction, _config.DEFAULT_SEGMENT_LENGTH, previousSegment.params.highway ? _config.NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY : 0);
    };

    var continueStraight = templateContinue(previousSegment.direction());

    var straightPop = _Heatmap.default.popOnRoad(continueStraight.road);

    if (previousSegment.params.highway) {
      var randomStraight = templateContinue(previousSegment.direction() + util.randomAngle(_config.FORWARD_ANGLE));

      var randomPop = _Heatmap.default.popOnRoad(randomStraight.road);

      var roadPop = randomPop > straightPop ? randomPop : straightPop;
      newBranches.push(randomPop > straightPop ? randomStraight : continueStraight);

      if (roadPop > _config.HIGHWAY_BRANCH_POPULATION_THRESHOLD) {
        if (Math.random() < _config.HIGHWAY_BRANCH_PROBABILITY) {
          var leftHighwayBranch = templateContinue(previousSegment.direction() - 90 + util.randomAngle(_config.BRANCH_ANGLE));
          newBranches.push(leftHighwayBranch);
        } else if (Math.random() < _config.HIGHWAY_BRANCH_PROBABILITY) {
          var rightHighwayBranch = templateContinue(previousSegment.direction() + 90 + util.randomAngle(_config.BRANCH_ANGLE));
          newBranches.push(rightHighwayBranch);
        }
      }
    } else if (straightPop > _config.NORMAL_BRANCH_POPULATION_THRESHOLD) {
      newBranches.push(continueStraight);
    }

    if (straightPop > _config.NORMAL_BRANCH_POPULATION_THRESHOLD) {
      if (Math.random() < _config.DEFAULT_BRANCH_PROBABILITY) {
        var leftBranch = templateBranch(previousSegment.direction() - 90 + util.randomAngle(_config.BRANCH_ANGLE));
        newBranches.push(leftBranch);
      } else if (Math.random() < _config.DEFAULT_BRANCH_PROBABILITY) {
        var rightBranch = templateBranch(previousSegment.direction() + 90 + util.randomAngle(_config.BRANCH_ANGLE));
        newBranches.push(rightBranch);
      }
    }
  }

  var _loop2 = function _loop2() {
    var branch = newBranches[_i2];

    branch.setUpBranchLinks = function () {
      // set up links between each current branch and each existing branch stemming from the previous segment
      previousSegment.links.forwards.forEach(function (link) {
        branch.links.backwards.push(link);
        link.linksForEndContaining(previousSegment).push(branch);
      });
      previousSegment.links.forwards.push(branch);
      branch.links.backwards.push(previousSegment);
    };
  };

  for (var _i2 = 0; _i2 < newBranches.length; _i2++) {
    _loop2();
  }

  return newBranches;
}

function generate(seed) {
  var debugData = {}; // TODO: change this to use seed data from user input

  noise.seed(Math.random());
  var queue = [];
  var rootSegment = new _Segment.default(seed, new _Point.default(seed.x + _config.HIGHWAY_SEGMENT_LENGTH, seed.y), 0, {
    highway: true
  });

  var oppositeDirection = _SegmentFactory.default.fromExisting(rootSegment);

  var newEnd = new _Point.default(rootSegment.road.start.x - _config.HIGHWAY_SEGMENT_LENGTH, oppositeDirection.road.end.y);
  oppositeDirection.road.end = newEnd;
  oppositeDirection.links.backwards.push(rootSegment);
  rootSegment.links.backwards.push(oppositeDirection);
  queue.push(rootSegment);
  queue.push(oppositeDirection);
  var segments = []; // TODO: bounds should be the bounding box of the polygon
  // maxObjects should vary based on the type of city area

  var treeParams = {
    x: seed.x,
    y: seed.y,
    width: _config.HIGHWAY_SEGMENT_LENGTH,
    height: _config.HIGHWAY_SEGMENT_LENGTH
  };
  var tree = new _QuadTree.default(treeParams, _config.QUADTREE_MAX_OBJECTS, _config.QUADTREE_MAX_LEVELS);

  var _loop3 = function _loop3() {
    // pop smallest r(ti, ri, qi) from Q (i.e. smallest time)
    var minT = undefined;
    var minT_i = 0;
    queue.forEach(function (segment, i) {
      if (!minT || segment.time < minT) {
        minT = segment.time;
        minT_i = i;
      }
    });
    var minSegment = queue.splice(minT_i, 1)[0];
    var accepted = localConstraints(minSegment, segments, tree, debugData);

    if (accepted) {
      if (minSegment.setUpBranchLinks) {
        minSegment.setUpBranchLinks();
      }

      minSegment.addSegment(segments, tree);
      globalGoals(minSegment).forEach(function (segment) {
        segment.time += minSegment.time + 1;
        queue.push(segment);
      });
    }
  };

  while (queue.length && segments.length < _config.SEGMENT_COUNT_LIMIT) {
    _loop3();
  }

  var id = 0;

  for (var _i3 = 0; _i3 < segments.length; _i3++) {
    var segment = segments[_i3];
    segment.id = id++;
  }

  return segments;
}
},{"./config.js":"src/config.js","./util.js":"src/util.js","./../third_party/perlin.js":"third_party/perlin.js","./classes/Point.js":"src/classes/Point.js","./classes/Heatmap.js":"src/classes/Heatmap.js","./classes/Segment.js":"src/classes/Segment.js","./classes/QuadTree.js":"src/classes/QuadTree.js","./classes/SegmentFactory.js":"src/classes/SegmentFactory.js"}],"src/draw.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawSegment = drawSegment;

function drawSegment(context, segment) {
  context.strokeStyle = segment.params.highway ? '#FF0000' : '#000000';
  context.lineWidth = segment.width;
  context.beginPath();
  context.moveTo(segment.road.start.x, segment.road.start.y);
  context.lineTo(segment.road.end.x, segment.road.end.y);
  context.closePath();
  context.stroke();
}
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _Point = _interopRequireDefault(require("./classes/Point.js"));

var generator = _interopRequireWildcard(require("./generation.js"));

var draw = _interopRequireWildcard(require("./draw.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.85; // canvas is 85vw

canvas.height = window.innerHeight;
document.getElementById('generate').addEventListener('click', function (event) {
  context.clearRect(0, 0, canvas.width, canvas.height); // seed is the point at which the highway starts

  var seed = new _Point.default(canvas.width / 2, canvas.height / 2);
  var segments = generator.generate(seed);
  segments.forEach(function (segment) {
    return draw.drawSegment(context, segment);
  });
});
},{"./classes/Point.js":"src/classes/Point.js","./generation.js":"src/generation.js","./draw.js":"src/draw.js"}],"../../../.nvm/versions/node/v6.9.3/lib/node_modules/parcel-bundler/lib/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63588" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../.nvm/versions/node/v6.9.3/lib/node_modules/parcel-bundler/lib/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.map