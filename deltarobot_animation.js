import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, loader, controls;
let staticModel, mixer, clock;
const animationMixers = {};
const animationActions = {};
let activeAction = null;

init();
loadStaticModel();  // Load default model and animations

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
    clock = new THREE.Clock();

    createGradientBackground();
    createGround();

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    for (let mixer of Object.values(animationMixers)) {
        mixer.update(delta);
    }
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
}

function loadStaticModel() {
    loader.load('models/StaticModel.gltf', function (gltf) {
        staticModel = gltf.scene;
        scene.add(staticModel);

        mixer = new THREE.AnimationMixer(staticModel);
        animationMixers['staticModel'] = mixer;

        // Load animations
        loadAnimation('models/Animation1.gltf', 'animation1');
        loadAnimation('models/Animation2.gltf', 'animation2');
        loadAnimation('models/Animation3.gltf', 'animation3');
        loadAnimation('models/Animation4.gltf', 'animation4');
    }, undefined, function (error) {
        console.error('Error loading static model:', error);
    });
}

function loadAnimation(path, name) {
    loader.load(path, function (gltf) {
        const model = gltf.scene;
        model.visible = false;
        scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        animationMixers[name] = mixer;

        const clips = gltf.animations;
        if (clips.length > 0) {
            const action = mixer.clipAction(clips[0]);
            animationActions[name] = action;
        }
    }, undefined, function (error) {
        console.error(`Error loading ${name}:`, error);
    });
}

function updateModelBasedOnPosition() {
    const position = window.getPosition();
    let targetAction = null;

    switch (position) {
        case "원위치":
            targetAction = animationActions['staticModel'] ? animationActions['staticModel'] : null;
            break;
        case "1번 좌표":
            targetAction = animationActions['animation1'];
            break;
        case "2번 좌표":
            targetAction = animationActions['animation2'];
            break;
        case "3번 좌표":
            targetAction = animationActions['animation3'];
            break;
        case "4번 좌표":
            targetAction = animationActions['animation4'];
            break;
        default:
            targetAction = animationActions['staticModel'] ? animationActions['staticModel'] : null;
    }

    if (targetAction && targetAction !== activeAction) {
        if (activeAction) {
            activeAction.fadeOut(0.5);
        }
        targetAction.reset().fadeIn(0.5).play();
        activeAction = targetAction;
    }

    scene.children.forEach(child => {
        if (child === staticModel || (targetAction && child === targetAction.getRoot())) {
            child.visible = true;
        } else {
            child.visible = false;
        }
    });
}

// Call updateModelBasedOnPosition every time the position is updated
window.setInterval(updateModelBasedOnPosition, 300);

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
