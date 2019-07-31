import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { INITIAL_CAMERA_POSITION } from './constants'

export const scene = new THREE.Scene()
export const rootMesh = new THREE.Mesh(new THREE.Geometry())

export function init (container) {
  const width = container.offsetWidth || window.innerWidth
  const height = container.offsetHeight || window.innerHeight
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 30000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const controls = new OrbitControls(camera, renderer.domElement)
  let stars = []

  controls.enableDamping = true
  controls.dampingFactor = 0.1

  function randomFloat (min, max) {
    return Math.random() * (max - min) + min
  }

  function play () {
    requestAnimationFrame(play)
    rootMesh.rotation.y += 0.0005
    renderer.render(scene, camera)
    controls.update()
  }

  function addStarField () {
    function addStars (z) {
      var geometry = new THREE.SphereGeometry(2, 5, 5)
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff })
      var planet = new THREE.Mesh(geometry, material)

      planet.position.x = randomFloat(-5000, 5000)
      planet.position.y = randomFloat(-3500, 3500)
      planet.position.z = z

      scene.add(planet)

      stars.push(planet)
    }
    for (var z = -2000; z < -INITIAL_CAMERA_POSITION; z += 1) {
      addStars(z)
    }

    for (z = INITIAL_CAMERA_POSITION; z < 2000; z += 1) {
      addStars(z)
    }
  }

  function addLights () {
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1.7)
    light.castShadow = true
    scene.add(light)
  }

  // init scene
  initResizeListener(container, camera, renderer)

  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)
  camera.position.z = INITIAL_CAMERA_POSITION

  // add rootMesh to scene
  scene.add(rootMesh)

  addStarField()

  addLights()

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
