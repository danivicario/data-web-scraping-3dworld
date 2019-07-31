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

    const geometryOrigin = new THREE.SphereGeometry(1, 0.2, 0.2)
    const materialOrigin = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const geometryDestination = new THREE.SphereGeometry(1, 0.2, 0.2)
    const materialDestination = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

    this.meshOrigin = new THREE.Mesh(geometryOrigin, materialOrigin)
    this.meshOrigin.position.x = vertices[0].x
    this.meshOrigin.position.y = vertices[0].y
    this.meshOrigin.position.z = vertices[0].z

    this.meshDestination = new THREE.Mesh(
      geometryDestination,
      materialDestination
    )
    this.meshDestination.position.x = vertices[vertices.length - 1].x
    this.meshDestination.position.y = vertices[vertices.length - 1].y
    this.meshDestination.position.z = vertices[vertices.length - 1].z

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
  }
}
