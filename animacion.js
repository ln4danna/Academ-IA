import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const scene = new THREE.Scene();

// 🎥 Cámara un poco más alejada
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 16;

// 🧩 Renderizador con reflejos suaves
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
document.getElementById('container3Drobot').appendChild(renderer.domElement);

// 💡 Iluminación más realista
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(200, 200, 300);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-200, 100, 100);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
rimLight.position.set(0, 300, -200);
scene.add(rimLight);

let bee;
let mixer;

// 🦾 Cargar modelo GLB
const loader = new GLTFLoader();
loader.load(
  '/futuristic_flying_animated_robot_-_low_poly.glb',
  function (gltf) {
    bee = gltf.scene;
    bee.scale.set(1, 1, 1);
    scene.add(bee);

    // Material metálico sutil ⚙️
    bee.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.6;
        child.material.roughness = 0.4;
      }
    });

    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(bee);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }

    // Posición inicial (más arriba)
    bee.position.set(-2, -1.0, 0);
    bee.rotation.set(0, 0.4, 0);

    // 🌊 Flotación sutil
    gsap.to(bee.position, {
      y: bee.position.y + 0.2,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  },
  undefined,
  function (error) {
    console.error('Error al cargar el modelo:', error);
  }
);

// 📜 Posiciones ajustadas (más movimiento a los lados)
const arrPositionModel = [
  {
    id: 'intro',
    position: { x: -2.5, y: -1.5, z: 0 }, // izquierda más marcada
    rotation: { x: 0, y: 0.4, z: 0 },
  },
  {
    id: 'aboutus',
    position: { x: 2.5, y: -1.3, z: 0 }, // derecha más marcada
    rotation: { x: 0, y: -0.4, z: 0 },
  },
];

// 🚀 Movimiento con scroll
function modelMove() {
  const sections = document.querySelectorAll('.section');
  let currentSection = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      currentSection = section.id;
    }
  });

  const activeIndex = arrPositionModel.findIndex((val) => val.id === currentSection);
  if (activeIndex >= 0 && bee) {
    const target = arrPositionModel[activeIndex];
    gsap.to(bee.position, {
      x: target.position.x,
      y: target.position.y,
      z: target.position.z,
      duration: 3,
      ease: 'power1.inOut',
    });
    gsap.to(bee.rotation, {
      x: target.rotation.x,
      y: target.rotation.y,
      z: target.rotation.z,
      duration: 3,
      ease: 'power1.inOut',
    });
  }
}

window.addEventListener('scroll', modelMove);

// 🎬 Animación principal
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.02);
  renderer.render(scene, camera);
}
animate();

// 🔁 Responsive
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
