import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { Socket, LoadManager, AlertBanner } from '../..';

const colors = [
	0xFD338B,
	0x8B44EE,
	0xFFD35C,
	0xFD7435,
];

let TwoFourGameRender = function(type, onload, onclose, onfinish, setplayers, {width, height} = {width: window.innerWidth, height: window.innerHeight}) {
	let render_data = {
		pallet: [],
		ball: null,
		ballDirection: {
			x : 0.5 + Math.random(),
			z : 0.5 + Math.random(),
		},
		keyCodes: {},
		updateScore: 0,
		queue: [],
		scores: [],
	}

	let animation = {
		start_time: null,
		start_point: null,
		end_point: null,
		time: 0,
		completion: 1,
		started: false
	}

	let socket = new Socket({path: "/game/"+type});
	socket.onclose(onclose);
	socket.onmessage((msg) => {
		switch (msg.type) {
			case "endGame":
				socket.rmclose(onclose);
				socket.close();
				onfinish(msg.data);
				break;
			case "connectionRefused":
				console.log(msg.data);
				new AlertBanner({ message: msg.data, color: "error" });
				break;
			case "initPlayers":
				setplayers(msg.data);
				break;
			case "resetCam":
				setcam(10, 69, 0);
				break;
			case "setCam":
				setcam(msg.data.x, msg.data.y, msg.data.z);
				break;
			case "moveCam":
				startanimation(camera.position, {x: msg.data.x, y: msg.data.y, z: msg.data.z}, msg.data.duration.toString());
				break;
			case "text":
				createText(msg.data.text, msg.data.size);
				break;
			default:
				render_data.queue.push(msg);
		}
	});
	
	var loaderManager = new THREE.LoadingManager();
	
	let manager = new LoadManager();
	manager.add(socket, "onconnection");
	manager.add(loaderManager, "onLoad");
	manager.onload = () => {
		console.info("game ready");
		socket.send({type : "ready"});
		onload();
		if (type == "4p") {
			displayScore(render_data.pallet);
		}
	};

	let setcam = (x, y, z) => {
		camera.position.set(x, y, z);
	}

	let startanimation = (s, e, dur) => {
		if (animation.started) return console.error('an animation is already running');
		animation.start_time = Date.now();
		animation.start_point = s;
		animation.end_point = e;
		animation.time = dur;
		animation.completion = 0;
		animation.started = true;
	}

	let getanimationframe = () => {
		let now = Date.now();
		let elapsed = now - animation.start_time;
		
		animation.completion = elapsed / animation.time;
		if (animation.completion > 1) {
			animation.completion = 1;
			animation.started = false;
		}

		// on utilise une fonction de easing pour rendre l'animation fluide (lerp, interpolation linéaire en bon français)
		let x = animation.start_point.x + (animation.end_point.x - animation.start_point.x) * animation.completion;
		let y = animation.start_point.y + (animation.end_point.y - animation.start_point.y) * animation.completion;
		let z = animation.start_point.z + (animation.end_point.z - animation.start_point.z) * animation.completion;
		return {x, y, z};
	}

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);

	let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	setcam(10, 80, 0);

	const controls = new OrbitControls(camera, renderer.domElement);
	const scene = new THREE.Scene();
	controls.maxDistance = 100;
	controls.target.set(0, 0, 0);
	controls.update();

	const Alight = new THREE.AmbientLight({ color: 0xffffff });
	scene.add(Alight);

	const geometry = new THREE.BufferGeometry();
	const vertices = [];

	for ( let i = 0; i < 12000; i ++ ) {

		vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // x
		vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // y
		vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // z

	}

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	const particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
	scene.add( particles );

	let font,
		textGeo,
		textMesh;

	const fontLoader = new FontLoader(loaderManager);
	fontLoader.load('/static/fonts/font.json', function (response) {
		font = response;
		createText(type == "4p" ? "En attente de joueurs..." : "En attente d'un joueur...", 2.5);
	});

	const materials = [
		new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
		new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
	];

	function createText(msg, size = 10) {
		scene.remove(textMesh);
		textGeo = new TextGeometry(msg, {
			font: font,
			size: size,
			height: 0.5,
			curveSegments: 2,
			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelEnabled: true
		});

		textGeo.computeBoundingBox();
		textGeo.center();
		textMesh = new THREE.Mesh(textGeo, materials);
		textMesh.rotateX(-Math.PI * 0.5);
		textMesh.rotateZ(Math.PI * 0.5);
		textMesh.position.y -= 2;
		
		scene.add(textMesh);
		textGeo.dispose();
	}

	function createTextObject(msg) {
		let geo = new TextGeometry(msg, {
			font: font,
			size: 10,
			height: 0.5,
			curveSegments: 2,
			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelEnabled: true
		});
		geo.computeBoundingBox();
		geo.center();
		return new THREE.Mesh(geo, materials);
	}

function displayScore(data) {

		if (render_data.scores.length)
			scene.remove(...render_data.scores);

		render_data.scores = [];
		for (let i = 0; i < data.length; i++) {

			render_data.scores.push(createTextObject(Math.max(data[i].score || 0, 0).toString()));
			render_data.scores[i].position.y += 6;
		}
		render_data.scores[0].rotateY((Math.PI / 2) * 2);
		render_data.scores[1].rotateY((Math.PI / 2) * 4);
		render_data.scores[2].rotateY((Math.PI / 2));
		render_data.scores[3].rotateY((Math.PI / 2) * 3);
		render_data.scores[0].position.z += 31.5;
		render_data.scores[1].position.z -= 31.5;
		render_data.scores[3].position.x += 31.5;
		render_data.scores[2].position.x -= 31.5;

		scene.add(...render_data.scores);
	}

	const genTwoPlayerMap = function(render_data, scene) {
		let mapWidth = 40;
		let mapLenth = 60;
		render_data.pallet.push(new THREE.Mesh(
			new THREE.BoxGeometry(6, 1, 1), 
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: colors[0], 
				opacity: 1, 
				emissive: colors[0],
				side: THREE.DoubleSide,
			})
		));
		render_data.pallet.push(new THREE.Mesh(
			new THREE.BoxGeometry(6, 1, 1), 
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: colors[1], 
				opacity: 1, 
				emissive: colors[1],
				side: THREE.DoubleSide,
			})
		));
		let wallLeft = new THREE.Mesh(
			new THREE.BoxGeometry(1 , 1, mapLenth + 1),
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: 0xffffff, 
				opacity: 1, 
				emissive: 0xffffff,
				side: THREE.DoubleSide,
			})
		);
		let wallRight = new THREE.Mesh(
			new THREE.BoxGeometry(1 , 1,  mapLenth + 1),
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: 0xffffff, 
				opacity: 1, 
				emissive: 0xffffff,
				side: THREE.DoubleSide,
			})
		);
		wallRight.position.x += mapWidth / 2;
		wallLeft.position.x -= mapWidth / 2;
		let wallP2 = new THREE.Mesh(
			new THREE.BoxGeometry(mapWidth - 1, 1, 1),
			new THREE.MeshStandardMaterial({
				wireframe: false,
				color: 0xffffff,
				opacity: 1, 
				emissive: 0xffffff,
				side: THREE.DoubleSide,
			})
		);	
		let wallP1 = new THREE.Mesh(
			new THREE.BoxGeometry(mapWidth - 1, 1 , 1),
			new THREE.MeshStandardMaterial({
				wireframe: false,
				color: 0xffffff,
				opacity: 1, 
				emissive: 0xffffff,
				side: THREE.DoubleSide,
			})
		);
		wallP1.position.z += mapLenth / 2
		wallP2.position.z -= mapLenth / 2

		const geometryBall = new THREE.BoxGeometry(1, 1, 1);
		const materialBall = new THREE.MeshPhysicalMaterial({
			wireframe:false, 
			color:0xff0000, 
			opacity: 1, 
			iridescence :1,
			side : THREE.DoubleSide,
		});
		render_data.ball = new THREE.Mesh(geometryBall, materialBall);

		render_data.pallet[0].position.z += (mapLenth / 2) - 1.5;
		render_data.pallet[1].position.z -= (mapLenth / 2) - 1.5;
		
		scene.add(wallLeft, wallRight, wallP1, wallP2);
		scene.add(...render_data.pallet);
	};

	const genFourPlayerMap = function(render_data, scene) {
		let mapLenth = 60;
		let mapWidth = 60;

		render_data.pallet.push(new THREE.Mesh( 
			new THREE.BoxGeometry( 6, 1, 1 ), 
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: colors[0], 
				opacity: 1, 
				emissive: colors[0],
				side: THREE.DoubleSide,
			})
		));
		render_data.pallet.push(new THREE.Mesh( 
			new THREE.BoxGeometry( 6, 1, 1 ), 
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: colors[1], 
				opacity: 1, 
				emissive: colors[1],
				side: THREE.DoubleSide,
			})
		))
		render_data.pallet.push(new THREE.Mesh( 
			new THREE.BoxGeometry( 1, 1, 6 ), 
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: colors[2], 
				opacity: 1, 
				emissive: colors[2],
				side: THREE.DoubleSide,
			})
		));
		render_data.pallet.push(new THREE.Mesh( 
			new THREE.BoxGeometry( 1, 1, 6 ), 
			new THREE.MeshStandardMaterial({
				wireframe: false, 
				color: colors[3], 
				opacity: 1, 
				emissive: colors[3],
				side: THREE.DoubleSide,
			})
		));
		let wallLeft = new THREE.Mesh(
			new THREE.BoxGeometry( 1 , 1, mapLenth + 1),
			new THREE.MeshStandardMaterial( {
				wireframe: false, 
				color: 0xffffff, 
				opacity: 1, 
				emissive: 0xffffff,
				side: THREE.DoubleSide,
			})
		);
		let wallRight = new THREE.Mesh(
			new THREE.BoxGeometry( 1 , 1,  mapLenth + 1 ),
			new THREE.MeshStandardMaterial( {
				wireframe: false, 
				color: 0xffffff, 
				opacity: 1, 
				emissive: 0xffffff,
				side: THREE.DoubleSide,
			})
		);
		wallRight.position.x += mapWidth / 2;
		wallLeft.position.x -= mapWidth / 2;
		let wallP2 = new THREE.Mesh(
			new THREE.BoxGeometry( mapWidth - 1, 1, 1 ),
			new THREE.MeshStandardMaterial( {
				wireframe: false, 
				color: 0xffffff, 
				opacity: 1, 
				emissive: 0xffffff,
				side: THREE.DoubleSide,
			})
		);	
		let wallP1 = new THREE.Mesh(
			new THREE.BoxGeometry( mapWidth - 1, 1 , 1 ),
			new THREE.MeshStandardMaterial( {
				wireframe:false,
				color: 0xffffff, 
				opacity: 1, 
				emissive: 0xffffff,		
				side: THREE.DoubleSide,
			})
		);
		wallP1.position.z += mapLenth / 2;
		wallP2.position.z -= mapLenth / 2;

		const geometryBall = new THREE.BoxGeometry(1, 1, 1);
		const materialBall = new THREE.MeshPhysicalMaterial({
			wireframe:false, 
			color:0xff0000, 
			opacity: 1, 
			iridescence :1,
			side : THREE.DoubleSide,
		});
		render_data.ball = new THREE.Mesh(geometryBall, materialBall);

		let tmp = new Array(4).fill(0).map(_ => new THREE.Object3D());
		render_data.pallet[0].position.z += (mapLenth / 2) - 1.5;
		render_data.pallet[1].position.z -= (mapLenth / 2) - 1.5;
		render_data.pallet[2].position.x += (mapLenth / 2) - 1.5;
		render_data.pallet[3].position.x -= (mapLenth / 2) - 1.5;
		for (let i = 0; i < 4; i++) {
			tmp[i].add(render_data.pallet[i]);
		}
		render_data.pallet = tmp;

		scene.add(wallLeft, wallRight, wallP1, wallP2);
		scene.add(...render_data.pallet);
	};

	(type == "4p") ? genFourPlayerMap(render_data, scene) : genTwoPlayerMap(render_data, scene);

	const params = {
		threshold: 0,
		strength: 0.35,
		radius: 0,
		exposure: 1,
	};

	const renderScene = new RenderPass(scene, camera);

	const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
	bloomPass.threshold = params.threshold;
	bloomPass.strength = params.strength;
	bloomPass.radius = params.radius;
	const outputPass = new OutputPass();
	let composer = new EffectComposer(renderer);
	composer.addPass(renderScene);
	composer.addPass(bloomPass);
	composer.addPass(outputPass);

	document.addEventListener("keydown", onDocumentKeyEvent, true);
	document.addEventListener("keyup", onDocumentKeyEvent, true);
	function onDocumentKeyEvent(event) {
		let d = (event.type === "keydown");
		switch (event.which) {
			case 87:
				render_data.keyCodes["w_key"] = d;
				break;
			case 83:
				render_data.keyCodes["s_key"] = d;
				break;
			case 39:
				render_data.keyCodes["right_arrow_key"] = d;
				break;
			case 38:
				render_data.keyCodes["up_arrow_key"] = d;
				break;
			case 37:
				render_data.keyCodes["left_arrow_key"] = d;
				break;
			case 40:
				render_data.keyCodes["down_arrow_key"] = d;
				break;
			case 82:
				type != "4p" && d && (
					setcam(0.01, 80, 0),
					controls.target.set(0, 0, 0)
				)
				break;
			case 69:
				socket.send({type : 'keyCode', move : 'e_key'});
				break;
		}
	}

	let animationid = null,
		ts = Date.now();
	const animate = () => {
		renderer.render(scene, camera);
		composer.render();
		controls.update();

		if (animation.started) {
			let {x, y, z} = getanimationframe();
			setcam(x, y, z);
		}

		while (render_data.queue.length > 0)
		{
			let event = render_data.queue.shift(),
				data = event.data;
			
			if (Date.now() - ts > 25) {
				Object.keys(render_data.keyCodes).forEach((key) => {
					if (render_data.keyCodes[key]) {
						socket.send({type : 'keyCode', move : key});
					}
				});
				ts = Date.now();
			}

			switch (event.type) {
				case "initGame": {
					createText("");
					scene.add(render_data.ball);
					for (let i = 0; i < render_data.pallet.length; i++) {
						render_data.pallet[i].position.x = data.players[i].x;
						render_data.pallet[i].score = data.players[i].score;
						render_data.ball.position.x = data.ball.x;
						render_data.ball.position.z = data.ball.z;
					}
				} break;
				case "updateScore": {
					render_data.pallet[data.n].score = data.score;
					if (type == "4p") {
						displayScore(render_data.pallet);
					} else {
						createText(render_data.pallet[0].score + " : " + render_data.pallet[1].score);
					}
					if (type != "4p" && render_data.pallet.some(e => e.score > 4)) {
						scene.remove(render_data.ball);
						return;
					}
				} break;
				case "deletePallet": {
					scene.remove(render_data.pallet[data.n]);
				} break;
				case "updatePlayer": {
					if (data.x)
						render_data.pallet[data.n].position.x = data.x;
					if (data.z)
						render_data.pallet[data.n].position.z = data.z;
				} break;
				case "updateBall": {
					render_data.ball.position.x = data.x;
					render_data.ball.position.z = data.z;
				} break;
			}
		}
		animationid = requestAnimationFrame(animate);
	}

	return {
		start: animate,
		socket: socket,
		renderer: renderer,
		animationid: () => animationid,
		render: () => renderer.domElement,
		unmount: () => {
			animationid && cancelAnimationFrame(animationid);
			socket.close();
			document.removeEventListener("keydown", onDocumentKeyEvent, true);
			document.removeEventListener("keyup", onDocumentKeyEvent, true);
		}
	};
};

export default TwoFourGameRender;

export { colors }