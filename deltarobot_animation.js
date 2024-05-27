// deltarobot_animation.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, loader, controls, currentModel;

const modelPaths = {
    "원위치": 'models/StaticModel.gltf',
    "1번 좌표": 'models/Animation1.gltf',
    "2번 좌표": 'models/Animation2.gltf',
    "3번 좌표": 'models/Animation3.gltf',
    "4번 좌표": 'models/Animation4.gltf'
};

// Initialize the scene
function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(0, 1, 0).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, 1).normalize();
    scene.add(directionalLight2);

    loader = new GLTFLoader();

    createGradientBackground();
    createGround();
    loadModel('원위치');

    animate();
}

// Create a gradient background
function createGradientBackground() {
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        void main() {
            vec3 topColor = vec3(0.5, 0.7, 1.0);
            vec3 bottomColor = vec3(1.0, 1.0, 1.0);
            vec3 color = mix(bottomColor, topColor, vUv.y);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}

// Create a textured ground plane
function createGround() {
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load('https://threejs.org/examples/textures/grid.png');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10);

    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, roughness: 1 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);
}

// Load the model based on the position
function loadModel(position) {
    const path = modelPaths[position];
    if (!path) {
        console.error(`Model path for position "${position}" is not defined.`);
        return;
    }
    if (currentModel) {
        scene.remove(currentModel);
    }
    loader.load(path, function (gltf) {
        currentModel = gltf.scene;
        scene.add(currentModel);
    }, undefined, function (error) {
        console.error(`Failed to load model from path "${path}":`, error);
    });
}

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Update the model based on the current position
function updateModel() {
    const position = getPosition();
    document.getElementById('positionDisplay').innerText = `현재위치: ${position}`;
    loadModel(position);
}

// Initialize the scene
init();

// Update the model every second based on the current position
setInterval(updateModel, 1000);

// Adjust the renderer size when the window is resized
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
