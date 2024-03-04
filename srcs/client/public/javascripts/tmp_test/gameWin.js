import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';



let socket = new Socket({path: "/socket"});
socket.onconnection(() => {
	console.info("Connection opened, yay");
	socket.send({type: "data"});
});
socket.onclose(() => {
	console.info("Bye bye madafaka");
});

socket.use((msg) =>{
	console.log(msg);
});

let ball;


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setPixelRatio( window.devicePixelRatio );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 200 );
camera.position.set( 0, 15, 45 );

const controls = new OrbitControls( camera, renderer.domElement );
const scene = new THREE.Scene();
const sceneError = new THREE.Scene
controls.maxDistance = 50
controls.target.set( 0, 0, 0 );
controls.update();


const Alight = new THREE.AmbientLight({color:0xffffff});
// scene.add( Alight );

const ballMap = new THREE.TextureLoader().load( "/static/javascripts/img/fire.jpg" );
const nooo = new THREE.TextureLoader().load( "/static/javascripts/img/no.jpg" );

function initiateMapError()
{
	const geometryBall = new THREE.SphereGeometry( 5.2 );
	const materialBall = new THREE.MeshPhysicalMaterial( {
		wireframe:false, 
		color:0xffffff, 
		opacity: 1, 
		iridescence :1,
		emissive : 0xffffff,
		side : THREE.DoubleSide,
		map:ballMap});
	ball = new THREE.Mesh( geometryBall, materialBall );
	const errorCube = new THREE.BoxGeometry(10,10,10); 


	const errorCubeMat = new THREE.MeshBasicMaterial( {
		map :nooo,
		// emissive : 0xffffff
		});
	
	const noCube = new THREE.Mesh(errorCube, errorCubeMat)
	composer = 0
	sceneError.add( ball , noCube)

}

//debuging
const params = {
	threshold: 0.8,
	knee: 0.5,
	radius: 6.5,
	exposure: 0.1,
	intensity:0.05,
	strength:0.05
};

const renderScene = new RenderPass( scene, camera );

	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = params.threshold;
	bloomPass.strength = params.strength;
	bloomPass.radius = params.radius;
	bloomPass.knee = params.knee;
	// bloomPass.intensity = params.intensity;
	bloomPass.exposure = params.exposure;

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
		groundReflectorForSSRPass.visible = false;
		scene.add(groundReflectorForSSRPass);

		
		

		const geometryCube = new THREE.SphereGeometry( 2 );
		const geometryPlane = new THREE.PlaneGeometry( 50, 50 );

		const materialCube = new THREE.MeshStandardMaterial( {
			wireframe:false, 
			color:0xffffff, 
			opacity: 1, 
			// iridescence :1,
			emissive:0xffffff,
			side : THREE.DoubleSide,
			});
		const materialPlane = new THREE.MeshStandardMaterial( {
			wireframe:false, 
			color:0xffffff, 
			opacity: 1, 
			// iridescence :1,
			emissive:0x000000,
			side : THREE.DoubleSide,
			});
		
			const plane = new THREE.Mesh(geometryPlane, materialPlane)
		plane.rotation.x = Math.PI/180*-90
		const cube = new THREE.Mesh( geometryCube, materialCube );

		cube.position.y +=3;
		scene.add(plane);
let render
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const outputSSRPass = new SSRPass(
{

	render, 
	scene,
	camera,
	width:innerWidth,
	height:innerHeight,
	groundReflector:params.groundReflector ? groundReflector : null,
	selects:params.groundReflector ? selects : null
});

let composer
composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );
composer.addPass(outputSSRPass)

let mapLenth = 40
let mapWidth = 60
let font, textGeo, textMesh2
let materials = new THREE.MeshPhysicalMaterial( {
	wireframe:false, 
	color:0xffffff, 
	opacity: 1, 
	iridescence :1,
	emissive : 0xffffff,
	side : THREE.DoubleSide,
	map:ballMap}); 
function createText(msg) {

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
	textMesh2.position.y += 2
	textMesh2.position.z += 6
	textMesh2.position.x -= 15

	scene.add(textMesh2);
}
const loader = new FontLoader();
function loadFont() {

	loader.load( '/static/javascripts/font.json', function ( response ) {

		font = response;

		createText("WIN");

	} );
}

// function createTextObject(msg) {
// 	let textObj

// 	textGeo = new TextGeometry( msg , {

// 		font: font,

// 		size: 10,
// 		height: 0.5,
// 		curveSegments: 2,

// 		bevelThickness: 0.1,
// 		bevelSize: 0.01,
// 		bevelEnabled: true

// 	} );
// 	textObj = new THREE.Mesh( textGeo, materials)

// 	return textObj;
// }

function initiateMapTwoPlayer(data)
{
	/// temporary for dev purpose///
	// data.player1Map = player1Map;
	// data.player2Map = player2Map;
	/// temporary for dev purpose///
	
	mapLenth = 60;
	mapWidth = 40;
	const geometryBall = new THREE.SphereGeometry( 1 );
	const materialBall = new THREE.MeshPhysicalMaterial( {
		wireframe:false, 
		color:0xffffff, 
		opacity: 1, 
		iridescence :1,
		side : THREE.DoubleSide,
		map:ballMap});
	ball = new THREE.Mesh( geometryBall, materialBall );
	// let ball2 = new THREE.Mesh( geometryBall, materialBall );
	// ball2.position.x += 2
	// scene.add( ball, ball2)
}


// initiateMapFourPlayer({})
// initiateMapError({})
initiateMapTwoPlayer({})
//serverside under it





// if (palletPlayer1 != 0)
// 	scene.add(palletPlayer1, palletPlayer2)



loadFont()
let y = 0
function animate() {
	controls.update()
	requestAnimationFrame(animate)
	if (y != 0)
	{
		y++
		createText(""+"Win" + "")	
	}
	if (composer){
		renderer.render( scene, camera );
		composer.render();	
	}
	else
		renderer.render( sceneError, camera );

}
animate();
console.log("cookie")
// socket.send({type: "mapType", mapType :1})


