import axios from 'axios'
import { init as initScene } from './scene'
import { init as initSphere } from './sphere'
import { init as initPaths, destroyPaths } from './paths'
import moment from 'moment'

export default function initGlobe (container) {
  let filteredData

  initScene(container)
  initSphere()

  function getUniqueListBy (arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  axios
    .get('../data/geo_attack_all.json')
    .then(res => {
      let data = res.data
      data = getUniqueListBy(data, 'predator_longitude')
      data = getUniqueListBy(data, 'predator_latitude')
      data = getUniqueListBy(data, 'prey_latitude')
      data = getUniqueListBy(data, 'prey_longitude')

      filteredData = data.map(attack => {
        attack.date = moment.unix(attack.timestamp).format('YYYY-MM-D')
        attack.hour = moment.unix(attack.timestamp).format('hh mm ss')
        return attack
      })

      function filter () {
        let dateStart =
          document.querySelector('#controls .search-date').value +
          ' ' +
          document.querySelector('#controls .search-date-start').value
        let dateEnd =
          document.querySelector('#controls .search-date').value +
          ' ' +
          document.querySelector('#controls .search-date-end').value

        let epochStart = moment(dateStart).unix()
        let epochEnd = moment(dateEnd).unix()

        return filteredData.filter(attack => {
          return (
            parseInt(attack.timestamp) >= epochStart &&
            parseInt(attack.timestamp) <= epochEnd
          )
        })
      }

      function filterAndUpdateTotals () {
        let data = filter()
        document.querySelector('#controls .totals').innerHTML = data.length
      }

      document.querySelector(
        '#controls .search-date'
      ).onchange = filterAndUpdateTotals
      document.querySelector(
        '#controls .search-date-start'
      ).onchange = filterAndUpdateTotals
      document.querySelector(
        '#controls .search-date-end'
      ).onchange = filterAndUpdateTotals

      filterAndUpdateTotals()

      let intervalID;

      document.querySelector('#controls .search-button').onclick = function () {
        clearInterval(intervalID)
        let data = filter()

        const coords = data.map(attack => {
          const startLat = attack.predator_latitude
          const startLng = attack.predator_longitude
          const endLat = attack.prey_latitude
          const endLng = attack.prey_longitude
          return [startLat, startLng, endLat, endLng]
        })

        // (intervalID) ? clearInterval(intervalID) : null;
        destroyPaths()

        var pathStep = 0

        intervalID = setInterval(() => {
          initPaths(coords, pathStep++)

          if (pathStep > 160) {
            clearInterval(intervalID)
          }
        }, 10)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
