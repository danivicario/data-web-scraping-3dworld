import * as THREE from 'three';
import { GLOBE_RADIUS } from './constants';
import { rootMesh } from './scene';
// import { GLOBE_RADIUS } from './constants';

const COLOR_SPHERE_NIGHT = 0xa58945;

export function init() {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 30);
  const loader = new THREE.TextureLoader();
  const material = new THREE.MeshPhongMaterial({
    map: loader.load('https://i.imgur.com/45naBE9.jpg'),
    color: COLOR_SPHERE_NIGHT
  });
  const mesh = new THREE.Mesh(geometry, material);
  
  rootMesh.add(mesh);
}