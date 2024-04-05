import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

!function() {
	let socket = new Socket({path: "/tournament"});
	socket.onconnection(() => {
		console.info("Connection opened");
		socket.send({type : "init"});
	});
	socket.onclose(() => {
		console.info("Connection closed");
		window.location.replace("/");
	});
	socket.use((msg) =>{
			if (msg.type == "gameState")
			{	
				data = msg.data;
				data.type = msg.type
				ball[0].position.x = data.ball.x;
				ball[1].position.x = data.ball2.x + 80;
				ball[2].position.x = data.ball3.x + 160;
				ball[3].position.x = data.ball4.x + 240;
				ball[4].position.x = data.ball5.x + 80;
				ball[5].position.x = data.ball6.x + 160;
				ball[6].position.x = data.ball7.x + 120;
				ball[0].position.z = data.ball.z;
				ball[1].position.z = data.ball2.z;
				ball[2].position.z = data.ball3.z;
				ball[3].position.z = data.ball4.z;
				ball[4].position.z = data.ball5.z + 100;
				ball[5].position.z = data.ball6.z + 100;
				ball[6].position.z = data.ball7.z + 200;
				for( let i = 0; i < 8; i++){
					if (data.player[i].gameNumber == -1){
						scene.remove(ball[data.player[i].gameNumber])
						scene.remove(pallet[i]);
					}
					else if (data.player[i].gameNumber < 4)
						pallet[i].position.x = data.player[i].x + data.player[i].gameNumber * 80;
					else if (data.player[i].gameNumber < 6){
						pallet[i].position.x = data.player[i].x + data.player[i].gameNumber%2 * 80 + 80;
						pallet[i].position.z = data.player[i].z + 100;
						if (i % 4 < 2)
							pallet[i].position.z += 28.5;
						else
							pallet[i].position.z -= 28.5;
					}
					else if (data.player[i].gameNumber == 6){
						pallet[i].position.x = data.player[i].x + 120;
						pallet[i].position.z = data.player[i].z + 200;
						if (i  < 4)
							pallet[i].position.z += 28.5;
						else
							pallet[i].position.z -= 28.5;
					}
				}
			}
			else if (msg.type == "setCam")
				setcam(msg.data.x, msg.data.y, msg.data.z, msg.data.camx, msg.data.camy, msg.data.camz);
	});
	let data = {
		// number : [2],
		// ball[] : ball[].position,
		// ballDirection : ballDirection,
		// P1position : pallet[0].position,
		// P2position : pallet[1].position,
		// scores : scores,
		// updateScore : 0,
		// moveSpeed : moveSpeed,
		// playerNumber : playerNumber,
		// gameID : 0,
		// keyCode : keyCode
	};
	let balls = [0 ,1 ,2 ,3 ,4 ,5 ,6];

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.setPixelRatio( window.devicePixelRatio );

	let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 15, 15, 20 );

	const controls = new OrbitControls( camera, renderer.domElement );
	const scene = new THREE.Scene();
	const sceneError = new THREE.Scene;
	controls.maxDistance = 90;
	controls.target.set( 0, 0, 0 );
	controls.update();


	const Alight = new THREE.AmbientLight({color:0xffffff});
	scene.add( Alight );

	let font;
	let textGeo = [];
	let textMesh2 = [];

	let scores = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
	let k = [0, 0, 0, 0, 0, 0, 0, 0];

	function loadFont() {

		const loader = new FontLoader();
		loader.load( '/static/fonts/font.json', function ( response ) {

			font = response;

			createText("");

		} );
	}

	let pallet = [0, 1 ,2, 3, 4, 5, 6, 7];
	function initiateMapTwoPlayer(data, offset_x, offset_z, num )
	{
		let mapLenth = 60;
		let mapWidth = 40;
		if (num <= 3){
			pallet[0 + (num * 2)] = new THREE.Mesh( 
				new THREE.BoxGeometry( 6, 1, 1 ), 
				new THREE.MeshStandardMaterial({
					wireframe:false, 
						color:0xffffff, 
						opacity: 1, 
						emissive:0xffffff,
						side : THREE.DoubleSide,
					})
				);
			pallet[1 + (num * 2)] = new THREE.Mesh( 
				new THREE.BoxGeometry( 6, 1, 1 ), 
				new THREE.MeshStandardMaterial({
					wireframe:false, 
					color:0xffffff, 
					opacity: 1, 
					emissive:0xffffff,
					side : THREE.DoubleSide,
				})
				);
				pallet[0 + (num * 2)].position.z += (mapLenth/2) - 1.5 + offset_z;
				pallet[0 + (num * 2)].position.x += offset_x;
				pallet[1 + (num * 2)].position.z -= (mapLenth/2) - 1.5 - offset_z;
				pallet[1 + (num * 2)].position.x += offset_x;
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
	
		wallP2.position.x += offset_x
		wallP2.position.z -= mapLenth/2 - offset_z
		wallP1.position.x += offset_x
		wallP1.position.z += mapLenth/2 + offset_z

		const geometryBall = new THREE.BoxGeometry( 1, 1, 1 );
		const materialBall = new THREE.MeshPhysicalMaterial({
			wireframe:false, 
			color:0xff0000, 
			opacity: 1, 
			iridescence :1,
			side : THREE.DoubleSide,
		});

		balls[num] = new THREE.Mesh( geometryBall, materialBall );
		balls[num].position.x = offset_x;
		balls[num].position.z = offset_z;

		scene.add(wallLeft, wallRight, wallP1, wallP2, ball[num]);
	}

	const params = {
		threshold: 0,
		strength: 0.35,
		radius: 0,
		exposure: 1
	};

	const renderScene = new RenderPass( scene, camera );

	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = params.threshold;
	bloomPass.strength = params.strength;
	bloomPass.radius = params.radius;
	const outputPass = new OutputPass();
	let composer = new EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( bloomPass );
	composer.addPass( outputPass );

	initiateMapTwoPlayer({}, 0, 0, 0);
	initiateMapTwoPlayer({}, 80, 0, 1);
	initiateMapTwoPlayer({}, 160, 0, 2);
	initiateMapTwoPlayer({}, 240, 0, 3);
	initiateMapTwoPlayer({}, 160, 100, 4);
	initiateMapTwoPlayer({}, 80, 100, 5);
	initiateMapTwoPlayer({}, 120, 200, 6);

	document.addEventListener("keydown", onDocumentKeyDown, true);
	document.addEventListener("keyup", onDocumentKeyUp, true);
	function onDocumentKeyDown(event) {
		let keyVar = event.which;
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
			socket.send({type : 'keyCode', move : "reset"});
		}
		if (keyCode.right == 1 && keyCode.left == 0)
			socket.send({type : 'keyCode', move : "right"});
		else if (keyCode.right == 0 && keyCode.left == 1) 
			socket.send({type : 'keyCode', move : "left"});
	}
	function onDocumentKeyUp(event) {
	    let keyVar = event.which; 
		if (keyVar == 68)
			keyCode.right = 0;
		if (keyVar == 65)
			keyCode.left = 0;
		if (keyVar == 39)
			keyCode.right = 0;
		if (keyVar == 37)
			keyCode.left = 0;
	}


	const 	materials = [
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
	];
	if (pallet[0] != 0)
		scene.add(pallet[0], pallet[1], pallet[2], pallet[3], pallet[4], pallet[5], pallet[6], pallet[7]);

	function createText(msg, offset_x, offset_z, game) {
		scene.remove(textMesh2[game]);
		textGeo[game] = new TextGeometry( msg , {

			font: font,

			size: 10,
			height: 0.5,
			curveSegments: 2,

			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelEnabled: true

		});
		textMesh2[game] = new THREE.Mesh( textGeo[game], materials);
		textMesh2[game].rotateX(-Math.PI * 0.5);
		textMesh2[game].rotateZ(Math.PI * 0.5);
		textMesh2[game].position.z += 12.5 + offset_z;
		textMesh2[game].position.x += 2.5 + offset_x;
		textMesh2[game].position.y -= 2;
		
		scene.add(textMesh2[game]);
		textGeo[game].dispose();
	}

	let keyCode = {
		left : 0,
		right : 0
	}
	const sky = new THREE.TextureLoader().load( "/static/javascripts/img/background_sky_box.jpg" );
	const skyboxGeo = new THREE.SphereGeometry( 450 );
	const materialSky = new THREE.MeshPhysicalMaterial({
		wireframe:false, 
		opacity: 1,
		side : THREE.BackSide,
		map  : sky
	});
	const skybox = new THREE.Mesh(skyboxGeo, materialSky)
	skybox.position.x += 120;
	scene.add(skybox)

	loadFont();
	let scoreUpdate = [0, 0, 0, 0, 0, 0, 0];
	const animate = async () => {
		if (composer){
			renderer.render( scene, camera );
			composer.render();	
		}
		else
			renderer.render( sceneError, camera );
		controls.update();
		requestAnimationFrame(animate);
		if (data.type == "gameState")
		{
			for (let i = 0; i < 8; i++)
			{
				if (data.player[i].gameNumber != -1 && scores[data.player[i].gameNumber][k[data.player[i].gameNumber]] != data.player[i].score){ //test from a commit
					scores[data.player[i].gameNumber][k[data.player[i].gameNumber]] = data.player[i].scores; 
					scoreUpdate[data.player[i].gameNumber] = 1;
					console.log("----")
					console.log("update game : " + data.player[i].gameNumber);
				}
				if (data.player[i].gameNumber != -1){
					k[data.player[i].gameNumber] += 1
					k[data.player[i].gameNumber] %= 2
				}
				if (scoreUpdate[data.player[i].gameNumber] == 1){
					scoreUpdate[data.player[i].gameNumber] = 0
					console.log("display" + data.player[i].gameNumber + " : " + scores)
					display_score(data.player[i].gameNumber);
					console.log("----")
				}
			}
		}
	}

	function display_score(i){
		if ( i == 0)
			createText(scores[0][0] + " : " + scores[0][1], 0, 0, 0)
		else if (i == 1)
			createText(scores[1][0] + " : " + scores[1][1], 80, 0, 1);
		else if (i == 2)
			createText(scores[2][0] + " : " + scores[2][1], 160, 0, 2);
		else if (i == 3)
			createText(scores[3][0] + " : " + scores[3][1], 240, 0, 3);
		else if (i == 4)
			createText(scores[4][0] + " : " + scores[4][1], 80, 100, 4);
		else if (i == 5)
			createText(scores[5][0] + " : " + scores[5][1], 160, 100, 5);
		else if (i == 6)
			createText(scores[6][0] + " : " + scores[6][1], 120, 200, 6);
	}

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
	sleep(250).then(() => { animate(); });
	function setcam (x, y, z, camx, camy, camz) {
		controls.target.set(camx, camy, camz)
		camera.position.set(x, y, z);
		controls.update();
	}
	console.log("cookie");
}();
