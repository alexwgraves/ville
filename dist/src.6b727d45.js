parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"hpvp":[function(require,module,exports) {
"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function n(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var i=function(){function e(n,i){t(this,e),this.x=n,this.y=i}return n(e,[{key:"length",value:function(){return Math.sqrt(this.length2())}},{key:"length2",value:function(){return this.x*this.x+this.y*this.y}},{key:"distance",value:function(t){return t.minus(this).length()}},{key:"distance2",value:function(t){return t.minus(this).length2()}},{key:"equals",value:function(t){return this.x===t.x&&this.y===t.y}},{key:"scalarMultiply",value:function(t){return new e(this.x*t,this.y*t)}},{key:"add",value:function(t){return new e(this.x+t.x,this.y+t.y)}},{key:"minus",value:function(t){return new e(this.x-t.x,this.y-t.y)}},{key:"dot",value:function(t){return this.x*t.x+this.y*t.y}},{key:"cross",value:function(t){return this.x*t.y-this.y*t.x}},{key:"angle",value:function(t){return 180*Math.acos(this.dot(t)/(this.length()*t.length()))/Math.PI}},{key:"project",value:function(t){return t.scalarMultiply(this.dot(t)/t.length())}},{key:"distanceToLine",value:function(t,e){var n=this.minus(t),i=e.minus(t),u=n.project(i),r=t.add(u),s=n.dot(i),a=s<0?-1:s>0?1:0;return{distance2:r.distance2(this),pointOnLine:r,lineProj2:a*u.length2(),length2:i.length2()}}}]),e}();exports.default=i;
},{}],"nZps":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.QUADTREE_MAX_LEVELS=exports.QUADTREE_MAX_OBJECTS=exports.NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY=exports.MIN_SPEED_PROPORTION=exports.MINIMUM_INTERSECTION_DEVIATION=exports.ROAD_SNAP_DISTANCE=exports.NORMAL_BRANCH_POPULATION_THRESHOLD=exports.HIGHWAY_BRANCH_POPULATION_THRESHOLD=exports.DEFAULT_BRANCH_PROBABILITY=exports.HIGHWAY_BRANCH_PROBABILITY=exports.FORWARD_ANGLE=exports.BRANCH_ANGLE=exports.SEGMENT_COUNT_LIMIT=exports.HIGHWAY_SEGMENT_LENGTH=exports.DEFAULT_SEGMENT_LENGTH=exports.HIGHWAY_SEGMENT_WIDTH=exports.DEFAULT_SEGMENT_WIDTH=void 0;var _=1;exports.DEFAULT_SEGMENT_WIDTH=_;var E=2;exports.HIGHWAY_SEGMENT_WIDTH=E;var A=30;exports.DEFAULT_SEGMENT_LENGTH=A;var T=40;exports.HIGHWAY_SEGMENT_LENGTH=T;var N=500;exports.SEGMENT_COUNT_LIMIT=N;var r=3;exports.BRANCH_ANGLE=r;var I=15;exports.FORWARD_ANGLE=I;var H=.05;exports.HIGHWAY_BRANCH_PROBABILITY=H;var e=.4;exports.DEFAULT_BRANCH_PROBABILITY=e;var R=.1;exports.HIGHWAY_BRANCH_POPULATION_THRESHOLD=R;var O=.1;exports.NORMAL_BRANCH_POPULATION_THRESHOLD=O;var t=500;exports.ROAD_SNAP_DISTANCE=t;var o=30;exports.MINIMUM_INTERSECTION_DEVIATION=o;var s=.1;exports.MIN_SPEED_PROPORTION=s;var L=5;exports.NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY=L;var p=10;exports.QUADTREE_MAX_OBJECTS=p;var x=10;exports.QUADTREE_MAX_LEVELS=x;
},{}],"NKbW":[function(require,module,exports) {
"use strict";function n(n,r){return Math.random()*(r-n)+n}function r(n,r){var t=Math.abs(n-r)%180;return Math.min(t,Math.abs(t-180))}function t(r){for(var t=Math.pow(Math.abs(r),3),e=0;0===e||Math.random()<Math.pow(Math.abs(e),3)/t;)e=n(-r,+r);return e}function e(n){var r=n[0],t=0;return n.forEach(function(n,e){n<r&&(r=n,t=e)}),[r,t]}function a(n){var r=n[0],t=0;return n.forEach(function(n,e){n>r&&(r=n,t=e)}),[r,t]}Object.defineProperty(exports,"__esModule",{value:!0}),exports.minDegreeDifference=r,exports.randomAngle=t,exports.minAndIndex=e,exports.maxAndIndex=a;
},{}],"BXQ6":[function(require,module,exports) {
"use strict";function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function n(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function t(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.seed=s,exports.simplex2=h;var r=function(){function n(t,r,o){e(this,n),this.x=t,this.y=r,this.z=o}return t(n,[{key:"dot2",value:function(e,n){return this.x*e+this.y*n}}]),n}(),o=[new r(1,1,0),new r(-1,1,0),new r(1,-1,0),new r(-1,-1,0),new r(1,0,1),new r(-1,0,1),new r(1,0,-1),new r(-1,0,-1),new r(0,1,1),new r(0,-1,1),new r(0,1,-1),new r(0,-1,-1)],a=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],i=new Array(512),u=new Array(512);function s(e){e>0&&e<1&&(e*=65536),(e=Math.floor(e))<256&&(e|=e<<8);for(var n=0;n<256;n++){var t=1&n?a[n]^255&e:a[n]^e>>8&255;i[n]=i[n+256]=t,u[n]=u[n+256]=o[t%12]}}s(0);var f=.5*(Math.sqrt(3)-1),w=(3-Math.sqrt(3))/6,c=1/3,l=1/6;function h(e,n){var t=(e+n)*f,r=Math.floor(e+t),o=Math.floor(n+t),a=(r+o)*w,s=e-r+a,c=n-o+a,l=s>c?1:0,h=s>c?0:1,v=s-l+w,y=c-h+w,p=s-1+2*w,d=c-1+2*w,b=u[(r&=255)+i[o&=255]],x=u[r+l+i[o+h]],M=u[r+1+i[o+1]],m=.5-s*s-c*c,g=.5-v*v-y*y,j=.5-p*p-d*d;return 70*((m<0?0:(m*=m)*m*b.dot2(s,c))+(g<0?0:(g*=g)*g*x.dot2(v,y))+(j<0?0:(j*=j)*j*M.dot2(p,d)))}
},{}],"rTaa":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./../../third_party/perlin.js"));function t(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function o(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}var i=function(){function t(){r(this,t)}return o(t,null,[{key:"populationAt",value:function(t,r){var n=(e.simplex2(t/2e4,r/1e4)+1)/2,o=(e.simplex2(t/2e4+500,r/2e4+500)+1)/2,i=(e.simplex2(t/1e4+1e3,r/2e4+1e3)+1)/2;return Math.pow((n*o+i)/2,2)}},{key:"popOnRoad",value:function(e){return(this.populationAt(e.start.x,e.start.y)+this.populationAt(e.end.x,e.end.y))/2}}]),t}();exports.default=i;
},{"./../../third_party/perlin.js":"BXQ6"}],"Exiy":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("./Point.js"));function e(t){return t&&t.__esModule?t:{default:t}}function i(t,e){return s(t)||n(t,e)||r()}function r(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function n(t,e){var i=[],r=!0,n=!1,s=void 0;try{for(var o,p=t[Symbol.iterator]();!(r=(o=p.next()).done)&&(i.push(o.value),!e||i.length!==e);r=!0);}catch(c){n=!0,s=c}finally{try{r||null==p.return||p.return()}finally{if(n)throw s}}return i}function s(t){if(Array.isArray(t))return t}function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function p(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function c(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function h(t,e,i){return e&&c(t.prototype,e),i&&c(t,i),t}var u=function(){function e(t,i,r){p(this,e),this.object=t,this.type=i,this.properties=r,this.collisionRevision=0,this.limitsRevision=void 0,this.cachedLimits=void 0}return h(e,null,[{key:"Type",get:function(){return{RECT:"rect",LINE:"line",CIRCLE:"circle"}}}]),h(e,[{key:"updateCollisionProperties",value:function(t){for(var e in this.collisionRevision++,t)this.properties[e]=t[e]}},{key:"minCorner",value:function(t){var e=this.properties.corners[0];return this.properties.corners.forEach(function(i){i[t]<e[t]&&(e=i)}),e}},{key:"maxCorner",value:function(t){var e=this.properties.corners[0];return this.properties.corners.forEach(function(i){i[t]>e[t]&&(e=i)}),e}},{key:"limits",value:function(){return this.collisionRevision!==this.limitsRevision&&(this.limitsRevision=this.collisionRevision,this.type===e.Type.RECT?(minX=this.minCorner("x").x,minY=this.minCorner("y").y,this.cachedLimits={x:minX,y:minY,width:this.maxCorner("x").x-minX,height:this.maxCorner("y").y-minY,object:this.object}):this.type===e.Type.LINE?this.cachedLimits={x:Math.min(this.properties.start.x,this.properties.end.x),y:Math.min(this.properties.start.y,this.properties.end.y),width:Math.abs(this.properties.start.x-this.properties.end.x),height:Math.abs(this.properties.start.y-this.properties.end.y),object:this.object}:this.type===e.Type.CIRCLE&&(this.cachedLimits={x:this.properties.center.x-this.properties.radius,y:this.properties.center.y-this.properties.radius,width:2*this.properties.radius,height:2*this.properties.radius,object:this.object})),this.cachedLimits}},{key:"collide",value:function(t){var i=this.limits(),r=t.limits();if(i&&r&&(i.x+i.width<r.x||r.x+r.width<i.x)&&(i.y+i.height<r.y||r.y+r.height<i.y))return!1;this.type===e.Type.CIRCLE?t.type===e.Type.RECT&&t.rectCircleCollision(this):this.type===e.Type.RECT?t.type!==e.Type.CIRCLE?this.rectRectIntersection(t):this.rectCircleCollision(t):this.type===e.Type.LINE&&t.type!==e.Type.CIRCLE&&this.rectRectIntersection(t)}},{key:"rectCircleCollision",value:function(t){if(this.type!==e.Type.CIRCLE&&t.type===e.Type.CIRCLE){var i=(this.type===e.Type.LINE?this.rectPropsFromLine():this.properties).corners,r=t.properties.radius,n=!0,s=!1,o=void 0;try{for(var p,c=i[Symbol.iterator]();!(n=(p=c.next()).done);n=!0){if(p.value.distance2(t.properties.center)<=r*r)return!0;for(var h=0;h<i.length;h++){var u=i[h],a=i[(h+1)%i.length],l=t.properties.center.distanceToLine(u,a),y=l.distance2,f=(l.pointOnLine,l.lineProj2),m=l.length2;if(f>0&&f<m&&y<=r*r)return!0}var d=[i[3].minus(i[0]),i[3].minus(i[2])],v=t.properties.center.minus(i[0]),C=t.properties.center.minus(i[2]),x=[v.project(d[0]),C.project(d[1])],L=[v.dot(d[0]),C.dot(d[1])];return!(L[0]<0||x[0].length2()>d[0].length2()||L[1]<0||x[1].length2()>d[1].length2())}}catch(b){s=!0,o=b}finally{try{n||null==c.return||c.return()}finally{if(s)throw o}}}}},{key:"rectPropsFromLine",value:function(){if(this.type===e.Type.LINE){var i=this.properties.end.minus(this.properties.start),r=new t.default(-i.y,i.x),n=r.scalarMultiply(.5*this.properties.width/r.length());return{corners:[this.properties.start.add(n),this.properties.start.minus(n),this.properties.end.minus(n),this.properties.end.add(n)]}}}},{key:"rectRectIntersection",value:function(t){if(this.type!==e.Type.CIRCLE&&t.type!==e.Type.CIRCLE){for(var r=this.type===e.Type.LINE?this.rectPropsFromLine().corners:this.properties.corners,n=t.type===e.Type.LINE?t.rectPropsFromLine().corners:t.properties.corners,s=[r[3].minus(r[0]),r[3].minus(r[2]),n[0].minus(n[1]),n[0].minus(n[3])],p=[],c=function(){var t=s[h],e=r.map(function(e){return e.project(t)}),o=n.map(function(e){return e.project(t)}),c=e.map(function(e){return e.dot(t)}),u=o.map(function(e){return e.dot(t)}),a=i(util.maxAndIndex(c),2),l=a[0],y=a[1],f=i(util.minAndIndex(c),2),m=f[0],d=f[1],v=i(util.maxAndIndex(u),2),C=v[0],x=v[1],L=i(util.minAndIndex(u),2),b=L[0],E=L[1];if(l<b||C<m)return{v:!1};var T=e[y].minus(o[E]),I=o[x].minus(e[d]);T.length2()<I.length2()?p.push(T):p.push(I.scalarMultiply(-1))},h=0;h<s.length;h++){var u=c();if("object"===o(u))return u.v}var a=p[0];return p.forEach(function(t){t.length2()<a.length2()&&(a=t)}),a.scalarMultiply(-1)}}}]),e}();exports.default=u;
},{"./Point.js":"hpvp"}],"AU+w":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function n(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var i=function(){function t(n,i,r){e(this,t),this.start=n,this.end=i,this.segment=r}return n(t,[{key:"setStart",value:function(e){this.start=e,this.segment.collider.updateCollisionProperties({start:e}),this.segment.roadRevision++}},{key:"setEnd",value:function(e){this.end=e,this.segment.collider.updateCollisionProperties({end:e}),this.segment.roadRevision++}}]),t}();exports.default=i;
},{}],"qcWc":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("./Segment.js")),t=n(require("./Point.js"));function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function o(e,t,n){return t&&a(e.prototype,t),n&&a(e,n),e}var u=function(){function n(){r(this,n)}return o(n,null,[{key:"fromExisting",value:function(t,n,r,a){return n=n||t.time,r=r||t.road,a=a||t.params,new e.default(r.start,r.end,n,a)}},{key:"usingDirection",value:function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:90,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:DEFAULT_SEGMENT_LENGTH,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};r*=Math.PI/180;var i=n.x+a*Math.sin(r),l=n.y+a*Math.cos(r);return new e.default(n,new t.default(i,l),o,u)}}]),n}();exports.default=u;
},{"./Segment.js":"Uj5g","./Point.js":"hpvp"}],"Uj5g":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var i=require("./../config.js"),s=r(require("./Collision.js")),t=r(require("./Road.js")),e=r(require("./Point.js")),n=r(require("./SegmentFactory.js"));function r(i){return i&&i.__esModule?i:{default:i}}function a(i,s){if(!(i instanceof s))throw new TypeError("Cannot call a class as a function")}function d(i,s){for(var t=0;t<s.length;t++){var e=s[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}function o(i,s,t){return s&&d(i.prototype,s),t&&d(i,t),i}var h=function(){function r(e,n){var d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};a(this,r),this.start=e,this.end=n,this.time=d,this.params=o,this.width=o.highway?i.HIGHWAY_SEGMENT_WIDTH:i.DEFAULT_SEGMENT_WIDTH,this.collider=new s.default(this,s.default.Type.LINE,{start:e,end:n,width:this.width}),this.roadRevision=0,this.directionRevision=void 0,this.lengthRevision=void 0,this.cachedDirection=void 0,this.cachedLength=void 0,this.road=new t.default(e,n,this),this.time=d,this.params=o,this.links={backwards:[],forwards:[]},this.users=[],this.maxSpeed=o.highway?1200:800,this.capacity=o.highway?12:6}return o(r,null,[{key:"End",get:function(){return{START:"start",END:"end"}}}]),o(r,[{key:"currentSpeed",value:function(){return Math.min(i.MIN_SPEED_PROPORTION,1-Math.max(0,this.users.length-1)/this.capacity)*this.maxSpeed}},{key:"direction",value:function(){if(this.directionRevision!==this.roadRevision){this.directionRevision=this.roadRevision;var i=new e.default(0,1),s=this.road.end.minus(this.road.start),t=i.cross(s),n=t>0?-1:t<0?1:0;this.cachedDirection=n*i.angle(s)}return this.cachedDirection}},{key:"length",value:function(){return this.lengthRevision!==this.roadRevision&&(this.lengthRevision=this.roadRevision,this.cachedLength=this.road.start.distance(this.road.end)),this.cachedLength}},{key:"startIsBackwards",value:function(){return this.links.backwards.length?this.links.backwards[0].road.start.equals(this.road.start)||this.links.backwards[0].road.end.equals(this.road.start):this.links.forwards[0].road.start.equals(this.road.end)||this.links.forwards[0].road.end.equals(this.road.end)}},{key:"cost",value:function(){return this.length()/this.currentSpeed()}},{key:"costTo",value:function(i,s){this.endContaining(i);var t=s?(r.End.START,s):.5;return this.cost()*t}},{key:"neighbors",value:function(){return this.links.forwards.concat(this.links.backwards)}},{key:"endContaining",value:function(i){var s=this.startIsBackwards();return this.links.backwards.includes(i)?s?r.End.START:r.End.END:this.links.forwards.includes(i)?s?r.End.END:r.End.START:void 0}},{key:"linksForEndContaining",value:function(i){return this.links.backwards.includes(i)?this.links.backwards:this.links.forwards.includes(i)?this.links.forwards:void 0}},{key:"split",value:function(i,s,t,e){var r=this,a=this.startIsBackwards(),d=n.default.fromExisting(this);d.addSegment(t,e),d.road.setEnd(i),this.road.setStart(i),d.links.backwards=this.links.backwards.slice(0),d.links.forwards=this.links.forwards.slice(0);var o=a?d:this,h=a?this:d;(a?d.links.backwards:d.links.forwards).forEach(function(i){var s=i.links.backwards.indexOf(r);-1!==s?i.links.backwards[s]=d:(s=i.links.forwards.indexOf(r),i.links.forwards[s]=d)}),o.links.forwards=[s,h],h.links.backwards=[s,o],s.links.forwards.push(o),s.links.forwards.push(h)}},{key:"addSegment",value:function(i,s){i.push(this),s.insert(this.collider.limits())}}]),r}();exports.default=h;
},{"./../config.js":"nZps","./Collision.js":"Exiy","./Road.js":"AU+w","./Point.js":"hpvp","./SegmentFactory.js":"qcWc"}],"x6W/":[function(require,module,exports) {
"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}function i(t,i,s){return i&&e(t.prototype,i),s&&e(t,s),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var s=function(){function e(i){var s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4,h=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;t(this,e),this.bounds=i,this.maxObjects=s,this.maxLevels=n,this.level=h,this.objects=[],this.nodes=[]}return i(e,[{key:"subdivide",value:function(){var t=Math.round(this.bounds.width/2),i=Math.round(this.bounds.height/2),s=Math.round(this.bounds.x),n=Math.round(this.bounds.y);this.nodes[0]=new e({x:s+t,y:n,width:t,height:i},this.maxObjects,this.maxLevels,this.level+1),this.nodes[1]=new e({x:s,y:n,width:t,height:i},this.maxObjects,this.maxLevels,this.level+1),this.nodes[2]=new e({x:s,y:n+i,width:t,height:i},this.maxObjects,this.maxLevels,this.level+1),this.nodes[3]=new e({x:s+t,y:n+i,width:t,height:i},this.maxObjects,this.maxLevels,this.level+1)}},{key:"getIndex",value:function(t){var e=-1,i=this.bounds.x+this.bounds.width/2,s=this.bounds.y+this.bounds.height/2,n=t.y<s&&t.y+t.height<s,h=t.y>s;return t.x<i&&t.x+t.width<i?e=n?1:h?2:e:t.x>i&&(e=n?0:h?3:e),e}},{key:"insert",value:function(t){if(this.nodes.length){var e=this.getIndex(t);if(-1!==e)return this.nodes[e].insert(t)}if(this.objects.push(t),this.objects.length>this.maxObjects&&this.level<this.maxLevels){0===this.nodes.length&&this.subdivide();for(var i=0;i<this.objects.length;){var s=this.getIndex(this.objects[i]);-1!==s?this.nodes[s].insert(this.objects.splice(i,1)[0]):i++}}}},{key:"retrieve",value:function(t){var e=this.getIndex(t),i=this.objects;if(this.nodes.length)if(-1!==e)i=i.concat(this.nodes[e].retrieve(t));else{var s=!0,n=!1,h=void 0;try{for(var r,o=this.nodes[Symbol.iterator]();!(s=(r=o.next()).done);s=!0){var a=r.value;i=i.concat(a.retrieve(t))}}catch(l){n=!0,h=l}finally{try{s||null==o.return||o.return()}finally{if(n)throw h}}}return i}},{key:"clear",value:function(){this.objects=[];var t=!0,e=!1,i=void 0;try{for(var s,n=this.nodes[Symbol.iterator]();!(t=(s=n.next()).done);t=!0){s.value.clear()}}catch(h){e=!0,i=h}finally{try{t||null==n.return||n.return()}finally{if(e)throw i}}}}]),e}();exports.default=s;
},{}],"s9Z0":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.generate=A;var r=require("./config.js"),e=u(require("./util.js")),n=u(require("./../third_party/perlin.js")),t=d(require("./classes/Point.js")),a=d(require("./classes/Heatmap.js")),i=d(require("./classes/Segment.js")),o=d(require("./classes/QuadTree.js")),s=d(require("./classes/SegmentFactory.js"));function d(r){return r&&r.__esModule?r:{default:r}}function u(r){if(r&&r.__esModule)return r;var e={};if(null!=r)for(var n in r)if(Object.prototype.hasOwnProperty.call(r,n)){var t=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(r,n):{};t.get||t.set?Object.defineProperty(e,n,t):e[n]=r[n]}return e.default=r,e}function f(r){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}function c(r,e){for(var n=!1,t=r.start.x;t<r.end.x;t++)if(t>e.start.x&&t<e.end.x){n=!0;break}for(var a=!1,i=r.start.y;i<r.end.y;i++)if(i>e.start.y&&i<e.end.y){a=!0;break}return n&&a}function l(n,a,i,o){var s={priority:0,params:{}},d=i.retrieve(n.collider.limits()),u=!0,l=!1,p=void 0;try{for(var A,_=function(){var d=A.value.object;if(s.priority<5){var u=c(n.road,d.road);if(u&&(!s.params.time||u.time<actions.params.time))return s.params.time=u.time,s.priority=4,{v:s.function=function(){return!(e.minDegreeDifference(d.direction(),n.direction())<r.MINIMUM_INTERSECTION_DEVIATION)&&(d.split(u,n,a,i),n.road.end=u,segmentEnd.params.severed=!0,o&&(o.intersections=o.intersections||[],o.intersections.push(new t.default(u.x,u.y))),!0)}}}if(s.priority<4&&n.road.end.distance(d.road.end)<=r.ROAD_SNAP_DISTANCE){var f=d.road.end;return s.priority=3,{v:s.function=function(){n.road.end=f,n.params.severed=!0;var r=d.startIsBackwards()?d.links.forwards:d.links.backwards;return!r.some(function(r){return r.road.start.equals(n.road.end)&&r.road.end.equals(n.road.start)||r.road.start.equals(n.road.start)&&r.road.end.equals(n.road.end)})&&(r.forEach(function(r){r.linksForEndContaining(d).push(n),n.links.forwards.push(r)}),r.push(n),n.links.forwards.push(d),o&&(o.snaps=o.snaps||[],o.snaps.push(new t.default(f.x,f.y))),!0)}}}if(s.priority<3){var l=n.road.end.distanceToLine(d.road.start,d.road.end),p=l.distance2,_=l.pointOnLine,E=l.lineProj2,h=l.length2;if(p<r.ROAD_SNAP_DISTANCE*r.ROAD_SNAP_DISTANCE&&E>=0&&E<=h){var N=_;return s.priority=2,{v:s.function=function(){return n.road.end=N,n.params.severed=!0,!e.minDegreeDifference(d.direction(),n.direction()<r.MINIMUM_INTERSECTION_DEVIATION)&&(d.split(N,n,a,i),o&&(o.intersectionsRadius=o.intersectionsRadius||[],o.intersectionsRadius.push(new t.default(N.x,N.y))),!0)}}}}},E=d[Symbol.iterator]();!(u=(A=E.next()).done);u=!0){var h=_();if("object"===f(h))return h.v}}catch(N){l=!0,p=N}finally{try{u||null==E.return||E.return()}finally{if(l)throw p}}return!s.function||s.function()}function p(n){var t=[];if(!n.params.severed){var i=function(r,e,t,a){return s.default.usingDirection(n.road.end,r,e,t,a)},o=function(r){return i(r,n.length(),0,n.params)},d=function(e){return i(e,r.DEFAULT_SEGMENT_LENGTH,n.params.highway?r.NORMAL_BRANCH_TIME_DELAY_FROM_HIGHWAY:0)},u=o(n.direction()),f=a.default.popOnRoad(u.road);if(n.params.highway){var c=o(n.direction()+e.randomAngle(r.FORWARD_ANGLE)),l=a.default.popOnRoad(c.road),p=l>f?l:f;if(t.push(l>f?c:u),p>r.HIGHWAY_BRANCH_POPULATION_THRESHOLD)if(Math.random()<r.HIGHWAY_BRANCH_PROBABILITY){var A=o(n.direction()-90+e.randomAngle(r.BRANCH_ANGLE));t.push(A)}else if(Math.random()<r.HIGHWAY_BRANCH_PROBABILITY){var _=o(n.direction()+90+e.randomAngle(r.BRANCH_ANGLE));t.push(_)}}else f>r.NORMAL_BRANCH_POPULATION_THRESHOLD&&t.push(u);if(f>r.NORMAL_BRANCH_POPULATION_THRESHOLD)if(Math.random()<r.DEFAULT_BRANCH_PROBABILITY){var E=d(n.direction()-90+e.randomAngle(r.BRANCH_ANGLE));t.push(E)}else if(Math.random()<r.DEFAULT_BRANCH_PROBABILITY){var h=d(n.direction()+90+e.randomAngle(r.BRANCH_ANGLE));t.push(h)}}for(var N=function(){var r=t[m];r.setUpBranchLinks=function(){n.links.forwards.forEach(function(e){r.links.backwards.push(e),e.linksForEndContaining(n).push(r)}),n.links.forwards.push(r),r.links.backwards.push(n)}},m=0;m<t.length;m++)N();return t}function A(e){var a={};n.seed(Math.random());var d=[],u=new i.default(e,new t.default(e.x+r.HIGHWAY_SEGMENT_LENGTH,e.y),0,{highway:!0}),f=s.default.fromExisting(u),c=new t.default(u.road.start.x-r.HIGHWAY_SEGMENT_LENGTH,f.road.end.y);f.road.end=c,f.links.backwards.push(u),u.links.backwards.push(f),d.push(u),d.push(f);for(var A=[],_={x:e.x,y:e.y,width:r.HIGHWAY_SEGMENT_LENGTH,height:r.HIGHWAY_SEGMENT_LENGTH},E=new o.default(_,r.QUADTREE_MAX_OBJECTS,r.QUADTREE_MAX_LEVELS),h=function(){var r=void 0,e=0;d.forEach(function(n,t){(!r||n.time<r)&&(r=n.time,e=t)});var n=d.splice(e,1)[0];l(n,A,E,a)&&(n.setUpBranchLinks&&n.setUpBranchLinks(),n.addSegment(A,E),p(n).forEach(function(r){r.time+=n.time+1,d.push(r)}))};d.length&&A.length<r.SEGMENT_COUNT_LIMIT;)h();for(var N=0,m=0;m<A.length;m++){A[m].id=N++}return A}
},{"./config.js":"nZps","./util.js":"NKbW","./../third_party/perlin.js":"BXQ6","./classes/Point.js":"hpvp","./classes/Heatmap.js":"rTaa","./classes/Segment.js":"Uj5g","./classes/QuadTree.js":"x6W/","./classes/SegmentFactory.js":"qcWc"}],"3JeV":[function(require,module,exports) {
"use strict";function e(e,t){e.strokeStyle=t.params.highway?"#FF0000":"#000000",e.lineWidth=t.width,e.beginPath(),e.moveTo(t.road.start.x,t.road.start.y),e.lineTo(t.road.end.x,t.road.end.y),e.closePath(),e.stroke()}Object.defineProperty(exports,"__esModule",{value:!0}),exports.drawSegment=e;
},{}],"H99C":[function(require,module,exports) {
"use strict";var e=i(require("./classes/Point.js")),t=n(require("./generation.js")),r=n(require("./draw.js"));function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}function i(e){return e&&e.__esModule?e:{default:e}}var o=document.getElementById("canvas"),a=o.getContext("2d");o.width=.85*window.innerWidth,o.height=window.innerHeight,document.getElementById("generate").addEventListener("click",function(n){a.clearRect(0,0,o.width,o.height);var i=new e.default(o.width/2,o.height/2);t.generate(i).forEach(function(e){return r.drawSegment(a,e)})});
},{"./classes/Point.js":"hpvp","./generation.js":"s9Z0","./draw.js":"3JeV"}]},{},["H99C"], null)
//# sourceMappingURL=/ville/src.6b727d45.map