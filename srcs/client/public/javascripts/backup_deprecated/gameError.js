import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
// import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
// import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';



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
camera.position.set( 15, 15, 20 );

const controls = new OrbitControls( camera, renderer.domElement );
const scene = new THREE.Scene();
const sceneError = new THREE.Scene
controls.maxDistance = 50
controls.target.set( 0, 0, 0 );
controls.update();


const Alight = new THREE.AmbientLight({color:0xffffff});
scene.add( Alight );

const ballMap = new THREE.TextureLoader().load( "/static/javascripts/img/fire.jpg" );
const nooo = new THREE.TextureLoader().load( "/static/javascripts/img/no.jpg" );

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
		map :nooo, 
		// side : THREE.BackSide,
		});
	
	const noCube = new THREE.Mesh(errorCube, errorCubeMat)
	composer = 0
	sceneError.add( noCube )

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





// initiateMapFourPlayer({})
initiateMapError({})
// initiateMapTwoPlayer({})
//serverside under it





// if (palletPlayer1 != 0)
// 	scene.add(palletPlayer1, palletPlayer2)



// loadFont()
function animate() {
	controls.update()
	requestAnimationFrame(animate)
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


