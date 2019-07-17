import * as THREE from 'three';
import _ from 'lodash';
import Curve from './Curve';
import { rootMesh } from './scene';
import { CURVE_COLOR } from './constants';

export function init(allCoords) {
  const material = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    opacity: 0.6,
    transparent: true,
    color: CURVE_COLOR
  });
  const curveMesh = new THREE.Mesh();

  allCoords.forEach(coords => {
    const curve = new Curve(coords, material);
    curveMesh.add(curve.mesh);
  });

  rootMesh.add(curveMesh);
}