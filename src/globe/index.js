import axios from 'axios';
import { init as initScene } from './scene';
import { init as initSphere } from './sphere';
import { init as initPaths } from './paths';

export default function initGlobe(container) {
  initScene(container);
  initSphere();
  
  axios.get('https://ecomfe.github.io/echarts-examples/public/data/asset/data/flights.json')
    .then(res => {
      const routes = res.data.routes.slice(0, 10000);
      const airports = res.data.airports;
      const coords = routes.map(route => {
        const startAirport = airports[route[1]];
        const endAirport = airports[route[2]];
        const startLat = startAirport[4];
        const startLng = startAirport[3];
        const endLat = endAirport[4];
        const endLng = endAirport[3];
        return [ startLat, startLng, endLat, endLng ];
      });

      initPaths(coords);
    })
    .catch(err => {
      console.log(err);
    });
}
