import * as THREE from 'three';
import { GLOBE_RADIUS } from './constants';
import { rootMesh } from './scene';

const COLOR_SPHERE_NIGHT = 0xa58945;

export function init() {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 60, 60);
  const loader = new THREE.TextureLoader();
  const material = new THREE.MeshPhongMaterial({
    map: loader.load('../1_earth_8k.jpg'),
    color: COLOR_SPHERE_NIGHT
  });
  const mesh = new THREE.Mesh(geometry, material);
  
  rootMesh.add(mesh);
}