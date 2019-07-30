import axios from 'axios';
import { init as initScene } from './scene';
import { init as initSphere } from './sphere';
import { init as initPaths } from './paths';

export default function initGlobe(container) {
  initScene(container);
  initSphere();
  
  axios.get('../data/attacks.json')
    .then(res => {
      let data = res.data

      const coords = data.map(attack => {
        const startLat = attack.predator_latitude;
        const startLng = attack.predator_longitude;
        const endLat = attack.prey_latitude;
        const endLng = attack.prey_longitude;
        return [ startLat, startLng, endLat, endLng ];
      });

      debugger

      initPaths(coords);
    })
    .catch(err => {
      console.log(err);
    });
}
