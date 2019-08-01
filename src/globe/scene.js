import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { INITIAL_CAMERA_POSITION } from "./constants";

export const scene = new THREE.Scene();
export const rootMesh = new THREE.Mesh(new THREE.Geometry());

export function init(container) {
	const width = container.offsetWidth || window.innerWidth;
	const height = container.offsetHeight || window.innerHeight;
	const camera = new THREE.PerspectiveCamera(30, width / height, 1, 30000);
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	const controls = new OrbitControls(camera, renderer.domElement);

	controls.enableDamping = true;
	controls.dampingFactor = 0.1;

	function randomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}

	function play() {
		requestAnimationFrame(play);
		rootMesh.rotation.y += 0.0005;
		renderer.render(scene, camera);
		controls.update();
	}

	function addStarField() {
		var geometry = new THREE.SphereGeometry(4000, 100, 100);
		var veryBigSphereForStars = new THREE.Mesh(geometry, undefined);

		veryBigSphereForStars.geometry.vertices
			.filter((x) => Math.random() > 0.5)
			.forEach((starCoords) => {
				const geometry = new THREE.SphereGeometry(7, 3, 3);
				const material = new THREE.MeshBasicMaterial({
					color: `rgb(255, 255, 255)`,
					transparent: true,
					opacity: Math.random()
				});
				const star = new THREE.Mesh(geometry, material);

				star.position.x = starCoords.x + randomFloat(-100, 100);
				star.position.y = starCoords.y + randomFloat(-100, 100);
				star.position.z = starCoords.z + randomFloat(-100, 100);

				scene.add(star);
			});

		// scene.add(veryBigSphereForStars);
	}

	function addLights() {
		const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1.7);
		light.castShadow = true;
		scene.add(light);
	}

	// init scene
	initResizeListener(container, camera, renderer);

	renderer.setSize(width, height);
	container.appendChild(renderer.domElement);
	rootMesh.rotation.y = 300;
	camera.position.z = INITIAL_CAMERA_POSITION;
	camera.position.y = 280;

	// add rootMesh to scene
	scene.add(rootMesh);

	addStarField();

	addLights();

	play();
}

function initResizeListener(container, camera, renderer) {
	window.addEventListener(
		"resize",
		() => {
			const width = container.offsetWidth || window.innerWidth;
			const height = container.offsetHeight || window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		},
		false
	);
}
