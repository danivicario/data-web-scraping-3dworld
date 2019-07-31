import axios from "axios";
import { init as initScene } from "./scene";
import { init as initSphere } from "./sphere";
import { init as initPaths, destroyPaths } from "./paths";
import moment from "moment";

export default function initGlobe(container) {
  let filteredData;

  initScene(container);
  initSphere();

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  }

  axios
    .get("../data/geo_attack_all.json")
    .then(res => {
      let data = res.data;
      data = getUniqueListBy(data, "predator_longitude");
      data = getUniqueListBy(data, "predator_latitude");
      data = getUniqueListBy(data, "prey_latitude");
      data = getUniqueListBy(data, "prey_longitude");

      filteredData = data.map(attack => {
        attack.date = moment.unix(attack.timestamp).format("YYYY-MM-D");
        attack.hour = moment.unix(attack.timestamp).format("hh mm ss");
        return attack;
      });

      filteredData.forEach(x => console.log(x.hour))

      debugger

      document.querySelector("#controls .search-date").onchange = function() {
        let data = filteredData.filter(attack => attack.date === document.querySelector("#controls .search-date").value);
        console.log(document.querySelector("#controls .search-date-start").value)
        console.log(document.querySelector("#controls .search-date-end").value)
        document.querySelector("#controls .totals").innerHTML = data.length;
      };

      document.querySelector("#controls .search-button").onclick = function() {
        let data = filteredData.filter(attack => attack.date === document.querySelector("#controls .search-date").value);

        const coords = data.map(attack => {
          const startLat = attack.predator_latitude;
          const startLng = attack.predator_longitude;
          const endLat = attack.prey_latitude;
          const endLng = attack.prey_longitude;
          return [startLat, startLng, endLat, endLng];
        });

        var x1 = 0;

        let intervalID = setInterval(() => {
          initPaths(coords, x1++);

          if (x1 > 50) {
            destroyPaths();
            clearInterval(intervalID);
          }
        }, 100);
      };
    })
    .catch(err => {
      console.log(err);
    });
}
