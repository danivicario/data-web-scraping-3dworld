import * as THREE from 'three';
import { getSplineFromCoords } from './utils';
import { CURVE_SEGMENTS } from './constants';

export default function Curve(coords, material) {
  const { spline } = getSplineFromCoords(coords);

  // add curve geometry
  const curveGeometry = new THREE.BufferGeometry();
  const points = new Float32Array(CURVE_SEGMENTS * 3);
  const vertices = spline.getPoints(CURVE_SEGMENTS - 1);

  for (let i = 0, j = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    points[j++] = vertex.x;
    points[j++] = vertex.y;
    points[j++] = vertex.z;
  }

  // !!!
  // You can use setDrawRange to animate the curve
  curveGeometry.addAttribute('position', new THREE.BufferAttribute(points, 3));
  curveGeometry.setDrawRange(0, CURVE_SEGMENTS);

  this.mesh = new THREE.Line(curveGeometry, material);
}
