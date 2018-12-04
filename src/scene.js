const THREE = require('three');
THREE.OrbitControls = require('three-orbitcontrols');

const options = {};

export function init() {
  options.renderer = new THREE.WebGLRenderer();
  options.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(options.renderer.domElement);
  window.scrollTo(0, window.innerHeight);

  options.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
  options.controls = new THREE.OrbitControls(options.camera);
  options.camera.position.set(250, 250, 250);
  options.camera.lookAt(0, 0, 0);
  options.controls.update();
  options.scene = new THREE.Scene();
}

export function create(segments, buildings) {
  // highways and roads
  const highwayMaterial = new THREE.LineBasicMaterial({
    color: '#AA1E22',
    linewidth: 5
  });
  const roadMaterial = new THREE.LineBasicMaterial({
    color: '#00FF00',
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
  const buildingMaterial = new THREE.MeshBasicMaterial({color: '#0000FF'});
  for (const building of buildings) {
    const side = building.diagonal / Math.sqrt(2); // TODO: make this respect aspectRatio
    const height = side * (Math.random() + 1); // TODO: use perlin noise?
    const buildingGeometry = new THREE.BoxGeometry(side, height, side);
    const mesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
    mesh.position.x = building.center.x - window.innerWidth / 2;
    mesh.position.y = height / 2;
    mesh.position.z = building.center.y - window.innerHeight / 2;
    options.scene.add(mesh);
  }

  // create a large ground plane
  const geometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2);
  const planeMaterial = new THREE.MeshBasicMaterial({color: '#FFFFFF', side: THREE.DoubleSide});
  const plane = new THREE.Mesh(geometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -0.1;
  options.scene.add(plane);

  function animate() {
  	requestAnimationFrame(animate);
  	// required if controls.enableDamping or controls.autoRotate are set to true
  	options.controls.update();
  	options.renderer.render(options.scene, options.camera);
  }
  animate();
}
