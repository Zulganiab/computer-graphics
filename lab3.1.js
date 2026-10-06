import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x20242b);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0x5a6470, 0.9);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2.2, 100);
scene.add(sunLight);

const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vec3 warm = vec3(1.0, 0.78, 0.18);
            vec3 bright = vec3(1.0, 0.93, 0.55);

            float rim = pow(1.0 - abs(vNormal.z), 2.0);
            float pulse = 0.05 * sin(time * 2.0 + vPosition.y * 3.0);
            float mixValue = clamp(rim + pulse, 0.0, 1.0);

            vec3 color = mix(warm, bright, mixValue);
            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 48, 48),
    sunMaterial
);
scene.add(sun);
sunLight.position.copy(sun.position);

const earthOrbit = new THREE.Group();
scene.add(earthOrbit);

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        color: 0x2b6fff,
        roughness: 0.9,
        metalness: 0.0
    })
);
earth.position.set(4, 0, 0);
earthOrbit.add(earth);

const moonOrbit = new THREE.Group();
earth.add(moonOrbit);

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 24, 24),
    new THREE.MeshStandardMaterial({
        color: 0xb8b8b8,
        roughness: 1.0,
        metalness: 0.0
    })
);
moon.position.set(1.1, 0, 0);
moonOrbit.add(moon);

const earthOrbitLine = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, 4, 4, 0, Math.PI * 2, false, 0).getPoints(128)
    ),
    new THREE.LineBasicMaterial({ color: 0x4b5563 })
);
earthOrbitLine.rotation.x = Math.PI / 2;
scene.add(earthOrbitLine);

const moonOrbitLine = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, 1.1, 1.1, 0, Math.PI * 2, false, 0).getPoints(128)
    ),
    new THREE.LineBasicMaterial({ color: 0x6b7280 })
);
moonOrbitLine.rotation.x = Math.PI / 2;
scene.add(moonOrbitLine);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    sunMaterial.uniforms.time.value += 0.02;
    sun.rotation.y += 0.002;
    earthOrbit.rotation.y += 0.006;
    earth.rotation.y += 0.02;
    moonOrbit.rotation.y += 0.03;
    controls.update();
    renderer.render(scene, camera);
}

animate();