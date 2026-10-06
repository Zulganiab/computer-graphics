import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x20242b);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 8);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const n =new THREE.Vector3(0, 1, 0);
const p0 = new THREE.Vector3(0, 0, 0);
const d = n.dot(p0);

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

floor.rotation.x = -Math.PI / 2;
//floor.updateMatrix();
scene.add(floor, new THREE.GridHelper(12, 12, 0x000000, 0x000000));

const o = new THREE.Vector3(2,5,1);
const dr = new THREE.Vector3(0, -1, 0);
scene.add(new THREE.ArrowHelper(dr, o, 2, 0xff0000));

const t = (d - n.dot(o)) / n.dot(dr);

const hitPoint = new THREE.Vector3().addVectors(o, dr.clone().multiplyScalar(t));
const hitSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
hitSphere.position.copy(hitPoint);
scene.add(hitSphere);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//krahasim me raycaster

const rchit = new THREE.Raycaster(o, dr).intersectObject(floor);
console.log('formula jon', rchit.length > 0 ? rchit[0].point.toArray().map(x => x.toFixed(3)) : 'no hit');
 


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

}

animate();


