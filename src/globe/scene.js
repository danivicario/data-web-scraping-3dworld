import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
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

  function addStarField () {
    // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position.
    for (var z = -1000; z < 1000; z += 5) {
      // Make a sphere (exactly the same as before).
      var geometry = new THREE.SphereGeometry(0.5, 32, 32)
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff })
      var sphere = new THREE.Mesh(geometry, material)

      // This time we give the sphere random x and y positions between -500 and 500
      sphere.position.x = randomFloat(-1000, 1000)
      sphere.position.y = randomFloat(-500, 500)

      // Then set the z position to where it is in the loop (distance of camera)
      sphere.position.z = z

      // scale it up a bit
      sphere.scale.x = sphere.scale.y = 2

      // add the sphere to the scene
      scene.add(sphere)

      // finally push it to the stars array
      stars.push(sphere)
    }
  }

  const play = () => {
    renderer.render(scene, camera)
    controls.update()
    rootMesh.rotation.y += .0005
    requestAnimationFrame(play)
  }

  // init scene
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)
  camera.position.z = 1100

  // add rootMesh to scene
  scene.add(rootMesh)

  addStarField()

  // lighting
  const light = new THREE.HemisphereLight(0xffffff, 0x222222, 1.75)
  light.castShadow = true
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
