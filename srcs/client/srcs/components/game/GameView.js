import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import { Component, createElement, Loader, useParams, navigate } from '../..';
import { Socket, LoadManager } from '../utils';

let game_render = function(type, onload, onclose, {width, height} = {width: window.innerWidth, height: window.innerHeight}) {
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
	}

	let socket = new Socket({path: "/game/"+type});
	socket.onclose(onclose);
	socket.onmessage((msg) => {
		switch (msg.type) {
			case "resetCam":
				setcam(10, 69, 0);
				break;
			case "setCam":
				setcam(msg.data.x, msg.data.y, msg.data.z);
				break;
			case "text":
				createText(msg.data.text, msg.data.size);
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
	};

	let setcam = (x, y, z) => {
		camera.position.set(x, y, z);
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

	const skyLoader = new THREE.TextureLoader(loaderManager);
	const sky = skyLoader.load("/static/images/background_sky_box.jpg", () => {
		const skyboxGeo = new THREE.SphereGeometry(700);
		const materialSky = new THREE.MeshPhysicalMaterial({
			wireframe: false,
			opacity: 1,
			side: THREE.BackSide,
			map: sky,
		});
		const skybox = new THREE.Mesh(skyboxGeo, materialSky);
		scene.add(skybox);
	});

	let font,
		textGeo,
		textMesh;

	const fontLoader = new FontLoader(loaderManager);
	fontLoader.load('/static/fonts/font.json', function (response) {
		font = response;
		createText("Waiting for opponent", 2.5);
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

	(function() {
		let mapWidth = 40;
		let mapLenth = 60;
		render_data.pallet.push(new THREE.Mesh(
			new THREE.BoxGeometry(6, 1, 1), 
			new THREE.MeshStandardMaterial({
				wireframe:false, 
					color:0xffffff, 
					opacity: 1, 
					emissive:0xffffff,
					side : THREE.DoubleSide,
				})
			));
		render_data.pallet.push(new THREE.Mesh(
			new THREE.BoxGeometry(6, 1, 1), 
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		));
		let wallLeft = new THREE.Mesh(
			new THREE.BoxGeometry(1 , 1, mapLenth + 1),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
		let wallRight = new THREE.Mesh(
			new THREE.BoxGeometry(1 , 1,  mapLenth + 1),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
		wallRight.position.x += mapWidth / 2;
		wallLeft.position.x -= mapWidth / 2;
		let wallP2 = new THREE.Mesh(
			new THREE.BoxGeometry(mapWidth - 1, 1, 1),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xff00ff, 
				opacity: 1, 
				emissive:0xff00ff,
				side : THREE.DoubleSide,
			})
		);	
		let wallP1 = new THREE.Mesh(
			new THREE.BoxGeometry(mapWidth - 1, 1 , 1),
			new THREE.MeshStandardMaterial({
				wireframe:false,
				color:0x00ffff, 
				opacity: 1, 
				emissive:0x00ffff,
				side : THREE.DoubleSide,
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
	}());

	const params = {
		threshold: 0,
		strength: 0.35,
		radius: 0,
		exposure: 1,
	};

	const renderScene = new RenderPass(scene, camera);

	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
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
			case 68:
				render_data.keyCodes["d_key"] = d;
				break;
			case 39:
				render_data.keyCodes["right_arrow_key"] = d;
				break;
			case 65:
				render_data.keyCodes["a_key"] = d;
				break;
			case 37:
				render_data.keyCodes["left_arrow_key"] = d;
				break;
			case 82:
				d && (
					setcam(10, 80, 0),
					controls.target.set(0, 0, 0)
				)
				break;
		}
	}

	let animationid = null,
		ts = Date.now();
	const animate = async () => {
		renderer.render(scene, camera);
		composer.render();

		controls.update();
		animationid = requestAnimationFrame(animate);
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
					createText(render_data.pallet[0].score + " : " + render_data.pallet[1].score);
					if (render_data.pallet.some(e => e.score > 9))
					{
						scene.remove(render_data.ball);
						return;
					}
				} break;
				case "updatePlayer": {
					render_data.pallet[data.n].position.x = data.x;
				} break;
				case "updateBall": {
					render_data.ball.position.x = data.x;
					render_data.ball.position.z = data.z;
				} break;
			}
		}
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

class GameView extends Component {

	componentDidMount() {
		console.log("componentDidMount GameView", this);
		let a = useParams("/game/:type") ?? {params: {type: null}},
			{type} = a.params;
		if (!type) {
			navigate("/");
		}
		this.setState({loading: true, game_render: null});
		window.onbeforeunload = (e) => {
			// display a message to the user
			e.preventDefault();
			return "Quitting this page will stop the game and you will lose the game.\nAre you sure you want to quit?";
		}
		let onload = () => this.setState({loading: false});

		this.setState({game_render: game_render(type, onload, this.endGame.bind(this), {width: window.innerWidth, height: window.innerHeight})});
	}

	componentDidUpdate() {
		console.log("componentDidUpdate GameView", this.state.game_render);
		if (this.state.game_render) {
			this.state.game_render.animationid() && cancelAnimationFrame(this.state.game_render.animationid());
			this.state.game_render.start(this.state);
		}
	}

	componentWillUnmount() {
		this.state.game_render.unmount();
		window.onbeforeunload = null;
		console.log("game view unmounted", this.state.game_render);
	}

	endGame() {
		navigate("/");
		this.props.reload();
		console.log("game view unmounted", this.state.game_render);
	}

	render() {
		console.log("======================== GameView render ========================", this.state);
		return (
			this.state.loading ?
			createElement(Loader)
			:
			createElement('div', {
				class: "render-context", children: [
					createElement('div', {
						class: "back-button", onclick: () => this.endGame(), children: "Go home"
					}),
					this.state.game_render && this.state.game_render.render()
				]
			})
		)
	}
}

export default GameView;