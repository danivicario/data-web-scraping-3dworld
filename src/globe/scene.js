import * as THREE from 'three';
import Hammer from 'hammerjs';
import { clamp } from './utils';
import { PI_TWO } from './constants';

let _deltaX = 0;
let _deltaY = 0;
let _startX = 0;
let _startY = 0;

const CAMERA_Z_MIN = 800;
const CAMERA_Z_MAX = 1300;
let _cameraZ = 1100;

export const scene = new THREE.Scene();
export const rootMesh = new THREE.Mesh(new THREE.Geometry());

export function init(container) {
  const width = container.offsetWidth || window.innerWidth;
  const height = container.offsetHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // main animation loop
  const play = () => {
    // rotation
    rootMesh.rotation.x += Math.atan(_deltaY / _cameraZ) * 0.2;
    rootMesh.rotation.y += Math.atan(_deltaX / _cameraZ) * 0.2;
    if (rootMesh.rotation.x > PI_TWO) rootMesh.rotation.x -= PI_TWO;
    if (rootMesh.rotation.y > PI_TWO ) rootMesh.rotation.y -= PI_TWO;

    // zoom
    camera.position.z = _cameraZ;

    // animate paths
    // playPathAnim();

    // render
    renderer.render(scene, camera);

    // next frame
    requestAnimationFrame(play);
  };

  // init scene
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  camera.position.z = _cameraZ;

  // add rootMesh to scene
  scene.add(rootMesh);

  // lighting
  const light = new THREE.HemisphereLight(0xffffff, 0xccc, 2);
  scene.add(light);

  // init event listeners
  initPanListener(container);
  initZoomListener(container);
  initResizeListener(container, camera, renderer);

  // play scene
  play();
}

function reset() {
  _deltaX = 0;
  _deltaY = 0;
  _startX = 0;
  _startY = 0;
}

function initPanListener(container) {
  const mc = new Hammer.Manager(container);

  mc.add(new Hammer.Pan());

  mc.on('pan', (e) => {
    _deltaX = e.deltaX - _startX;
    _deltaY = e.deltaY - _startY;
  });

  mc.on('panstart', () => {
    reset();
    container.style.cursor = 'move';
  });

  mc.on('panend', () => {
    reset();
    container.style.cursor = 'auto';
  });
}

function initZoomListener(container) {
  container.addEventListener('mousewheel', (e) => {
    const delta = e.wheelDeltaY * 0.2;
    _cameraZ = clamp(_cameraZ - delta, CAMERA_Z_MIN, CAMERA_Z_MAX);
  }, false);
}

function initResizeListener(container, camera, renderer) {
  window.addEventListener('resize', () => {
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, false);
}
