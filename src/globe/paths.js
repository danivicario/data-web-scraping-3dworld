// https://threejs.org/examples/webgl_custom_attributes_lines.html
// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/

import * as THREE from "three";
import Curve from "./Curve";
import { rootMesh } from "./scene";
import { CURVE_COLOR } from "./constants";

export default class Path {
	constructor(allCoords) {
		this.allCoords = allCoords;
		const material = new THREE.MeshBasicMaterial({
			color: CURVE_COLOR
		});
		this.curves = [];

		this.allCoords.forEach((coords, idx) => {
			this.curves[idx] = new Curve(coords, material);
		});
	}

	animate(step) {
		this.destroyPaths();

		this.curveMesh = new THREE.Group();

		this.allCoords.forEach((n, idx) => {
			const curve = this.curves[idx];
			curve.animate(step);
			this.curveMesh.add(curve.mesh);
			this.curveMesh.add(curve.meshOrigin);
			this.curveMesh.add(curve.meshDestination);
		});

		rootMesh.add(this.curveMesh);
	}

	destroyPaths() {
		for (var i = 1; i < rootMesh.children.length; i++) {
			rootMesh.remove(rootMesh.children[i]);
		}
	}
}
