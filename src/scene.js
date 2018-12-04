const THREE = require('three');
THREE.OrbitControls = require('three-orbitcontrols');

const options = {};

export function init() {
  options.renderer = new THREE.WebGLRenderer({antialias: true});
  // options.renderer.shadowMap.enabled = true;
  // options.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  options.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(options.renderer.domElement);
  window.scrollTo(0, window.innerHeight);

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

export function create(segments, buildings) {
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
    const height = side * (Math.random() + 1); // TODO: use perlin noise?
    const buildingGeometry = new THREE.BoxGeometry(side, height, side);
    const mesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
    mesh.position.set(building.center.x - window.innerWidth / 2, height / 2, building.center.y - window.innerHeight / 2);
    // mesh.castShadow = true;
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
  	// required if controls.enableDamping or controls.autoRotate are set to true
  	options.controls.update();
  	options.renderer.render(options.scene, options.camera);
  }
  animate();
}
