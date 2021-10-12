class Sphere extends THREE.Mesh {
  constructor(x, y, z, color) {
    super(new THREE.SphereGeometry(0.13, 13, 13), new THREE.MeshBasicMaterial({color: color}));
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.outgoingLines = [];
  }
}

class Cube extends THREE.Object3D {
  constructor(centerX, centerY, centerZ) {
    super(new THREE.Group());
    this.edges = [[0, 1], [1, 3], [2, 0], [3, 2], [4, 5], [5, 7], [6, 4], [7, 6], [0, 4], [1, 5], [2, 6], [3, 7]]; // Serial numbers of spheres (in 'this.spheres' array) which mast be connected with edge lines
    this.spheres = [];

    // Creates spheres at cube's tops
    let hue = Math.floor(Math.random() * 361);
    for (let x = centerX - 0.5; x < centerX + 1; x += 1) {
      for (let y = centerY - 0.5; y < centerY + 1; y += 1) {
        for (let z = centerZ - 0.5; z < centerZ + 1; z += 1) {
          let sphereColor = `hsl(${hue}, 100%, 50%)`;
          let currentSphere = new Sphere(x, y, z, sphereColor);
          this.add(currentSphere);
          this.spheres.push(currentSphere);
          hue += 45;
        }
      }
    }

    // Creates cube's edges
    this.edges.forEach((verticesPair) => {
      const geometry = new THREE.Geometry();
      const vertice0 = this.spheres[verticesPair[0]].position;
      const vertice1 = this.spheres[verticesPair[1]].position;

      geometry.vertices.push(
        new THREE.Vector3(vertice0.x, vertice0.y, vertice0.z),
        new THREE.Vector3(vertice1.x, vertice1.y, vertice1.z)
      );
      const currentLine = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0x000000}));
      this.add(currentLine);
      
      this.spheres[verticesPair[0]].outgoingLines.push(currentLine);
      this.spheres[verticesPair[1]].outgoingLines.push(currentLine);
    });
  }

  setEdgesColor(intersects) {
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object instanceof Sphere) {
        intersects[i].object.outgoingLines[0].material.color.set(intersects[i].object.material.color);
        intersects[i].object.outgoingLines[1].material.color.set(intersects[i].object.material.color);
        intersects[i].object.outgoingLines[2].material.color.set(intersects[i].object.material.color);
        break;
      }
    }
  }

  rotate(angle) {
    this.rotation.x += angle;
    this.rotation.y += angle;
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

function createCubes(quantityOfCubes) {
  const getRandomValue = () => Math.floor(-1.5 + Math.random() * 3.5);

  const cubes = [];

  for(let i = 0; i < quantityOfCubes; i++) {
    const cube = new Cube(getRandomValue(), getRandomValue(), getRandomValue());
    scene.add(cube);
    cube.rotate(getRandomValue()/4 + getRandomValue()/4);

    cubes.push(cube);
  }

  return cubes;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isAlreadyColored = false;


function onMouseMove(event) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects(scene.children, true);

  for (const cube of cubes) {
      cube.setEdgesColor(intersects);
  }
}

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  scene.rotation.x += 0.0005;
  scene.rotation.y += 0.0005;
};

window.addEventListener('click', onMouseMove, false);

const n = prompt("You may click the spheres at cube's tops to colorize the corresponding faces to the color of the sphere\n\nEnter amount of cubes:\n\n", 5);

const cubes = createCubes(n);
animate();