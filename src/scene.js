const THREE = require('three');
THREE.OrbitControls = require('three-orbitcontrols');

import { randomRange } from './util.js';
import Building from './classes/Building.js';
import Polygon from './classes/Polygon.js';

const options = {};

export function init() {
  const canvas3d = document.getElementById('scene');
  canvas3d.style.zIndex = 5;
  options.renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas3d});
  options.renderer.setSize(window.innerWidth, window.innerHeight);
  // options.renderer.shadowMap.enabled = true;
  // options.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  options.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
  options.controls = new THREE.OrbitControls(options.camera);
  options.camera.position.set(250, 250, 250);
  options.camera.lookAt(0, 0, 0);
  options.controls.minDistance = 1;
  options.controls.maxDistance = 1000;
  options.controls.update();
  options.scene = new THREE.Scene();

  const light = new THREE.PointLight('#FFFFFF', 0.2, 0, 0.1);
  light.position.set(25, 150, 25);
  // light.shadow.camera.near = 1;
  // light.shadow.camera.far = 5000;
  // light.castShadow = true;
  options.scene.add(light);
  options.scene.add(new THREE.AmbientLight('#777'));
}

export function create(segments, buildings, polygons) {
  // highways and roads
  const highwayMaterial = new THREE.LineBasicMaterial({
    color: '#AA1E22',
    linewidth: 5
  });
  const roadMaterial = new THREE.LineBasicMaterial({
    color: '#000000',
    linewidth: 2
  });
  for (let i = 0; i < segments.length; i++) {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(segments[i].road.start.x - window.innerWidth / 2, 0, segments[i].road.start.y - window.innerHeight / 2));
    geometry.vertices.push(new THREE.Vector3(segments[i].road.end.x - window.innerWidth / 2, 0, segments[i].road.end.y - window.innerHeight / 2));
    const line = new THREE.Line(geometry, segments[i].params.highway ? highwayMaterial : roadMaterial);
    options.scene.add(line);
  }

  // buildings
  const buildingMaterial = new THREE.MeshPhongMaterial({color: '#0000FF'});
  for (const building of buildings) {
    const side = building.diagonal / Math.sqrt(2); // TODO: make this respect aspectRatio
     // TODO: use perlin noise for height?
    const height = building.type === Building.Type.SKYSCRAPER ? randomRange(side * 2, side * 6) : side + Math.random() * 2;
    const geometry = new THREE.BoxGeometry(side, height, side);
    const mesh = new THREE.Mesh(geometry, buildingMaterial);
    mesh.position.set(building.center.x - window.innerWidth / 2, height / 2, building.center.y - window.innerHeight / 2);
    mesh.rotation.y = building.direction * Math.PI / 180;
    // mesh.castShadow = true;
    // mesh.receiveShadow = true;
    options.scene.add(mesh);
  }

  // water and parks
  for (const polygon of polygons) {
    const shape = new THREE.Shape();
    const start = polygon.edges.shift();
    shape.moveTo(start.x - window.innerWidth / 2, start.y - window.innerHeight / 2);
    polygon.edges.forEach(point => shape.lineTo(point.x - window.innerWidth / 2, point.y - window.innerHeight / 2));

    const geometry = new THREE.ShapeBufferGeometry(shape);
    const material = new THREE.MeshPhongMaterial({ color: Polygon.Color[polygon.color], side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    // mesh.receiveShadow = true;
    options.scene.add(mesh);
  }

  // create a large ground plane
  const geometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2);
  const planeMaterial = new THREE.MeshPhongMaterial({color: '#FFFFFF', side: THREE.DoubleSide});
  const plane = new THREE.Mesh(geometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -0.1;
  // plane.receiveShadow = true;
  options.scene.add(plane);

  function animate() {
  	requestAnimationFrame(animate);
  	options.controls.update();
  	options.renderer.render(options.scene, options.camera);
  }
  animate();
}
