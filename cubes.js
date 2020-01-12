// Serial numbers of spheres (in 'Cube.spheres' array) which mast be connected with edge lines
const edges = [[0, 1], [1, 3], [2, 0], [3, 2], [4, 5], [5, 7], [6, 4], [7, 6], [0, 4], [1, 5], [2, 6], [3, 7]];

class Sphere extends THREE.Mesh {
  constructor(x, y, z, color) {
    super(new THREE.SphereGeometry(0.1, 13, 13), new THREE.MeshBasicMaterial({color: color}));
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

class Cube extends THREE.Object3D {
  constructor() {
    super(new THREE.Group());
    this.spheres = [];

    let hue = Math.floor(Math.random() * 361);
    for (let x = -0.5; x < 1; x += 1) {
      for (let y = -0.5; y < 1; y += 1) {
        for (let z = -0.5; z < 1; z += 1) {
          let sphereColor = `hsl(${hue}, 100%, 50%)`;
          this.add(new Sphere(x, y, z, sphereColor));
          this.spheres.push({x: x, y: y, z: z, color: sphereColor});
          hue += 45;
        }
      }
    }

    edges.forEach((verticesPair) => {
      let geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(this.spheres[verticesPair[0]].x, this.spheres[verticesPair[0]].y, this.spheres[verticesPair[0]].z),
        new THREE.Vector3(this.spheres[verticesPair[1]].x, this.spheres[verticesPair[1]].y, this.spheres[verticesPair[1]].z)
      );
      this.add(new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xfff40b})));
    });

    // this.rotation.x += 0.5;
    // this.rotation.y += 0.5;
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube = new Cube();

scene.add(cube);

camera.position.z = 5;

const animate = () => {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.001;
  cube.rotation.y += 0.001;

  renderer.render(scene, camera);
};

// console.log(spheres);

animate();