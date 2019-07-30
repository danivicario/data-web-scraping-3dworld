import axios from 'axios'
import { init as initScene } from './scene'
import { init as initSphere } from './sphere'
import { init as initPaths, destroyPaths } from './paths'

export default function initGlobe (container) {
  initScene(container)
  initSphere()

  axios
    .get('../data/geo_attack_all.json')
    .then(res => {
      let data = res.data
      data = data.splice(0, 100)

      const coords = data.map(attack => {
        const startLat = attack.predator_latitude
        const startLng = attack.predator_longitude
        const endLat = attack.prey_latitude
        const endLng = attack.prey_longitude
        return [startLat, startLng, endLat, endLng]
      })

      var x1 = 0

      let intervalID = setInterval(() => {
        initPaths(coords, x1++)

        if (x1 > 50) {
          destroyPaths()
          clearInterval(intervalID)
        }
      }, 100)
    })
    .catch(err => {
      console.log(err)
    })
}
