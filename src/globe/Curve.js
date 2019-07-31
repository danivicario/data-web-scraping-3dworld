import * as THREE from 'three'
import { getSplineFromCoords } from './utils'
import { CURVE_SEGMENTS } from './constants'

export default class Curve {
  constructor (coords, material, currentCurveStep) {
    this.material = material
    this.currentCurveStep = currentCurveStep

    const { spline } = getSplineFromCoords(coords)

    // add curve geometry
    this.curveGeometry = new THREE.BufferGeometry()
    this.points = new Float32Array(CURVE_SEGMENTS * 3)
    const vertices = spline.getPoints(CURVE_SEGMENTS - 1)

    for (let i = 0, j = 0; i < vertices.length; i++) {
      const vertex = vertices[i]
      this.points[j++] = vertex.x
      this.points[j++] = vertex.y
      this.points[j++] = vertex.z
    }

    this.animate(this.currentCurveStep)
  }

  animate (currentCurveStep) {
    this.curveGeometry.addAttribute(
      'position',
      new THREE.BufferAttribute(this.points, 3)
    )
    this.curveGeometry.setDrawRange(0, currentCurveStep)

    this.mesh = new THREE.Line(this.curveGeometry, this.material)
    this.mesh.userData = {
      line: true
    }
  }
}
