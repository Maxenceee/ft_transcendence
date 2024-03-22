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
	let connectionStatus = 0;
	socket.onconnection(() => {
		console.info("Connection opened");
		socket.send({type : "init"});
		connectionStatus = 1;
	});
	socket.onclose(() => {
		console.info("Connection closed");
		connectionStatus = 2;
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
				// ball[4].position.x = data.ball.x + 80;
				// ball[5].position.x = data.ball.x + 160;
				// ball[6].position.x = data.ball.x + 120;		
				ball[0].position.z = data.ball.z;
				ball[1].position.z = data.ball2.z;
				ball[2].position.z = data.ball3.z;
				ball[3].position.z = data.ball4.z;
				// ball[4].position.z = data.ball.z + 100;
				// ball[5].position.z = data.ball.z + 100;
				// ball[6].position.z = data.ball.z + 200;
				// console.log(data.player);
				pallet[0].position.x = data.player[0].x + data.player[0].gameNumber * 80;
				pallet[1].position.x = data.player[1].x + data.player[1].gameNumber * 80;
				pallet[2].position.x = data.player[2].x + data.player[2].gameNumber * 80;
				pallet[3].position.x = data.player[3].x + data.player[3].gameNumber * 80;
				pallet[4].position.x = data.player[4].x + data.player[4].gameNumber * 80;
				pallet[5].position.x = data.player[5].x + data.player[5].gameNumber * 80;
				pallet[6].position.x = data.player[6].x + data.player[6].gameNumber * 80;
				pallet[7].position.x = data.player[7].x + data.player[7].gameNumber * 80;
			}
			else if (msg.type == "resetCam")
				// setcam(10, 69, 0);
				;
			else if (msg.type == "setCam")
				setcam(msg.data.x, msg.data.y, msg.data.z);
	});
	let data = {
		// number : [2],
		// ball[] : ball[].position,
		// ballDirection : ballDirection,
		// P1position : pallet[0].position,
		// P2position : pallet[1].position,
		// score : score,
		// updateScore : 0,
		// moveSpeed : moveSpeed,
		// playerNumber : playerNumber,
		// gameID : 0,
		// keyCode : keyCode
	};
	let ball = [0 ,1 ,2 ,3 ,4 ,5 ,6];

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.setPixelRatio( window.devicePixelRatio );

	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 15, 15, 20 );

	const controls = new OrbitControls( camera, renderer.domElement );
	const scene = new THREE.Scene();
	const sceneError = new THREE.Scene;
	controls.maxDistance = 90;
	controls.target.set( 0, 0, 0 );
	controls.update();


	const Alight = new THREE.AmbientLight({color:0xffffff});
	scene.add( Alight );


	// const player1Map = new THREE.TextureLoader().load( "/static/javascripts/img/kitten.jpg" );
	// const player2Map = new THREE.TextureLoader().load( "/static/javascripts/img/smug_frieren.jpg" );
	// const ballMap = new THREE.TextureLoader().load( "/static/javascripts/img/fire.jpg" );

	// const nooo = new THREE.TextureLoader().load( "/static/javascripts/img/no.jpg" );

	let font, textGeo, textMesh2
	textGeo = []
	textMesh2 = []
	

	var score = {
		scoreP1: 0,
		scoreP2: 0,
		scoreP3: 0,
		scoreP4: 0,
		scoreP5: 0,
		scoreP6: 0,
		scoreP7: 0,
		scoreP8: 0,
	};

	function loadFont() {

		const loader = new FontLoader();
		loader.load( '/static/javascripts/font.json', function ( response ) {

			font = response;

			createText("");

		} );
	}

	let pallet = [0, 1 ,2, 3, 4, 5, 6, 7];
	let mapLenth
	let mapWidth
	function initiateMapTwoPlayer(data, offset_x, offset_z, num )
	{
		
		mapLenth = 60;
		mapWidth = 40;
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
		ball[num] = new THREE.Mesh( geometryBall, materialBall );
		ball[num].position.x = offset_x;
		ball[num].position.z = offset_z;

		
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
	let composer
	composer = new EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( bloomPass );
	composer.addPass( outputPass );

	initiateMapTwoPlayer({}, 0, 0, 0)
	initiateMapTwoPlayer({}, 80, 0, 1)
	initiateMapTwoPlayer({}, 160, 0, 2)
	initiateMapTwoPlayer({}, 240, 0, 3)
	initiateMapTwoPlayer({}, 160, 100, 4)
	initiateMapTwoPlayer({}, 80, 100, 5)
	initiateMapTwoPlayer({}, 120, 200, 6)

	document.addEventListener("keydown", onDocumentKeyDown, true);
	document.addEventListener("keyup", onDocumentKeyUp, true)
	function onDocumentKeyDown(event) {
		let keyVar = event.which;
		keyCode.right = 0
		keyCode.left = 0
		if (keyVar == 68)
		{
			keyCode.left = 0
			keyCode.right = 1
		}
		if (keyVar == 65)
		{
			keyCode.left = 1
			keyCode.right = 0
		}
		if (keyVar == 39)
		{
			keyCode.left = 0
			keyCode.right = 1
		}
		if (keyVar == 37)
		{
			keyCode.left = 1
			keyCode.right = 0
		}
		if (keyVar == 82)
		{
			socket.send({type : 'keyCode', move : "reset"});
			// setcam(10, 69, 0)
			// controls.target.set( 0, 0, 0 );
		}
		if (keyCode.right == 1 && keyCode.left == 0)
			socket.send({type : 'keyCode', move : "right"});
		else if (keyCode.right == 0 && keyCode.left == 1) 
			socket.send({type : 'keyCode', move : "left"})
		else
			;
	}
	function onDocumentKeyUp(event) {
	    let keyVar = event.which; 
		if (keyVar == 68)
			keyCode.right = 0
		if (keyVar == 65)
			keyCode.left = 0
		if (keyVar == 39)
			keyCode.right = 0
		if (keyVar == 37)
			keyCode.left = 0
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

	var keyCode = {
		left : 0,
		right : 0
	}

	const sky = new THREE.TextureLoader().load( "/static/javascripts/img/sky6.jpg" );
	const skyboxGeo		 = new THREE.SphereGeometry( 300 );
	const materialSky = new THREE.MeshPhysicalMaterial({
		wireframe:false, 
		opacity: 1,
		side : THREE.BackSide,
		map  : sky
	});
	const skybox = new THREE.Mesh(skyboxGeo, materialSky)
	scene.add(skybox)

	loadFont();

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
			if (score.scoreP1 > 9 || score.scoreP2 > 9)
			{
				scene.remove(ball[0]);
				// return;
			}
			if (score.scoreP3 > 9 || score.scoreP4 > 9)
			{
				scene.remove(ball[1]);
				return;
			}
			if (score.scoreP5 > 9 || score.scoreP6 > 9)
			{
				scene.remove(ball[2]);
				return;
			}
			if (score.scoreP7 > 9 || score.scoreP8 > 9)
			{
				scene.remove(ball[3]);
				return;
			}
			if ((score.scoreP2 != data.player[1].score || score.scoreP1 != data.player[0].score || 
				score.scoreP3 != data.player[2].score  || score.scoreP4 != data.player[3].score 
				|| score.scoreP5 != data.player[4].score  || score.scoreP6 != data.player[5].score  
				|| score.scoreP7 != data.player[6].score  || score.scoreP8 != data.player[7].score ))
			{

				score.scoreP1 = data.player[0].score;
				score.scoreP2 = data.player[1].score;
				createText(data.player[0].score + " : " + data.player[1].score, 0, 0, 0);
				score.scoreP3 = data.player[2].score;
				score.scoreP4 = data.player[3].score;
				createText(data.player[2].score + " : " + data.player[3].score, 80, 0, 1);
				score.scoreP5 = data.player[4].score;
				score.scoreP6 = data.player[5].score;
				createText(data.player[4].score + " : " + data.player[5].score, 160, 0, 2);
				score.scoreP7 = data.player[6].score;
				score.scoreP8 = data.player[7].score;
				createText(data.player[6].score + " : " + data.player[7].score, 240, 0, 3);
				// console.log(textMesh2);
			}
		}
		await sleep(25);
	}

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
	sleep(250).then(() => { animate(); });
	function setcam (x, y, z) {
		camera.position.set(x, y, z);
	}
	console.log("cookie");
}();
