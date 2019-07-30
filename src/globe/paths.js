// https://threejs.org/examples/webgl_custom_attributes_lines.html

import * as THREE from 'three'
import Curve from './Curve'
import { rootMesh } from './scene'
import { CURVE_COLOR } from './constants'

export function init (allCoords, xxxxx) {
  const material = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    opacity: 0.2,
    transparent: true,
    color: CURVE_COLOR
  })
  const curveMesh = new THREE.Mesh()

  allCoords.forEach(coords => {
    const curve = new Curve(coords, material, xxxxx)
    curveMesh.add(curve.mesh)
  })

  rootMesh.add(curveMesh)
}
