import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

!function() {
	let counter = 0
	let socket = new Socket({path: "/socket"});
	let playerNumber = -1;
	let connectionStatus = 0;
	socket.onconnection(() => {
		console.info("Connection opened");
		socket.send({type : "init"});
		connectionStatus = 1;
	});
	socket.onclose(() => {

		console.info("Connection closed");
		connectionStatus = 2;
		window.location.replace("/")				//url of end game
	});
	socket.use((msg) =>{
			if (msg.type == "gameState")
			{	
				console.log("here");
				data = msg.data;
				data.type = msg.type
				ball.position.x = data.ball.x;			
				ball.position.z = data.ball.z;			
				palletPlayer1.position.x = data.player[0].x;
				palletPlayer2.position.x = data.player[1].x;
				// keyCode.right = 0;
				// keyCode.left = 0;
			}
			else if (msg.type == "resetCam")
				setcam(10, 69, 0);
			else if (msg.type == "setCam")
				setcam(msg.data.x, msg.data.y, msg.data.z);
	});

	let ball;

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.setPixelRatio( window.devicePixelRatio );

	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 200 );
	camera.position.set( 15, 15, 20 );

	const controls = new OrbitControls( camera, renderer.domElement );
	const scene = new THREE.Scene();
	const sceneError = new THREE.Scene;
	controls.maxDistance = 70;
	controls.target.set( 0, 0, 0 );
	controls.update();


	const Alight = new THREE.AmbientLight({color:0xffffff});
	scene.add( Alight );


	// const player1Map = new THREE.TextureLoader().load( "/static/javascripts/img/kitten.jpg" );
	// const player2Map = new THREE.TextureLoader().load( "/static/javascripts/img/smug_frieren.jpg" );
	// const ballMap = new THREE.TextureLoader().load( "/static/javascripts/img/fire.jpg" );
	// const sky = new THREE.TextureLoader().load( "/static/javascripts/img/sky3.jpg" );
	// const nooo = new THREE.TextureLoader().load( "/static/javascripts/img/no.jpg" );

	let font, textGeo, textMesh2

	var score = {
		scoreP1: 0,
		scoreP2: 0,
	};

	function loadFont() {

		const loader = new FontLoader();
		loader.load( '/static/javascripts/font.json', function ( response ) {

			font = response;

			createText("");

		} );
	}

	let palletPlayer1 = 0;
	let palletPlayer2 = 0;
	let mapLenth
	let mapWidth
	function initiateMapTwoPlayer(data)
	{
		
		mapLenth = 60;
		mapWidth = 40;
		palletPlayer1 = new THREE.Mesh( 
			new THREE.BoxGeometry( 6, 1, 1 ), 
			new THREE.MeshStandardMaterial({
				wireframe:false, 
					color:0xffffff, 
					opacity: 1, 
					emissive:0xffffff,
					side : THREE.DoubleSide,
				})
			);
		palletPlayer2 = new THREE.Mesh( 
			new THREE.BoxGeometry( 6, 1, 1 ), 
			new THREE.MeshStandardMaterial({
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
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
		wallRight.position.x += mapWidth/2;
		wallLeft.position.x -= mapWidth/2;
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
		wallP1.position.z += mapLenth/2
		wallP2.position.z -= mapLenth/2

		const geometryBall = new THREE.BoxGeometry( 1, 1, 1 );
		const materialBall = new THREE.MeshPhysicalMaterial({
			wireframe:false, 
			color:0xff0000, 
			opacity: 1, 
			iridescence :1,
			side : THREE.DoubleSide,
		});
		ball = new THREE.Mesh( geometryBall, materialBall );

		palletPlayer1.position.z += (mapLenth/2) - 1.5;
		palletPlayer2.position.z -= (mapLenth/2) - 1.5;
		
		scene.add(wallLeft, wallRight, wallP1, wallP2, ball);
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

	let moveSpeed = 1.05

	initiateMapTwoPlayer({})

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
			// socket.send({type : 'keyCode', move : "right"});
		}
		if (keyVar == 65)
		{
			keyCode.left = 1
			keyCode.right = 0
			// socket.send({type : 'keyCode', move : "left"});
		}
		if (keyVar == 39)
		{
			keyCode.left = 0
			keyCode.right = 1
			// socket.send({type : 'keyCode', move : "right"});
		}
		if (keyVar == 37)
		{
			keyCode.left = 1
			keyCode.right = 0
			// socket.send({type : 'keyCode', move : "left"})
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
// 
// 
		if (keyVar == 68)
			keyCode.right = 0
		if (keyVar == 65)
			keyCode.left = 0
		if (keyVar == 39)
			keyCode.right = 0
		if (keyVar == 37)
			keyCode.left = 0
	}

	let ballDirection = {
		x : 0.5 + Math.random(),
		z : 0.5 + Math.random(),
	};

	const 	materials = [
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
		];
	if (palletPlayer1 != 0)
		scene.add(palletPlayer1, palletPlayer2);

	function createText(msg) {
		scene.remove(textMesh2);
		textGeo = new TextGeometry( msg , {

			font: font,

			size: 10,
			height: 0.5,
			curveSegments: 2,

			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelEnabled: true

		});

		textMesh2 = new THREE.Mesh( textGeo, materials);
		textMesh2.rotateX(-Math.PI * 0.5);
		textMesh2.rotateZ(Math.PI * 0.5);
		textMesh2.position.z += 12.5;
		textMesh2.position.x += 2.5;
		textMesh2.position.y -= 2;
		
		scene.add(textMesh2);
		textGeo.dispose();
	}

	var keyCode = {
		left : 0,
		right : 0
	}
	
	let data = {
		number : [2],
		ball : ball.position,
		ballDirection : ballDirection,
		P1position : palletPlayer1.position,
		P2position : palletPlayer2.position,
		score : score,
		updateScore : 0,
		moveSpeed : moveSpeed,
		playerNumber : playerNumber,
		gameID : 0,
		keyCode : keyCode
	};
	// socket.send({type : 0, data : data});
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
					scene.remove(ball);
					return;
				}
				if ((score.scoreP2 != data.player[1].score || score.scoreP1 != data.player[0].score))
				{
					score.scoreP1 = data.player[0].score;
					score.scoreP2 = data.player[1].score;
					createText(data.player[0].score + " : " + data.player[1].score);
				}
			}
		await sleep(25)
	}

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
	sleep(250).then(() => { animate(); });
	function setcam (x, y, z) {
		camera.position.set(x, y, z);
	}
	console.log("cookie");
}();
