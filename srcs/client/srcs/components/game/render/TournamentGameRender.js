import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { Socket, LoadManager } from '../../../utils';

let TournamentGameRender = function(type, onload, onclose, setplayers, {width, height} = {width: window.innerWidth, height: window.innerHeight}) {
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
		scores: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        balls: [],
        k: [0, 0, 0, 0, 0, 0, 0, 0]
	}

    let setcam = (x, y, z) => {
		camera.position.set(x, y, z);
	}

	function setcamTournament (x, y, z, camx, camy, camz) {
		controls.target.set(camx, camy, camz)
		camera.position.set(x, y, z);
		controls.update();

	}

    let socket = new Socket({path: "/game/tournament"});
	socket.onclose(onclose);
	socket.onmessage((msg) => {
		switch (msg.type) {
			// case "initPlayers":
			// 	setplayers(msg.data);
			// case "resetCam":
			// 	setcam(10, 69, 0);
			// 	break;
			// case "setCam":
			// 	setcam(msg.data.x, msg.data.y, msg.data.z);
			// 	break;
			// case "moveCam":
			// 	startanimation(camera.position, {x: msg.data.x, y: msg.data.y, z: msg.data.z}, msg.data.duration.toString());
			// 	break;
			// case "text":
			// 	createText(msg.data.text, msg.data.size);
            case "setCam":
				setcamTournament(msg.data.x, msg.data.y, msg.data.z, msg.data.camx, msg.data.camy, msg.data.camz);
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
		textGeo = [],
		textMesh = [];

	const fontLoader = new FontLoader(loaderManager);
	fontLoader.load('/static/fonts/font.json', function (response) {
		font = response;
		createText("En attente d'un joueur...", 2.5);
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

    function initiateMapTwoPlayer(data, offset_x, offset_z, num )
	{
		let mapLenth = 60;
		let mapWidth = 40;
		if (num <= 3){
			render_data.pallet[0 + (num * 2)] = new THREE.Mesh( 
				new THREE.BoxGeometry( 6, 1, 1 ), 
				new THREE.MeshStandardMaterial({
					wireframe:false, 
						color:0xffffff, 
						opacity: 1, 
						emissive:0xffffff,
						side : THREE.DoubleSide,
					})
				);
			render_data.pallet[1 + (num * 2)] = new THREE.Mesh( 
				new THREE.BoxGeometry( 6, 1, 1 ), 
				new THREE.MeshStandardMaterial({
					wireframe:false, 
					color:0xffffff, 
					opacity: 1, 
					emissive:0xffffff,
					side : THREE.DoubleSide,
				})
			);
            render_data.pallet[0 + (num * 2)].position.z += (mapLenth / 2) - 1.5 + offset_z;
            render_data.pallet[0 + (num * 2)].position.x += offset_x;
            render_data.pallet[1 + (num * 2)].position.z -= (mapLenth / 2) - 1.5 - offset_z;
            render_data.pallet[1 + (num * 2)].position.x += offset_x;
		}
		let wallLeft = new THREE.Mesh(
			new THREE.BoxGeometry( 1 , 1, mapLenth + 1),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
		let wallRight = new THREE.Mesh(
			new THREE.BoxGeometry( 1 , 1,  mapLenth + 1 ),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
		wallRight.position.x += mapWidth/2 + offset_x;
		wallLeft.position.x -= mapWidth/2 - offset_x;
		wallRight.position.z += offset_z;
		wallLeft.position.z += offset_z;
		let wallP2 = new THREE.Mesh(
			new THREE.BoxGeometry( mapWidth - 1, 1, 1 ),
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xff00ff, 
				opacity: 1, 
				emissive:0xff00ff,
				side : THREE.DoubleSide,
			})
		);	
		let wallP1 = new THREE.Mesh(
			new THREE.BoxGeometry( mapWidth - 1, 1 , 1 ),
			new THREE.MeshStandardMaterial({
				wireframe:false,
				color:0x00ffff, 
				opacity: 1, 
				emissive:0x00ffff,
				side : THREE.DoubleSide,
			})
		);
	
		wallP2.position.x += offset_x;
		wallP2.position.z -= mapLenth / 2 - offset_z;
		wallP1.position.x += offset_x;
		wallP1.position.z += mapLenth / 2 + offset_z;

		const geometryBall = new THREE.BoxGeometry( 1, 1, 1 );
		const materialBall = new THREE.MeshPhysicalMaterial({
			wireframe:false, 
			color:0xff0000, 
			opacity: 1, 
			iridescence :1,
			side : THREE.DoubleSide,
		});

		render_data.balls[num] = new THREE.Mesh( geometryBall, materialBall );
		render_data.balls[num].position.x = offset_x;
		render_data.balls[num].position.z = offset_z;

		scene.add(wallLeft, wallRight, wallP1, wallP2);
	}

    const params = {
		threshold: 0,
		strength: 0.35,
		radius: 0,
		exposure: 1
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
		let keyVar = (event.type === "keydown");
		// switch (event.which) {
		// 	case 87:
		// 		render_data.keyCodes["w_key"] = d;
		// 		break;
		// 	case 83:
		// 		render_data.keyCodes["s_key"] = d;
		// 		break;
		// 	case 39:
		// 		render_data.keyCodes["right_arrow_key"] = d;
		// 		break;
		// 	case 38:
		// 		render_data.keyCodes["up_arrow_key"] = d;
		// 		break;
		// 	case 37:
		// 		render_data.keyCodes["left_arrow_key"] = d;
		// 		break;
		// 	case 40:
		// 		render_data.keyCodes["down_arrow_key"] = d;
		// 		break;
		// 	case 82:
		// 		d && (
		// 			setcam(10, 80, 0),
		// 			controls.target.set(0, 0, 0)
		// 		)
		// 		break;
		// 	case 69:
		// 		socket.send({type : 'keyCode', move : 'e_key'});
		// 		break;
		// 	case 84:
		// 		// Si mode tournoi alors on change de vue en vision bracket
		// 		break;
		// }
		// let keyVar = event.which;
		keyCode.right = 0;
		keyCode.left = 0;
		if (keyVar == 68)
		{
			keyCode.left = 0;
			keyCode.right = 1;
		}
		if (keyVar == 65)
		{
			keyCode.left = 1;
			keyCode.right = 0;
		}
		if (keyVar == 39)
		{
			keyCode.left = 0;
			keyCode.right = 1;
		}
		if (keyVar == 37)
		{
			keyCode.left = 1;
			keyCode.right = 0;
		}
		if (keyVar == 82)
		{
			// socket.send({type : 'keyCode', move : "reset"});
		}
		if (keyCode.right == 1 && keyCode.left == 0)
			socket.send({type : 'keyCode', move : "right"});
		else if (keyCode.right == 0 && keyCode.left == 1) 
			socket.send({type : 'keyCode', move : "left"});
	}

    initiateMapTwoPlayer({}, 0, 0, 0);
	initiateMapTwoPlayer({}, 80, 0, 1);
	initiateMapTwoPlayer({}, 160, 0, 2);
	initiateMapTwoPlayer({}, 240, 0, 3);
	initiateMapTwoPlayer({}, 160, 100, 4);
	initiateMapTwoPlayer({}, 80, 100, 5);
	initiateMapTwoPlayer({}, 120, 200, 6);

    scene.add(...render_data.pallet, ...render_data.balls);

    function display_score(i){
		if ( i == 0)
			createText(render_data.scores[0][0] + " : " + render_data.scores[0][1], 0, 0, 0)
		else if (i == 1)
			createText(render_data.scores[1][0] + " : " + render_data.scores[1][1], 80, 0, 1);
		else if (i == 2)
			createText(render_data.scores[2][0] + " : " + render_data.scores[2][1], 160, 0, 2);
		else if (i == 3)
			createText(render_data.scores[3][0] + " : " + render_data.scores[3][1], 240, 0, 3);
		else if (i == 4)
			createText(render_data.scores[4][0] + " : " + render_data.scores[4][1], 80, 100, 4);
		else if (i == 5)
			createText(render_data.scores[5][0] + " : " + render_data.scores[5][1], 160, 100, 5);
		else if (i == 6)
			createText(render_data.scores[6][0] + " : " + render_data.scores[6][1], 120, 200, 6);
	}

    let scoreUpdate = [0, 0, 0, 0, 0, 0, 0];
    let animationid = null,
		ts = Date.now();
    const animate = async () => {
		renderer.render(scene, camera);
		composer.render();
		controls.update();

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

			if (event.type == "gameState")
            {
                for (let i = 0; i < 8; i++)
                {
                    if (data.player[i].gameNumber != -1 && render_data.scores[data.player[i].gameNumber][render_data.k[data.player[i].gameNumber]] != data.player[i].scores && data.player[i].scores >= 0){
                        render_data.scores[data.player[i].gameNumber][render_data.k[data.player[i].gameNumber]] = data.player[i].scores;
                        scoreUpdate[data.player[i].gameNumber] = 1;
                        console.log("----")
                        console.log("update game : " + data.player[i].gameNumber);
                    }
                    if (data.player[i].gameNumber != -1){
                        render_data.k[data.player[i].gameNumber] += 1
                        render_data.k[data.player[i].gameNumber] %= 2
                    }
                    if (scoreUpdate[data.player[i].gameNumber] == 1){
                        scoreUpdate[data.player[i].gameNumber] = 0
                        console.log("display" + data.player[i].gameNumber + " : " + render_data.scores)
                        display_score(data.player[i].gameNumber);
                        console.log("----")
                    }
                }
				render_data.balls[0].position.x = data.ball.x;
				render_data.balls[1].position.x = data.ball2.x + 80;
				render_data.balls[2].position.x = data.ball3.x + 160;
				render_data.balls[3].position.x = data.ball4.x + 240;
				render_data.balls[4].position.x = data.ball5.x + 80;
				render_data.balls[5].position.x = data.ball6.x + 160;
				render_data.balls[6].position.x = data.ball7.x + 120;
				render_data.balls[0].position.z = data.ball.z;
				render_data.balls[1].position.z = data.ball2.z;
				render_data.balls[2].position.z = data.ball3.z;
				render_data.balls[3].position.z = data.ball4.z;
				render_data.balls[4].position.z = data.ball5.z + 100;
				render_data.balls[5].position.z = data.ball6.z + 100;
				render_data.balls[6].position.z = data.ball7.z + 200;
				for( let i = 0; i < 8; i++){
					if (data.player[i].gameNumber == -1){
						scene.remove(render_data.balls[data.player[i].gameNumber])
						scene.remove(pallet[i]);
					}
					else if (data.player[i].gameNumber < 4)
						render_data.pallet[i].position.x = data.player[i].x + data.player[i].gameNumber * 80;
					else if (data.player[i].gameNumber < 6){
						render_data.pallet[i].position.x = data.player[i].x + data.player[i].gameNumber%2 * 80 + 80;
						render_data.pallet[i].position.z = data.player[i].z + 100;
						if (i % 4 < 2)
							render_data.pallet[i].position.z += 28.5;
						else
							render_data.pallet[i].position.z -= 28.5;
					}
					else if (data.player[i].gameNumber == 6){
						render_data.pallet[i].position.x = data.player[i].x + 120;
						render_data.pallet[i].position.z = data.player[i].z + 200;
						if (i  < 4)
							render_data.pallet[i].position.z += 28.5;
						else
							render_data.pallet[i].position.z -= 28.5;
					}
				}
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
}

export default TournamentGameRender;