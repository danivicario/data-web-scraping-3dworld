import * as THREE from 'three';
import { GLOBE_RADIUS } from './constants';
import { rootMesh } from './scene';

export function init() {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 25, 25);
  const loader = new THREE.TextureLoader();
  const material = new THREE.MeshPhongMaterial({
    map: loader.load('../1_earth_8k.jpg')
  });
  const mesh = new THREE.Mesh(geometry, material);
  
  rootMesh.add(mesh);
}