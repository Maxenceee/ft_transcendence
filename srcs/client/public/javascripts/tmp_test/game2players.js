import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


let socket = new Socket({path: "/socket"});
let playerNumber = 9007199254740991
let connectionStatus = 0
socket.onconnection(() => {
	console.info("Connection opened, yay");
	socket.send({type : 2})
	connectionStatus = 1
});
socket.onclose(() => {
	console.info("Bye bye madafaka");
	connectionStatus = 2
});
let gameID = undefined
socket.use((msg) =>{
	if (playerNumber == 9007199254740991 && msg.type == "id")
	{
		playerNumber = msg.playerNumber
		data.gameID = msg.gameID
		gameID = data.gameID
		console.log(playerNumber)
		console.log(gameID)
		setcam()
	}
	else{
		if (gameID == undefined)
		{
			socket.send({type : 2})
			sleep (50)
			gameID = msg.gameID
			playerNumber = msg.playerNumber
			console.log(playerNumber)
			console.log(gameID)
			return
		}
		if (msg.gameID != gameID)
			{
				console.log("have "   + gameID)
				console.log("receve " + msg.gameID)
				return
			}
		data = msg
		keyCode = data.keyCode
		if (playerNumber % 2 == 0)
			palletPlayer1.position.x = data.P1position.x
		else
			palletPlayer2.position.x = data.P2position.x
	}
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
const sceneError = new THREE.Scene
controls.maxDistance = 70
controls.target.set( 0, 0, 0 );
controls.update();


const Alight = new THREE.AmbientLight({color:0xffffff});
scene.add( Alight );


const player1Map = new THREE.TextureLoader().load( "/static/javascripts/img/kitten.jpg" );
const player2Map = new THREE.TextureLoader().load( "/static/javascripts/img/smug_frieren.jpg" );
const ballMap = new THREE.TextureLoader().load( "/static/javascripts/img/fire.jpg" );
const sky = new THREE.TextureLoader().load( "/static/javascripts/img/sky3.jpg" );
const nooo = new THREE.TextureLoader().load( "/static/javascripts/img/no.jpg" );

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
	let wallLeft = new THREE.Mesh(
		new THREE.BoxGeometry( 1 , 1, mapLenth + 1),
		new THREE.MeshStandardMaterial( {
			wireframe:false, 
			color:0xffffff, 
			opacity: 1, 
			emissive:0xffffff,
			side : THREE.DoubleSide,
			})
	);

	let wallRight = new THREE.Mesh(
		new THREE.BoxGeometry( 1 , 1,  mapLenth + 1 ),
		new THREE.MeshStandardMaterial( {
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
			color:0x00ffff, 
			opacity: 1, 
			emissive:0x00ffff,
			
			side : THREE.DoubleSide,
			})
	);
	wallP1.position.z += mapLenth/2
	wallP2.position.z -= mapLenth/2

	const geometryBall = new THREE.BoxGeometry( 1, 1, 1 );
	const materialBall = new THREE.MeshPhysicalMaterial( {
		wireframe:false, 
		color:0xff0000, 
		opacity: 1, 
		iridescence :1,
		side : THREE.DoubleSide,
	});
	ball = new THREE.Mesh( geometryBall, materialBall );



	palletPlayer1.position.z += (mapLenth/2) - 1.5
	palletPlayer2.position.z -= (mapLenth/2) - 1.5
	
	scene.add(wallLeft, wallRight, wallP1, wallP2, ball)
}


//debuging


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

	
// const planeGeo = new THREE.PlaneGeometry(50, 50); 



const outputPass = new OutputPass();
let composer
composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );




let moveSpeed = 1.05

initiateMapTwoPlayer({})
var updatePlayer = 0;
document.addEventListener("keydown", onDocumentKeyDown, true);
function onDocumentKeyDown(event) {
    let keyVar = event.which;

	// keyCode.Key37 = 0
	// keyCode.Key65 = 0
	// keyCode.Key68 = 0
	// keyCode.Key39 = 0
	// if (keyVar == 68)
	// {
	// 	keyCode.Key68 = 1
	// 	keyCode.Key65 = 0
	// }
	// if (keyVar == 65)
	// {
	// 	keyCode.Key65 = 1
	// 	keyCode.Key68 = 0
	// }
	// if (keyVar == 39)
	// {
	// 	keyCode.Key39 = 1
	// 	keyCode.Key37 = 0
	// }
	// if (keyVar == 37)
	// {
	// 	keyCode.Key39 = 0
	// 	keyCode.Key37 = 1
	// }
	if (playerNumber % 2 == 1)
	{
		if (keyVar == 68 || keyVar == 39) 
		{
			palletPlayer1.position.x += mapWidth/60 ;
			data.P1position = palletPlayer1.position ;
			counter +=2
		}
		if (keyVar == 65 || keyVar == 37)
		{
			palletPlayer1.position.x -= mapWidth/60 ;
			data.P1position = palletPlayer1.position ;
			counter +=2
		}
	}
	else if (playerNumber % 2 == 0)
	{
		if (keyVar == 65 || keyVar == 37) 
		{
			data.P2position = palletPlayer2.position ;
			palletPlayer2.position.x += mapWidth/60 ;
			counter +=2
		}
		if (keyVar == 68 || keyVar == 39)
		{
			palletPlayer2.position.x -= mapWidth/60 ;
			data.P2position = palletPlayer2.position ;
			counter +=2
		}
	}
	data.keyCode = keyCode
	updatePlayer = 1;
}
// function onDocumentKeyUp(event) {
//     let keyVar = event.which;


// 	if (keyVar == 68)
// 		keyCode.Key68 = 0
// 	if (keyVar == 65)
// 		keyCode.Key65 = 0
// 	if (keyVar == 39)
// 		keyCode.Key39 = 0
// 	if (keyVar == 37)
// 		keyCode.Key37 = 0

// 	data.keyCode = keyCode
// 	updatePlayer = 1
// 	// socket.send({type:2, data})
// 	// palletPlayer1.position.x = data.P1position.x ;
// 	// palletPlayer2.position.x = data.P2position.x ;
// 	// console.log(keyCode);
// }

function resetBall()
{
	data.ball.z = 0
	data.ball.x = 0
	data.ball.y = 0
	moveSpeed = 1.05
	data.ballDirection.x = THREE.MathUtils.randFloat(-1, 1);
	data.ballDirection.z *= -1;
	try {		
		ball.position = data.ball// it throw a error cause the  position is read only
	} catch (error) {
	}
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
	scene.add(palletPlayer1, palletPlayer2)


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

	} );

	textMesh2 = new THREE.Mesh( textGeo, materials)
	textMesh2.rotateX(-Math.PI * 0.5);
	textMesh2.rotateZ(Math.PI * 0.5);
	textMesh2.position.z += 12.5;
	textMesh2.position.x += 2.5;
	textMesh2.position.y -= 2;
	
	scene.add(textMesh2);
	textGeo.dispose()
}
var keyCode = {
	Key68 : 0,
	Key65 : 0,
	Key39 : 0,
	Key37 : 0,
}

let counter = 0
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
	gameID : 0
};
socket.send({type : 0, data : data})
loadFont()
var endScore = 0;

const animate = async () => {

	if (composer){
		renderer.render( scene, camera );
		composer.render();	
	}
	else
		renderer.render( sceneError, camera );
	controls.update()
	requestAnimationFrame(animate)
	if (gameID	!= undefined)
	{
		if (score.scoreP1 > 1 || score.scoreP2 > 1)
		{
			resetBall()
			if (endScore == 0)
			{
				endScore = 1;
				createText(data.score.scoreP2 + " : " + data.score.scoreP1)
			}
			scene.remove(ball);
			return;
		}
			if (data.updateScore != 0 && data.score != score)
			{
				score = data.score
				createText(data.score.scoreP2 + " : " + data.score.scoreP1)
				// console.log(score)
			}
			// ball.rotation.x +=  .1
			ball.position.x = data.ball.x
			ball.position.z = data.ball.z
			ballDirection = data.direction
	}
	await sleep(25)
	
}



const tmp = async () => {
	while ( connectionStatus != 2 )
	{
		data.playerNumber = playerNumber
		counter += 1
		if (data.playerNumber % 2 == 0)
			data.number[0] = counter
		else 
			data.number[1] = counter
		socket.send({type : 0, data:data})	
		if (endScore == 1)
		{
			socket.send({type : "end"})
			return
		}
		await sleep(50)
	}

}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
sleep(250).then(() => {animate(); });
tmp()
function setcam () {
	if (playerNumber % 2 == 1)
		camera.position.set(30, 30, 40)
	else
		camera.position.set(30, 30, -40)
}
console.log("cookie")
