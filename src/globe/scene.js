import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
export const scene = new THREE.Scene()
export const rootMesh = new THREE.Mesh(new THREE.Geometry())

export function init (container) {
  const width = container.offsetWidth || window.innerWidth
  const height = container.offsetHeight || window.innerHeight
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.enableDamping = true
  controls.dampingFactor = 0.1

  const play = () => {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(play)
  }

  // init scene
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)
  camera.position.z = 1100

  // add rootMesh to scene
  scene.add(rootMesh)

  // lighting
  const light = new THREE.HemisphereLight(0xffffff, 0xccc, 2)
  scene.add(light)

  initResizeListener(container, camera, renderer)

  play()
}

function initResizeListener (container, camera, renderer) {
  window.addEventListener(
    'resize',
    () => {
      const width = container.offsetWidth || window.innerWidth
      const height = container.offsetHeight || window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    },
    false
  )
}
