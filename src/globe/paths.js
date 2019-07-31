// https://threejs.org/examples/webgl_custom_attributes_lines.html
// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/

import * as THREE from 'three'
import Curve from './Curve'
import { rootMesh } from './scene'
import { CURVE_COLOR } from './constants'

export function init (allCoords, step) {
  const material = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    opacity: 0.8,
    transparent: true,
    color: CURVE_COLOR
  })

  const curveMesh = new THREE.Mesh()

  allCoords.forEach(coords => {
    const curve = new Curve(coords, material, step)
    curveMesh.add(curve.mesh)
  })

  for (var i = 1; i< rootMesh.children.length; i++) {
    rootMesh.remove(rootMesh.children[i])
  }

  rootMesh.add(curveMesh)
}

export function destroyPaths () {
  for (var i = 1; i< rootMesh.children.length; i++) {
    rootMesh.remove(rootMesh.children[i])
  }
}
