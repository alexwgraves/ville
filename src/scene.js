const THREE = require('three');
THREE.OrbitControls = require('three-orbitcontrols');

import { randomRange, randomColor } from './util.js';
import Building from './classes/Building.js';
import Polygon from './classes/Polygon.js';
import Point from './classes/Point.js';

const options = {};

function getCornerVertices(corners, height) {
  return [
    // SIDE ONE
    corners[0].x, 0, corners[0].y, corners[1].x, 0, corners[1].y, corners[1].x, height, corners[1].y,
    corners[1].x, height, corners[1].y, corners[0].x, height, corners[0].y, corners[0].x, 0, corners[0].y,
    // SIDE TWO
    corners[1].x, 0, corners[1].y, corners[2].x, 0, corners[2].y, corners[2].x, height, corners[2].y,
    corners[2].x, height, corners[2].y, corners[1].x, height, corners[1].y, corners[1].x, 0, corners[1].y,
    // SIDE THREE
    corners[2].x, 0, corners[2].y, corners[3].x, 0, corners[3].y, corners[3].x, height, corners[3].y,
    corners[3].x, height, corners[3].y, corners[2].x, height, corners[2].y, corners[2].x, 0, corners[2].y,
    // SIDE FOUR
    corners[3].x, 0, corners[3].y, corners[0].x, 0, corners[0].y, corners[0].x, height, corners[0].y,
    corners[0].x, height, corners[0].y, corners[3].x, height, corners[3].y, corners[3].x, 0, corners[3].y
  ]
}

function getTopVertices(corners, height, type) {
  // create a peaked roof for residential buildings
  if (type === Building.Type.RESIDENTIAL) {
    const midpoint = new Point(corners.reduce((acc, n) => acc + n.x, 0) / 4, corners.reduce((acc, n) => acc + n.y, 0) / 4);
    return [
      // ROOF
      corners[0].x, height, corners[0].y, corners[1].x, height, corners[1].y, midpoint.x, height + height / 3, midpoint.y,
      corners[1].x, height, corners[1].y, corners[2].x, height, corners[2].y, midpoint.x, height + height / 3, midpoint.y,
      corners[2].x, height, corners[2].y, corners[3].x, height, corners[3].y, midpoint.x, height + height / 3, midpoint.y,
      corners[3].x, height, corners[3].y, corners[0].x, height, corners[0].y, midpoint.x, height + height / 3, midpoint.y
    ]
  } else {
    return [
      // TOP
      corners[0].x, height, corners[0].y, corners[1].x, height, corners[1].y, corners[2].x, height, corners[2].y,
      corners[2].x, height, corners[2].y, corners[3].x, height, corners[3].y, corners[0].x, height, corners[0].y
    ]
  }
}

export function init() {
  const canvas3d = document.getElementById('scene');
  canvas3d.style.zIndex = 5;
  document.getElementById('controls').style.display = 'flex';
  options.renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas3d});
  options.renderer.setSize(window.innerWidth, window.innerHeight);
  options.renderer.shadowMap.enabled = true;
  options.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  options.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
  options.controls = new THREE.OrbitControls(options.camera, options.renderer.domElement);
  options.camera.position.set(250, 250, 250);
  options.camera.lookAt(0, 0, 0);
  options.controls.minDistance = 1;
  options.controls.maxDistance = 1000;
  options.controls.update();
  options.scene = new THREE.Scene();

  options.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
	options.scene.fog = new THREE.Fog(scene.background, 1, 5000);

  // add hemisphere light for ambient lighting
  const hemisphere = new THREE.HemisphereLight(0xffffff, 0x333333, 0.8);
  hemisphere.color.setRGB(50 / 255, 50 / 255, 50 / 255);
	hemisphere.position.set(0, 50, 0);
	options.scene.add(hemisphere);

  // use point light for sun
  const pointLight = new THREE.PointLight(0xe9f4f7, 0.6, 0, 2);
  pointLight.position.set(256, 800, 256);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  pointLight.shadow.camera.left = -5;
	pointLight.shadow.camera.right = 5;
	pointLight.shadow.camera.top = 5;
	pointLight.shadow.camera.bottom = -5;
	pointLight.shadow.camera.far = 5000;
	pointLight.shadow.bias = -0.0001;
  options.scene.add(pointLight);
}

export function create(segments, buildings, polygons) {
  // highways and roads
  const highway = new THREE.MeshLambertMaterial({ color: '#111111', side: THREE.DoubleSide });
  const road = new THREE.MeshLambertMaterial({ color: '#333333', side: THREE.DoubleSide });
  for (const segment of segments) {
    const start = new Point(segment.road.start.x - window.innerWidth / 2, segment.road.start.y - window.innerHeight / 2);
    const end = new Point(segment.road.end.x - window.innerWidth / 2, segment.road.end.y - window.innerHeight / 2);
    const radians = segment.direction() * Math.PI / 180;
    const width = segment.width / 2;

    const geometry = new THREE.BufferGeometry();
    const y = segment.params.highway ? 0.1 : 0.095;
    const vertices = new Float32Array([
      start.x + Math.cos(radians + Math.PI) * width, y, start.y + Math.sin(radians + Math.PI) * width,
      start.x + Math.cos(radians) * width, y, start.y + Math.sin(radians) * width,
      end.x + Math.cos(radians) * width, y, end.y + Math.sin(radians) * width,
      end.x + Math.cos(radians) * width, y, end.y + Math.sin(radians) * width,
      end.x + Math.cos(radians + Math.PI) * width, y, end.y + Math.sin(radians + Math.PI) * width,
      start.x + Math.cos(radians + Math.PI) * width, y, start.y + Math.sin(radians + Math.PI) * width
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // calculate geometry normals so lights will apply
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, segment.params.highway ? highway : road);
    mesh.receiveShadow = true;
    options.scene.add(mesh);
  }

  // buildings
  for (const building of buildings) {
    // adjust buildings corners to local origin
    const corners = building.corners.map(corner => new Point(corner.x - window.innerWidth / 2, corner.y - window.innerHeight / 2));
    const side = building.diagonal * 2 / Math.sqrt(2);
    const height = building.type === Building.Type.SKYSCRAPER ? randomRange(side * 2, side * 6) : side + Math.random();

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([...getCornerVertices(corners, height), ...getTopVertices(corners, height, building.type)]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // calculate geometry normals so lights will apply
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial({ color: randomColor(), side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    options.scene.add(mesh);
  }

  // water and parks
  for (const polygon of polygons) {
    const edges = polygon.edges.map(point => new Point(point.x - window.innerWidth / 2, point.y - window.innerHeight / 2))
    const shape = new THREE.Shape(edges);
    const geometry = new THREE.ShapeBufferGeometry(shape);
    const material = new THREE.MeshPhongMaterial({ color: Polygon.Color[polygon.color], side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = 0.09;
    mesh.receiveShadow = true;
    options.scene.add(mesh);
  }

  // create a large ground plane
  const geometry = new THREE.PlaneGeometry(10000, 10000);
  const material = new THREE.MeshPhongMaterial({ color: '#FFFFFF', side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = Math.PI / 2;
  plane.receiveShadow = true;
  options.scene.add(plane);

  function animate() {
  	requestAnimationFrame(animate);
  	options.controls.update();
  	options.renderer.render(options.scene, options.camera);
  }
  animate();
}
