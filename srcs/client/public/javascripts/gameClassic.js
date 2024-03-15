import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

!function() {

	let socket = new Socket({path: "/game_4player"});
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
				data = msg.data;
				data.type = msg.type
				ball.position.x = data.ball.x;			
				ball.position.z = data.ball.z;			
				palletPlayer1.position.x = data.player[0].x;
				palletPlayer2.position.x = data.player[1].x;
				palletPlayer3.position.z = data.player[2].z;
				palletPlayer4.position.z = data.player[3].z;
			}
			else if (msg.type == "resetCam")
				setcam(10, 69, 0);
			else if (msg.type == "setCam")
				setcam(msg.data.x, msg.data.y, msg.data.z);
			else if (msg.type == "deletePallet")
				deletePallet(msg.data.n);
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
	controls.maxDistance = 90;
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
		scoreP3: 0,
		scoreP4: 0,
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
	let palletPlayer3 = 0;
	let palletPlayer4 = 0;
	let mapLenth
	let mapWidth
	ball
	function initiateMapFourPlayer()
	{
	
		mapLenth = 60;	
		mapWidth = 60;
		palletPlayer1 = new THREE.Mesh( 
			new THREE.BoxGeometry( 6, 1, 1 ), 
			new THREE.MeshStandardMaterial( {
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
				})
			);
		palletPlayer2 = new THREE.Mesh( 
			new THREE.BoxGeometry( 6, 1, 1 ), 
			new THREE.MeshStandardMaterial( {
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
				})
			);
		palletPlayer3 = new THREE.Mesh( 
			new THREE.BoxGeometry( 1, 1, 6 ), 
			new THREE.MeshStandardMaterial( {
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
				})
			);
		palletPlayer4 = new THREE.Mesh( 
			new THREE.BoxGeometry( 1, 1, 6 ), 
			new THREE.MeshStandardMaterial( {
				wireframe:false, 
				color:0xffffff, 
				opacity: 1, 
				emissive:0xffffff,
				side : THREE.DoubleSide,
			})
		);
		let wallLeft = new THREE.Mesh(
			new THREE.BoxGeometry( 1 , 1, mapLenth + 1),
			new THREE.MeshStandardMaterial( {
				wireframe:false, 
				color:0x00ffff, 
				opacity: 1, 
				emissive:0x00ffff,
				side : THREE.DoubleSide,
			})
		);
		let wallRight = new THREE.Mesh(
			new THREE.BoxGeometry( 1 , 1,  mapLenth + 1 ),
			new THREE.MeshStandardMaterial( {
				wireframe:false, 
				color:0x0000ff, 
				opacity: 1, 
				emissive:0x0000ff,
				side : THREE.DoubleSide,
			})
		);
		wallRight.position.x += mapWidth/2;
		wallLeft.position.x -= mapWidth/2;
		let wallP2 = new THREE.Mesh(
			new THREE.BoxGeometry( mapWidth - 1, 1, 1 ),
			new THREE.MeshStandardMaterial( {
				wireframe:false, 
				color:0xff00ff, 
				opacity: 1, 
				emissive:0xff00ff,
				side : THREE.DoubleSide,
				})
		);	
		let wallP1 = new THREE.Mesh(
			new THREE.BoxGeometry( mapWidth - 1, 1 , 1 ),
			new THREE.MeshStandardMaterial( {
				wireframe:false,
				color: new THREE.Color("rgb(255, 0, 0)"), 
				opacity: 1, 
				emissive: new THREE.Color("rgb(255, 0, 0)"),
				
				side : THREE.DoubleSide,
				})
		);
		wallP1.position.z += mapLenth/2
		wallP2.position.z -= mapLenth/2
		
		palletPlayer1.position.z += (mapLenth/2) - 1.5
		palletPlayer2.position.z -= (mapLenth/2) - 1.5
		palletPlayer3.position.x += (mapLenth/2) - 1.5
		palletPlayer4.position.x -= (mapLenth/2) - 1.5

		const geometryBall = new THREE.BoxGeometry( 1, 1, 1 );
		const materialBall = new THREE.MeshPhysicalMaterial({
			wireframe:false, 
			color:0xff0000, 
			opacity: 1, 
			iridescence :1,
			side : THREE.DoubleSide,
		});
		ball = new THREE.Mesh( geometryBall, materialBall );

		scene.add(wallLeft, wallRight, wallP1, wallP2, palletPlayer3, palletPlayer4, ball)
		controls.maxDistance = 80
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

	initiateMapFourPlayer({})

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
			setcam(10, 69, 0)
			controls.target.set( 0, 0, 0 );
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


		function createTextObject(msg) {
			let textObj
	
			textGeo = new TextGeometry( msg , {
	
				font: font,
	
				size: 10,
				height: 0.5,
				curveSegments: 2,
	
				bevelThickness: 0.1,
				bevelSize: 0.01,
				bevelEnabled: true
	
			} );
			textObj = new THREE.Mesh( textGeo, materials)
	
			return textObj;
		}
		let P1score = 5
		let P2score = 5
		let P3score = 5
		let P4score = 5
		function displayScore(){
			if (P1score != 0)
				scene.remove(P1score, P2score, P3score, P4score)
			P1score = createTextObject("" + score.scoreP1 + "") //Red player
			P1score.position.z += 30
			P1score.position.y += 6
			P1score.position.x += 2.5
			P1score.rotateY(Math.PI);
	
			
			P2score = createTextObject("" + score.scoreP2 + "") //Purple player
			P2score.position.z -= 30
			P2score.position.y += 6
			P2score.position.x -= 5
			
			
			P3score = createTextObject("" + score.scoreP3 + "") //Cyan player
			P3score.position.z += 2.5
			P3score.position.y += 6
			P3score.position.x -= 30
			P3score.rotateY(Math.PI*0.5);
			
			P4score = createTextObject("" + score.scoreP4 + "") //Blue player
			P4score.position.z -= 2.5
			P4score.position.y += 6
			P4score.position.x += 30
			P4score.rotateY(-Math.PI*0.5);
			
			scene.add(P1score, P2score, P3score, P4score)
		}
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
		ball : ball.position,
		ballDirection : ballDirection,
		P1position : palletPlayer1.position,
		P2position : palletPlayer2.position,
		P3position : palletPlayer3.position,
		P4position : palletPlayer4.position,
		score : score,
		updateScore : 0,
		moveSpeed : moveSpeed,
		playerNumber : playerNumber,
		gameID : 0,
		keyCode : keyCode
	};
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
				if ((score.scoreP2 != data.player[1].score || score.scoreP1 != data.player[0].score ||
						score.scoreP3 != data.player[2].score || score.scoreP4 != data.player[3].score))
				{
					score.scoreP1 = data.player[0].score;
					score.scoreP2 = data.player[1].score;
					score.scoreP3 = data.player[2].score;
					score.scoreP4 = data.player[3].score;
					displayScore();
				}
			}
		await sleep(25)
	}

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
	sleep(250).then(() => { animate(); });
	function setcam (x, y, z) {
		camera.position.set(x, y, z);
	}
	function deletePallet(n){
		if (n == 0)
			scene.remove(palletPlayer1);
		else if (n == 1)
			scene.remove(palletPlayer2);
		else if (n == 3)
			scene.remove(palletPlayer3);
		else if (n == 2)
			scene.remove(palletPlayer4);
	}
	console.log("cookie");
}();
