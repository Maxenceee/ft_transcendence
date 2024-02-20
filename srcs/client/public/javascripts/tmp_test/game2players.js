import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
// import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
// import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';



let socket = new Socket({path: "/socket"});
socket.onconnection(() => {
	console.info("Connection opened, yay");
});
socket.onclose(() => {
	console.info("Bye bye madafaka");
});

socket.use((msg) =>{
	// console.log(msg);
	if (msg.number < data.number)
		;
	else
	{
		data=msg
		score = msg.score
		keyCode = data.keyCode
	}
		// console.log(data);
	// if (msg.type == 2)
		// ball.position.z = msg.data
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
controls.maxDistance = 50
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
let mapLenth
let mapWidth
function initiateMapTwoPlayer(data)
{
	/// temporary for dev purpose///
	data.player1Map = player1Map;
	data.player2Map = player2Map;
	/// temporary for dev purpose///
	
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
			// map : player1Map 
			})
		);
//  ///add helper to see axe)
// 							const repaire = new THREE.Mesh( 
// 								new THREE.BoxGeometry( 2,2,2 ), 
// 								new THREE.MeshStandardMaterial( {
// 									wireframe:false, 
// 									color:0xffffff, 
// 									opacity: 1, 
// 									emissive:0xffffff,
// 									side : THREE.DoubleSide,
// 									// map : player1Map 
// 									})
// 								);
// 							repaire.position.z +=2
// 							const repaire1 = new THREE.Mesh( 
// 								new THREE.BoxGeometry( 2,2,2 ), 
// 								new THREE.MeshStandardMaterial( {
// 									wireframe:false, 
// 									color:0xffff00, 
// 									opacity: 1, 
// 									emissive:0xffff00,
// 									side : THREE.DoubleSide,
// 									// map : player1Map 
// 									})
// 								);

// 							const repaire2 = new THREE.Mesh( 
// 								new THREE.BoxGeometry( 2,2,2 ), 
// 								new THREE.MeshStandardMaterial( {
// 									wireframe:false, 
// 									color:0x00ff00, 
// 									opacity: 1, 
// 									emissive:0x00ff00,
// 									side : THREE.DoubleSide,
// 									// map : player1Map 
// 									})
// 								);
// 								repaire2.position.x +=2
								// scene.add( repaire, repaire1, repaire2);
//// end of the helper
	palletPlayer2 = new THREE.Mesh( 
		new THREE.BoxGeometry( 6, 1, 1 ), 
		new THREE.MeshStandardMaterial( {
			wireframe:false, 
			color:0xffffff, 
			opacity: 1, 
			emissive:0xffffff,
			side : THREE.DoubleSide,
			// map : player2Map
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

	const geometryBall = new THREE.SphereGeometry( 1 );
	const materialBall = new THREE.MeshPhysicalMaterial( {
		wireframe:false, 
		color:0xffffff, 
		opacity: 1, 
		iridescence :1,
		side : THREE.DoubleSide,
		map:ballMap});
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
// const groundReflectorForSSRPass = new ReflectorForSSRPass(
// 	planeGeo, {
// 		clipBias:0.003,
// 		textureWidth:window.innerWidth,
// 		textureHeight:window.innerHeight,
// 		color : 0x888888,
// 		useDepthTexture:true
// 	});
// groundReflectorForSSRPass.material.depthWrite=false;
// groundReflectorForSSRPass.rotation.x = -Math.PI/2
// groundReflectorForSSRPass.position.x = -2;
// groundReflectorForSSRPass.visible = false;
// groundReflectorForSSRPass
// scene.add(groundReflectorForSSRPass);
// const outputSSRPass = new SSRPass(
// {
// 	scene,
// 	camera,
// 	width:innerWidth,
// 	height:innerHeight,
// 	groundReflector:params.groundReflector ? groundReflector : null,
// 	selects:params.groundReflector ? selects : null
// });

let composer
composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );
// composer.addPass(outputSSRPass)


//end_of_debuging
// let composer;
// composer = setRender();

// const planeGeoGround = new THREE.PlaneGeometry(100, 100); 


// const materialPlaneGround = new THREE.MeshStandardMaterial( {
// 	wireframe:false, 
// 	color:0x000000, 
// 	opacity: 1, 
// 	roughness :0,
// 	// iridescence :1,
// 	// emissive:0x000000,
// 	side : THREE.DoubleSide,
// 	});

// const groundReflection = new THREE.Mesh(planeGeoGround, materialPlaneGround)
// groundReflection.rotation.x = Math.PI/180*-90;
// groundReflection.position.y -= 2;
// scene.add(groundReflection)




let moveSpeed = 1.05


// initiateMapFourPlayer({})
// initiateMapError({})
initiateMapTwoPlayer({})
//serverside under it
// document.addEventListener("keyup", onDocumentKeyUp, false);
var updatePlayer = 0;
document.addEventListener("keydown", onDocumentKeyDown, true);
// document.addEventListener("keydown", onDocumentKeyDown, false);
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
	if (keyVar == 68) 
		palletPlayer1.position.x += mapWidth/60 ;
	else if (keyVar == 65)
		palletPlayer1.position.x-= mapWidth/60 ;
	if (keyVar == 39) 
		palletPlayer2.position.x -= mapWidth/60 ;
	if (keyVar == 37) 
		palletPlayer2.position.x += mapWidth/60 ;
	data.P1position = palletPlayer1.position ;
	data.P2position = palletPlayer2.position ;
	data.keyCode = keyCode
	updatePlayer = 1;
	// socket.send({type:2, data})
	// palletPlayer1.position.x = data.P1position.x ;
	// palletPlayer2.position.x = data.P2position.x ;
	// console.log(keyCode);
	console.log(keyCode);
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

// function wallCollideTwoPlayer(){
// 	if (ball.position.x < -mapWidth/2 + 1 )
// 			data.ballDirection.x *= -1;
// 	else if (ball.position.x > mapWidth/2 - 1)
// 			data.ballDirection.x *= -1;

// 	if (ball.position.z < -mapLenth/2 + 1)
// 	{
// 		console.log("score P2 : "+data.score.scoreP2)
// 		resetBall()	
// 		data.score.scoreP2++
// 		data.ballDirection.z *= -1;
// 		createText(data.score.scoreP2 + " : " + data.score.scoreP1)	
// 	}
// 	else if (ball.position.z > mapLenth/2 - 1)
// 	{
// 		data.score.scoreP1++
// 		console.log("score P1 : "+data.score.scoreP1)
// 		resetBall()
// 		data.ballDirection.z *= -1;
// 		createText(data.score.scoreP2 + " : " + data.score.scoreP1)	
// 	}
// 	if (moveSpeed > 5)
// 		moveSpeed = 5
// 	ballDirection = data.ballDirection
// };

// function palletReboundP1(){
// 	if (ball.position.z > mapLenth/2 - 2 && (ball.position.x < (palletPlayer1.position.x + 4) && ball.position.x > (palletPlayer1.position.x - 4)) )
// 	{
// 		data.ballDirection.z *= -1;
// 		moveSpeed += 0.05
// 	}
// 	if (moveSpeed > 5)
// 		moveSpeed = 5
// };
// function palletReboundP2(){
// 	if (ball.position.z < -mapLenth/2 + 2 && (ball.position.x < (palletPlayer2.position.x + 4) && ball.position.x > (palletPlayer2.position.x - 4)) )
// 	{
// 		data.ballDirection.z *= -1;
// 		moveSpeed += 0.05
// 	}
// 	if (moveSpeed > 5)
// 		moveSpeed = 5
// };
//server side above

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

let data = {
	number : 0,
	ball : ball.position,
	ballDirection : ballDirection,
	ballSpin : ball.rotation,
	P1position : palletPlayer1.position,
	P2position : palletPlayer2.position,
	score : score,
	keyCode : keyCode,
	moveSpeed : moveSpeed,
	updateScore : 0
};
socket.send({type : 0, data : data})
loadFont()
let counter = 0
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
	if (score.scoreP1 > 9 || score.scoreP2 > 9 || score.scoreP3 > 9 || score.scoreP4 > 9)
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
	// palletReboundP1()
	// palletReboundP2()
	// wallCollideTwoPlayer()
	if (data.number > counter)
	{
		if (data.updateScore == 1)
			createText(data.score.scoreP2 + " : " + data.score.scoreP1)
		ball.rotation.x +=  .1
		ball.position.x = data.ball.x
		ball.position.z = data.ball.z
		palletPlayer1.position.x = data.P1position.x ;
		palletPlayer2.position.x = data.P2position.x ;
		// keyCode = data.keyCode ;
		counter = data.number
	}
	await sleep(25)
	
}


const tmp = async () => {
	while ( true )
	{
		socket.send({type : 0, data:data})	
		await sleep(50)
	}

}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
sleep(500).then(() => {animate(); });
tmp()
// animate()
console.log("cookie")
// socket.send({type: "mapType", mapType :1})

document.addEventListener('blur', function() {
	console.log("window is blured");
});

document.addEventListener('focus', function() {
	console.log("window if focused");
});