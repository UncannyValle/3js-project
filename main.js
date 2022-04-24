import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import moonImg from "./moon.jpeg"
import selfieImg from "./selfie.jpg"
import spaceImg from "./space_img.webp"
import bumpsImg from "./bumps.jpeg"

//container that holds all your cameras and lights
const scene = new THREE.Scene();

//perspective camera used to see things inside the scene, mimics what the human eye can see. Takes in FOV as first argument and the screen's aspect ratio as the second argument.
//the other two arguments are for the view frustum and are used to see what items are visible relative to the camera itself
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//makes the MAGIC happen! renders the d graphics into the scene
const renderer = new THREE.WebGLRenderer({
  //must tell the renderer what DOM element it must render in.
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
//fullscreen canvas
renderer.setSize(window.innerWidth, window.innerHeight);

//move the camera from the middle of the screen and into the z axis
camera.position.setZ(30);

// renderer.render(scene, camera);

//to create a 3D object there are three variables taht need to be considered

//Geometry are the XYZ points that make up a shape
//these can be found in THREE.js docs
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//Material is the wrapping paper that goes around a 3d object
//there are some built in ones within THREE.js that can be found in the docs
//can also be built as shaders using WebGL
//EX: MeshBasicMaterial creates a basic wireframe object; MeshStandardObject makes an object that reacts to light bouncing off of it
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  // wireframe: true, // wireframe for MeshBasicLighting
});
//The last step is to create a Mesh that combines the geometry with the material
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
//a light is needed when working with Standard Objects
//Point light is one of many light sources in THREE.js, it works as an omnidirectional light akin to a ligthbulb
const pointLight = new THREE.PointLight(0xffffff);
//Ambient light creates a ligth that lights up the whole scene
const ambientLight = new THREE.AmbientLight(0xffffff);

//to position the light source in the scene
pointLight.position.set(15, 5, 5);

//a little helper that shows where the light source is coming from, takes in the light you want to see as an argument;
const lightHelper = new THREE.PointLightHelper(pointLight);

//a little helper that shows you a grid of the scene
const gridHelper = new THREE.GridHelper(200, 10);

//OrbitControls allows you to move the camera with your mouse, it takes in the camera and renderer.DOMelement as arguments and updates the camera to the mouse controls input
const controls = new OrbitControls(camera, renderer.domElement);

//here we will instantiate multiple objects
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial(0xffffff);
  const star = new THREE.Mesh(geometry, material);

  //destructure an array with coordinates xyz. Then create an Array with three random numbers using Three.js MathUtils helper function to creat a random float number between 0 and the number passed.
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  //here the star's coordinates are set then added to the scene
  star.position.set(x, y, z);
  scene.add(star);
}
//create an array of a predetermined size and then fill with a new star
Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load(spaceImg);

//gets added to the scene to be viewed
scene.add(pointLight, ambientLight, torus, lightHelper, gridHelper);
scene.background = spaceTexture;

//Avatar using texture mapping
const julianTexture = new THREE.TextureLoader().load(selfieImg);
const julian = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: julianTexture })
);
scene.add(julian);

//sphere moon object mapped
const moonTexture = new THREE.TextureLoader().load(moonImg);
const moonBumps = new THREE.TextureLoader().load(bumpsImg);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(5, 24, 24),
  new THREE.MeshStandardMaterial({
    normalMap: moonBumps,
    map: moonTexture,
  })
);
scene.add(moon);
moon.position.setZ(30);
moon.position.setX(-10);

//this will make the camera move when scrolling down
function moveCamera() {
  //calculate where the user is currently scrolled to
  const positionTop = document.body.getBoundingClientRect().top;

  moon.rotateX(0.05);
  moon.rotateY(0.075);
  moon.rotateZ(0.05);
  // julian.rotateX(0.005);
  julian.rotateY(0.01);
  julian.rotateZ(0.01);

  camera.position.z = positionTop * -0.01;
  camera.position.y = positionTop * -0.0002;
  camera.rotation.x = positionTop * -0.0002;
}
document.body.onscroll = moveCamera;

//to not have to call the renderer over and over in the code, create recursive function, to make an infinite loop that call the render method automatically
function animate() {
  // tells the browser that you want to perform an animation
  requestAnimationFrame(animate);
  //to add any animations they need to be added within the recursive function
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.001;

  //update the camera using mouse controls
  controls.update();
  renderer.render(scene, camera);
}
animate();
