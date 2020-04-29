import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { INITIAL_CAMERA_POSITION } from "./constants";
import gsap from "gsap";

export const scene = new THREE.Scene();
export const rootMesh = new THREE.Mesh(new THREE.Geometry());

//	this function will operate over each lensflare artifact, moving them around the screen
export function init(container) {
	const width = 1200; //container.offsetWidth || window.innerWidth;
	const height = 675; //container.offsetHeight || window.innerHeight;
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
		rootMesh.rotation.y += 0.0005 / 2;
		renderer.render(scene, camera);
		controls.update();
	}

	function addStarField() {
		var geometry = new THREE.SphereGeometry(4000, 100, 100);
		var veryBigSphereForStars = new THREE.Mesh(geometry, undefined);

		veryBigSphereForStars.geometry.vertices
			.filter((x) => Math.random() > 0.6)
			.forEach((starCoords) => {
				const complexity = 2;
				const geometry = new THREE.SphereGeometry(
					7 * complexity,
					3 * complexity,
					3 * complexity
				);

				const material = new THREE.MeshBasicMaterial({
					color: `rgb(255, 255, 255)`,
					transparent: true,
					opacity: randomFloat(0.3, 0.5)
				});
				const star = new THREE.Mesh(geometry, material);
				let randomScale = randomFloat(1 / 2, 1 / 8);
				star.scale.x = randomScale;
				star.scale.y = randomScale;
				star.scale.z = randomScale;

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

	setInterval(() => {
		console.log(camera.position);
	});

	renderer.setSize(width, height);
	container.appendChild(renderer.domElement);
	rootMesh.rotation.y = 400;

	camera.position.x = -271.3509018223257;
	camera.position.y = -28.954737094090532;
	camera.position.z = 217.45487035569678;

	setTimeout(() => {
		gsap.timeline({ defaults: { ease: "power1.inOut", duration: 20 } }).to(
			camera.position,
			{
				x: 0,
				y: 100,
				z: 270 * 3
			}
		);
	}, 60000);

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
