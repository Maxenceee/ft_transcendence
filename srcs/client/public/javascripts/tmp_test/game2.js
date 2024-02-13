import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';


let socket = new Socket({path: "/socket"});
socket.onconnection(() => {
	console.info("Connection opened, yay");
	socket.send({type: "data"});
});
socket.onclose(() => {
	console.info("Bye bye madafaka");
});



let  callBack = (data) => {
	switch (data.type) {
		case 'playerPos':
			playerMovement(data)
			break
		case 'mapType':
			initScene(data)
			break;
		default :
			console.log("the fuck did you send ? " + data)
		}
}
socket.use((msg) =>{
	console.log(msg);
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
controls.maxDistance = 40
controls.target.set( 0, 0, 0 );
controls.update();


const Alight = new THREE.AmbientLight({color:0xffffff});
scene.add( Alight );


const player1Map = new THREE.TextureLoader().load( "/static/javascripts/img/kitten.jpg" );
const player2Map = new THREE.TextureLoader().load( "/static/javascripts/img/smug_frieren.jpg" );
const ballMap = new THREE.TextureLoader().load( "/static/javascripts/img/fire.jpg" );
const sky = new THREE.TextureLoader().load( "/static/javascripts/img/sky3.jpg" );
const nooo = new THREE.TextureLoader().load( "/static/javascripts/img/no.jpg" );

scene.clear;
function  initScene(data)
{
	switch (data.mapType)
	{
		case 1 :
			initiateMapTwoPlayer(data)
		case 2 :
			initiateMapFourPlayer(data)
		default :
		{
			console.log("the fuck did you send ? " + data)
			initiateMapError();
		}
	}
}
let palletPlayer1 = 0;
let palletPlayer2 = 0;
let palletPlayer3 = 0;
let palletPlayer4 = 0;
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

function initiateMapFourPlayer(data)
{
	/// temporary for dev purpose///
	data.player1Map = player1Map;
	data.player2Map = player2Map;
	/// temporary for dev purpose///
	
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
			// map : player1Map 
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
			// map : player1Map 
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
			// map : player3Map 
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
			// map : player4Map 
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



	const geometryBall = new THREE.SphereGeometry( 1 );
	const materialBall = new THREE.MeshPhysicalMaterial( {
		wireframe:false, 
		color:0xffffff, 
		opacity: 1, 
		iridescence :1,
		side : THREE.DoubleSide,
		map:ballMap});
	ball = new THREE.Mesh( geometryBall, materialBall );



	scene.add(wallLeft, wallRight, wallP1, wallP2, palletPlayer3, palletPlayer4, ball)
	controls.maxDistance = 60
}

function initiateMapError()
{
	const geometryBall = new THREE.SphereGeometry( 1 );
	const materialBall = new THREE.MeshPhysicalMaterial( {
		wireframe:false, 
		color:0xffffff, 
		opacity: 1, 
		iridescence :1,
		side : THREE.DoubleSide,
		map:ballMap});
	ball = new THREE.Mesh( geometryBall, materialBall );
	const errorCube = new THREE.BoxGeometry(10,10,10); 


	const errorCubeMat = new THREE.MeshBasicMaterial( {
		map :nooo
		});
	
	const noCube = new THREE.Mesh(errorCube, errorCubeMat)
	composer = 0
	sceneError.add( noCube )

}

//debuging


// const params = {
// 	threshold: 0.8,
// 	knee: 0.5,
// 	radius: 6.5,
// 	exposure: 0.1,
// 	intensity:0.05,
// 	strength:0.05
// };

const params = {
	threshold: 0,
	strength: 0.5,
	radius: 0,
	exposure: 1
};


const renderScene = new RenderPass( scene, camera );

// const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
// bloomPass.threshold = params.threshold;
// bloomPass.strength = params.strength;
// bloomPass.radius = params.radius;
// bloomPass.knee = params.knee;
// // bloomPass.intensity = params.intensity;
// bloomPass.exposure = params.exposure;
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

	
const planeGeo = new THREE.PlaneGeometry(50, 50); 



const outputPass = new OutputPass();
const groundReflectorForSSRPass = new ReflectorForSSRPass(
	planeGeo, {
		clipBias:0.003,
		textureWidth:window.innerWidth,
		textureHeight:window.innerHeight,
		color : 0x888888,
		useDepthTexture:true
	});
groundReflectorForSSRPass.material.depthWrite=false;
groundReflectorForSSRPass.rotation.x = -Math.PI/2
groundReflectorForSSRPass.position.x = -2;
groundReflectorForSSRPass.visible = false;
groundReflectorForSSRPass
scene.add(groundReflectorForSSRPass);
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

const planeGeoGround = new THREE.PlaneGeometry(100, 100); 


const materialPlaneGround = new THREE.MeshStandardMaterial( {
	wireframe:false, 
	color:0x000000, 
	opacity: 1, 
	roughness :0,
	// iridescence :1,
	// emissive:0x000000,
	side : THREE.DoubleSide,
	});

const groundReflection = new THREE.Mesh(planeGeoGround, materialPlaneGround)
groundReflection.rotation.x = Math.PI/180*-90;
groundReflection.position.y -= 2;
scene.add(groundReflection)




let moveSpeed = 1.05



// initiateMapFourPlayer({})
// initiateMapError({})
initiateMapTwoPlayer({})
//serverside under it
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;

	if (keyCode == 68) 
		palletPlayer1.position.x += mapWidth/60 ;
	else if (keyCode == 65)
		palletPlayer1.position.x-= mapWidth/60 ;
	if (keyCode == 39) 
		palletPlayer2.position.x -= mapWidth/60 ;
	if (keyCode == 37) 
		palletPlayer2.position.x += mapWidth/60 ;


    if (palletPlayer3 != 0)
	{
	if (keyCode == 81) 
		palletPlayer3.position.z += mapWidth/60 ;
	else if (keyCode == 69) 
		palletPlayer3.position.z-= mapWidth/60  ;
	if (keyCode == 90) 
		palletPlayer4.position.z -= mapWidth/60 ;
	else if (keyCode == 67) 
		palletPlayer4.position.z += mapWidth/60 ;
	}
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

let score = {
	scoreP1: 0,
	scoreP2: 0,
	scoreP3: 0,
	scoreP4: 0,
};

function wallCollideFourPlayer(){
	let hit = false
	if (ball.position.x < -mapWidth/2 + 1 )
	{
		moveSpeed += 0.05
		score.scoreP1++
		console.log("score P1 : "+score.scoreP1)
		resetBall()
		// ballDirection.x *= -1;
		hit = true
	}

	else if (ball.position.x > mapWidth/2 - 1)
	{
		moveSpeed += 0.05
		score.scoreP2++
		console.log("score P2 : "+score.scoreP2)
		resetBall()
		// ballDirection.z *= -1;
		hit = true
	}

	if (ball.position.z < -mapLenth/2 + 1)
	{
		moveSpeed += 0.05 
		score.scoreP4++
		console.log("score P4 : "+score.scoreP4)
		resetBall()
		// ballDirection.z *= -1;
		hit = true
	}

	else if (ball.position.z > mapLenth/2 - 1)
	{
		moveSpeed += 0.05
		score.scoreP3++
		console.log("score P3 : "+score.scoreP3)
		resetBall()
		// ballDirection.z*= -1;
		hit = true
	}
	if (hit)
		{
			ballDirection.z = THREE.MathUtils.randFloat(-1, 1)
			ballDirection.x = THREE.MathUtils.randFloat(-1, 1)
		}
	if (moveSpeed > 5)
		moveSpeed = 5
};

function wallCollideTwoPlayer(){
	if (ball.position.x < -mapWidth/2 + 1 )
			ballDirection.x *= -1;
	else if (ball.position.x > mapWidth/2 - 1)
		ballDirection.x *= -1;
	if (ball.position.z < -mapLenth/2 + 1)
	{

		score.scoreP2++
		console.log("score P2 : "+score.scoreP2)
		resetBall()
			
	}
	else if (ball.position.z > mapLenth/2 - 1)
	{
		score.scoreP1++
		console.log("score P1 : "+score.scoreP1)
		resetBall()
		ballDirection.z *= -1;
	}
	if (moveSpeed > 5)
		moveSpeed = 5
};

function palletReboundP1(){
	if (ball.position.x < -palletPlayer1.x + 3 )
	{
			ballDirection.x *= -1;
			moveSpeed += 0.05
	}
	else if (ball.position.x > mapWidth/2 - 0.5)
	{
		ballDirection.x *= -1;
		moveSpeed += 0.05
	}
	if (moveSpeed > 5)
		moveSpeed = 5
};
//server side above

function ballRotate()
{
	// ball.rotation.z +=  ballDirection.z
	ball.rotation.x +=  .1
	// ball.rotation.y += 0.1
}

if (palletPlayer1 != 0)
	scene.add(palletPlayer1, palletPlayer2)

function animate() {
	if (palletPlayer3!=0)
		wallCollideFourPlayer()
	else 
		wallCollideTwoPlayer()
	requestAnimationFrame(animate)
	ballRotate();
    controls.update()
	if (composer){
		renderer.render( scene, camera );
		composer.render();	
	}
	else
		renderer.render( sceneError, camera );
	ball.position.x +=( ballDirection.x ) * 0.3 * moveSpeed 
	ball.position.z +=( ballDirection.z ) * 0.3 * moveSpeed 

}
animate();
console.log("cookie")
// socket.send({type: "mapType", mapType :1})


