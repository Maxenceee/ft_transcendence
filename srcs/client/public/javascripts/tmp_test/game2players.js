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
	data=msg
	score = msg.score
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

let font, textGeo, materials,textMesh2

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
 ///add helper to see axe)
							const repaire = new THREE.Mesh( 
								new THREE.BoxGeometry( 2,2,2 ), 
								new THREE.MeshStandardMaterial( {
									wireframe:false, 
									color:0xffffff, 
									opacity: 1, 
									emissive:0xffffff,
									side : THREE.DoubleSide,
									// map : player1Map 
									})
								);
							repaire.position.z +=2
							const repaire1 = new THREE.Mesh( 
								new THREE.BoxGeometry( 2,2,2 ), 
								new THREE.MeshStandardMaterial( {
									wireframe:false, 
									color:0xffff00, 
									opacity: 1, 
									emissive:0xffff00,
									side : THREE.DoubleSide,
									// map : player1Map 
									})
								);

							const repaire2 = new THREE.Mesh( 
								new THREE.BoxGeometry( 2,2,2 ), 
								new THREE.MeshStandardMaterial( {
									wireframe:false, 
									color:0x00ff00, 
									opacity: 1, 
									emissive:0x00ff00,
									side : THREE.DoubleSide,
									// map : player1Map 
									})
								);
								repaire2.position.x +=2
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
document.addEventListener("keyup", onDocumentKeyUp, true);

document.addEventListener("keydown", onDocumentKeyDown, true);
// document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    let keyVar = event.which;

	if (keyVar == 68)
		keyCode.Key68 = 1
	if (keyVar == 65)
		keyCode.Key65 = 1
	if (keyVar == 39)
		keyCode.Key39 = 1
	if (keyVar == 37)
		keyCode.Key37 = 1
	data.keyCode = keyCode
	
	socket.send({type:2, data})
	palletPlayer1.position.x = data.P1position.x ;
	palletPlayer2.position.x = data.P2position.x ;
	// console.log(keyCode);
}
function onDocumentKeyUp(event) {
    let keyVar = event.which;


	if (keyVar == 68)
		keyCode.Key68 = 0
	if (keyVar == 65)
		keyCode.Key65 = 0
	if (keyVar == 39)
		keyCode.Key39 = 0
	if (keyVar == 37)
		keyCode.Key37 = 0

	data.keyCode = keyCode
	
	socket.send({type:2, data})
	palletPlayer1.position.x = data.P1position.x ;
	palletPlayer2.position.x = data.P2position.x ;
	console.log(keyCode);
}

function resetBall()
{
	ball.position.z = 0
	ball.position.x = 0
	ball.position.y = 0
	moveSpeed = 1.05
	ballDirection.x = THREE.MathUtils.randFloat(-1, 1);
	ballDirection.z = 1;
}

let ballDirection = {
	x : 0.5 + Math.random(),
	z : 0.5 + Math.random(),
};

function wallCollideTwoPlayer(){
	if (ball.position.x < -mapWidth/2 + 1 )
			ballDirection.x *= -1;
	else if (ball.position.x > mapWidth/2 - 1)
		ballDirection.x *= -1;

	if (ball.position.z < -mapLenth/2 + 1)
	{
		data.score.scoreP2++
		console.log("score P2 : "+data.score.scoreP2)
		resetBall()	
		createText(data.score.scoreP2 + " : " + data.score.scoreP1)	
		socket.send({type : 0, data:data})
	}
	else if (ball.position.z > mapLenth/2 - 1)
	{
		data.score.scoreP1++
		console.log("score P1 : "+data.score.scoreP1)
		resetBall()
		ballDirection.z *= -1;
		createText(data.score.scoreP2 + " : " + data.score.scoreP1)
		socket.send({type : 0, data:data})
	}
	if (moveSpeed > 5)
		moveSpeed = 5
};

function palletReboundP1(){
	if (ball.position.z > mapLenth/2 - 2 && (ball.position.x < (palletPlayer1.position.x + 3) && ball.position.x > (palletPlayer1.position.x - 3)) )
	{
		ballDirection.z *= -1;
		moveSpeed += 0.05
	}
	if (moveSpeed > 5)
		moveSpeed = 5
};
function palletReboundP2(){
	if (ball.position.z < -mapLenth/2 + 2 && (ball.position.x < (palletPlayer2.position.x + 3) && ball.position.x > (palletPlayer2.position.x - 3)) )
	{
		ballDirection.z *= -1;
		moveSpeed += 0.05
	}
	if (moveSpeed > 5)
		moveSpeed = 5
};
//server side above


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
	materials = [
	new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
	new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
	];
	textMesh2 = new THREE.Mesh( textGeo, materials)
	textMesh2.rotateX(-Math.PI * 0.5);
	textMesh2.rotateZ(Math.PI * 0.5);
	textMesh2.position.z += 12.5;
	textMesh2.position.x += 2.5;
	textMesh2.position.y -= 2;
	
	scene.add(textMesh2);

}
var keyCode = {
	Key68 : 0,
	Key65 : 0,
	Key39 : 0,
	Key37 : 0,
}

let data = {
	ball : ball.position,
	ballSpin : ball.rotation,
	P1position : palletPlayer1.position,
	P2position : palletPlayer2.position,
	score : score,
	keyCode : keyCode,
	moveSpeed : moveSpeed,
};
socket.send({type : 0, data : data})
loadFont()
function animate() {
	controls.update()
	requestAnimationFrame(animate)
	if (composer){
		renderer.render( scene, camera );
		composer.render();	
	}
	else
		renderer.render( sceneError, camera );
	if (score.scoreP1 > 9 || score.scoreP2 > 9 || score.scoreP3 > 9 || score.scoreP4 > 9)
	{
		scene.remove(ball);
		return;
	}
	palletReboundP1()
	palletReboundP2()
	wallCollideTwoPlayer()
	ball.rotation.x +=  .1
	ball.position.x +=( ballDirection.x ) * 0.3 * moveSpeed 
	ball.position.z +=( ballDirection.z ) * 0.3 * moveSpeed 

}
animate();
console.log("cookie")
// socket.send({type: "mapType", mapType :1})


