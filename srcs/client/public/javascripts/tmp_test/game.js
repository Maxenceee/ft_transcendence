
// import * as THREE from 'three';
// import { randInt } from './node_modules/three/src/math/MathUtils.js';
// import * as THREE from './node_modules/three/build/three.module.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';
// import { TextureLoader } from 'three/addons/lights/SpotLight.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//
renderer.setPixelRatio( window.devicePixelRatio );
//


var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
camera.position.set( 15, 15, 20 );


const controls = new OrbitControls( camera, renderer.domElement );
const scene = new THREE.Scene();
controls.target.set( 0, 0, 20 );
controls.update();
// camera.position.z = 5;






// light.position.set( );
// light.shadow.mapSize.width = 512; // default
// light.shadow.mapSize.height = 512; // default
// light.shadow.camera.near = 0.5; // default
// light.shadow.camera.far = 500; // default
// scene.add( light );

const Alight = new THREE.AmbientLight({color:0xffffff});
scene.add( Alight );
// const helper = new THREE.DirectionalLightHelper( light, 5 );
// scene.add( helper );
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
const kitten = new THREE.TextureLoader().load( "/static/javascripts/tmp_test/kitten.jpg" );
const frieren = new THREE.TextureLoader().load( "/static/javascripts/tmp_test/smug_frieren.jpg" );
const fire = new THREE.TextureLoader().load( "/static/javascripts/tmp_test/fire.jpg" );
const sky = new THREE.TextureLoader().load( "/static/javascripts/tmp_test/sky3.jpg" );


// frieren.
// sky.wrapS = THREE.RepeatWrapping;
// sky.wrapT = THREE.RepeatWrapping;
// sky.repeat.set( 2, 2 );
const geometryPlane = new THREE.PlaneGeometry( 50, 50 );
const materialPlane = new THREE.MeshPhysicalMaterial( 	{wireframe:false ,color: 0xff00ff, side: THREE.DoubleSide, opacity:0.1, transparent : true} );
// const materialPlane2 = new THREE.MeshPhysicalMaterial( 	{wireframe:false ,color: 0xff0000, side: THREE.DoubleSide, opacity:0.1, transparent : true} );
const materialPalette2 = new THREE.MeshPhysicalMaterial( {wireframe:false, wireframeLinewidth: 10, side: THREE.DoubleSide, opacity:1, transparent : true, map:frieren} );
// const geometryPlane = new THREE.Plane({normal:(30, 30, 30)})
const plane = new THREE.Mesh( geometryPlane, materialPlane );
// const tmp = new THREE.BoxGeometry( 30, 30, 1 )
const tmp2 = new THREE.BoxGeometry( 6, 6, 1 )
// const plane2 = new THREE.Mesh( geometryPlane, materialPlane2 );
// const plane3 = new THREE.Mesh( geometryPlane, materialPlane2 );
// const plane4 = new THREE.Mesh( geometryPlane, materialPlane2 );
// const plane5 = new THREE.Mesh( geometryPlane, materialPlane2 );
// const plane6 = new THREE.Mesh( geometryPlane, materialPlane2 );
const Pallet = new THREE.Mesh( tmp2, materialPalette2 );
const Pallet2 = new THREE.Mesh( tmp2, materialPalette2 );
// plane2.position.z += 40

Pallet.position.z += 39.5
Pallet2.position.z += 0.5

// plane3.position.z += 20
// plane3.position.x += 20
// plane3.rotation.x = Math.PI/180*-90
// plane3.rotation.y = Math.PI/180*-90

// plane4.position.z += 20
// plane4.position.x -= 20
// plane4.rotation.x = Math.PI/180*-90
// plane4.rotation.y = Math.PI/180*-90

// plane5.position.z += 20
// plane5.position.y -= 20
// plane5.rotation.x = Math.PI/180*-90

// plane6.position.z += 20
// plane6.position.y += 20
// plane6.rotation.x = Math.PI/180*-90
// plane5.rotation.y = Math.PI/180*-90
// const planeBox = plane.geometry.boundingBox.containsBox();
// scene.add( plane , plane2,  plane3, plane4, plane5, plane6);
scene.add( Pallet, Pallet2);
//  IntersectionObserver()

const geometrySphere = new THREE.SphereGeometry( 5 );
const materialSphere = new THREE.MeshPhysicalMaterial( {
	wireframe:true, 
	color:0xffffff, 
	opacity: 1, 
	iridescence :1,
	map:frieren});
	
const geometryCube = new THREE.SphereGeometry( 5 );


// var cube = new THREE.Object3D;


// try to add a skybox

// const skyboxGeo = new THREE.SphereGeometry(500);

// const skyboxTex = new THREE.MeshBasicMaterial({map:sky, side: THREE.BackSide})
// const skybox = new THREE.Mesh(skyboxGeo, skyboxTex);
// scene.add(skybox);

// 
//post processing
// const test = new EffectComposer(UnrealBloomPass,FilmPass)
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
		groundReflectorForSSRPass.position.x = 10;
		groundReflectorForSSRPass.visible = false;
		scene.add(groundReflectorForSSRPass);
const outputSSRPass = new SSRPass(
{

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





// const planeGeo9 = new THREE.PlaneGeometry(50, 50); 


// 		const materialPlane3 = new THREE.MeshStandardMaterial( {
// 			wireframe:false, 
// 			color:0xffffff, 
// 			opacity: 1, 
// 			// iridescence :1,
// 			emissive:0x000000,
// 			side : THREE.DoubleSide,
// 			});
		
// 		const plane9 = new THREE.Mesh(planeGeo9, materialPlane3)
// 		plane9.rotation.x = Math.PI/180*-90;
// 		plane9.position.x -= 10;
// 		// scene.add(plane9)



// new GLTFLoader().load( 'models/gltf/PrimaryIonDrive.glb', function ( gltf ) {

// 		const model = gltf.scene;

// 		scene.add( model );

// 		mixer = new THREE.AnimationMixer( model );
// 		const clip = gltf.animations[ 0 ];
// 		mixer.clipAction( clip.optimize() ).play();

// 		animate();

// 	} );


// end of post pros

// const materialCube = new THREE.MeshBasicMaterial( {wireframe:true}, {texture:texture});
// const materialCube = new THREE.MeshBasicMaterial( {wireframe:false, map: frieren});
const materialCube = new THREE.MeshPhysicalMaterial( {
	wireframe:false, 
	color:0xffffff, 
	opacity: 1, 
	iridescence :1,
	side : THREE.DoubleSide,
	map:fire});
	// const materialCube = new THREE.MeshDepthMateria 	l({wireframe:false});
	
const cube = new THREE.Mesh( geometryCube, materialCube );
const geometryCube2 = new THREE.SphereGeometry( 30 );
const materialSphere2 = new THREE.MeshPhysicalMaterial( {
	wireframe:false, 
	color:0xffffff, 
	opacity: 1, 
	iridescence :1,
	side : THREE.BackSide,
	map:sky});
const cube2 = new THREE.Mesh( geometryCube2, materialSphere2 );

const sphere = new THREE.Mesh( geometrySphere, materialSphere );
cube2.position.z += 20;
cube.position.z = 20;
scene.add( cube, cube2);


// const light = new THREE.RectAreaLight( 0xffffff, 1, 30, 30);


// var directionZ = -1
// var directionBall.directionX = -1
// var directionBall.directionY = -1
const speedRotate =0.01


var directionBall = {
	directionZ : -1,
	directionX : -1,
	directionY : -1,
	speedBall : 0.2
}

// function rebound(){
// 	// var ballBox = new THREE.Box3().setFromObject(cube);
// 	// var wallFront = new THREE.Box3().setFromObject(plane3);
// 	// var wallBack = new THREE.Box3().setFromObject(plane4);
// 	// var wallDown = new THREE.Box3().setFromObject(plane5);
// 	// var wallUp = new THREE.Box3().setFromObject(plane6);
// 	// if (ballBox.intersectsBox(wallBack))
// 	if  ( cube.position.y < -17.5)
// 	{
// 		// directionBall.directionY *= -1;
// 		directionBall.directionY = 1;
// 		speedBall *= 1.1;
// 	}
// 	// else if (ballBox.intersectsBox(wallFront))
// 	else if  ( cube.position.y > 17.5)
// 	{
// 		// directionBall.directionY *= -1;
// 		directionBall.directionY = -1;
// 		speedBall *= 1.1;
// 	}
// 	// if (ballBox.intersectsBox(wallUp))
// 	if  ( cube.position.x > 17.5)
// 	{
// 		// directionBall.directionX *= -1;
// 		directionBall.directionX = -1;
// 		speedBall *= 1.1;
// 	}
// 	// else if  ( ballBox.intersectsBox(wallDown))
// 	else if  ( cube.position.x < -17.5)
// 	{
// 		// directionBall.directionX *= -1;
// 		directionBall.directionX = 1;
// 		speedBall *= 1.1;
// 	}

// }

let data = {
	positionP1 : {
		z : 0,
		x : 0,
		y : 0,
	},
	positionP2 : {
		z : 0,
		x : 0,
		y : 0,
	},
	directionBall :  {
		directionZ : -1,
		directionX : -1,
		directionY : -1,
		speedBall : 0.2
	}
}

let getData = function() {
	return(data);
}

// socket.use(functionToCall);
let rebound = function(position, directionBall) {

	if  ( position.x > 17.5)
	{
		directionBall.directionX = -1;
		directionBall.speedBall *= 1.1;
	}
	else if  ( position.x < -17.5)
	{
		directionBall.directionX = 1;
		directionBall.speedBall *= 1.1;
	}
	if  ( position.x > 17.5)
	{
		directionBall.directionY = -1;
		directionBall.speedBall *= 1.1;
	}
	else if  ( position.x < -17.5)
	{
		directionBall.directionY = 1;
		directionBall.speedBall *= 1.1;
	}
	data.directionBall = directionBall
	return directionBall
}


let scorePoint = function(position, directionBall) {

}

let keyDownP1 = function(keyCode, position) {
	if (keyCode == 87) 
		position.y += 0.3;
	else if (keyCode == 83) 
		position.y-=0.3;
	else if (keyCode == 68) 
		position.x -=0.3;
	else if (keyCode == 65) 
		position.x += 0.3;
	data.positionP1.x = position.x;
	data.positionP1.y = position.y;
	data.positionP1.z = position.z;
	return position
}

let keyDownP2 = function(keyCode, position) {
	if (keyCode == 39) 
		position.x -=0.3;
	else if (keyCode == 37) 
		position.x +=0.3;
	else if (keyCode == 40) 
		position.y -=0.3;
	else if (keyCode == 38)
		position.y +=0.3;
	data.positionP2.x = position.x;
	data.positionP2.y = position.y;
	data.positionP2.z = position.z;
	return data.positionP2
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;

	if (keyCode == 82) {
		cube.position.z = 20.0;
	}
	// try {
		console.log("send",  Pallet.position)
		let pos = keyDownP1(keyCode, Pallet.position);
		Pallet.position.set(pos)
		console.log("return ", Pallet.position, pos)
		// data.positionP1=Pallet.position
		socket.send(data);
	// } catch (error) {
	// }
	try {
		// socket.send({type: "P2"});
		// Pallet2.position = keyDownP2(keyCode, Pallet2.position)
	} catch (error) {
		// 
	}
	// console.log(keyCode)
};

// const loader = new FontLoader();

// loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

// 	const text = new TextGeometry( 'Hello three.js!', {
// 		font: font,
// 		size: 80,
// 		height: 5,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 10,
// 		bevelSize: 8,
// 		bevelOffset: 0,
// 		bevelSegments: 5
// 	} );
// 	scene.add(text)
// } );

// cube.geometry = new THREE.BoxGeometry();
var hit = false;
// var collidableMeshList = [sphere];

// collidableMeshList.push()
var score = 0;

function reset_game()
{
	cube.position.z = 20
	cube.position.y = 0
	cube.position.x = 0
	directionBall.directionZ *= -1
	
	directionBall.directionX = THREE.MathUtils.randFloat(0, 1)
	directionBall.directionY = THREE.MathUtils.randFloat(0, 1)
	directionBall.speedBall = 0.2
	directionBall.speedBall *= 1.1
}

cube.position.z = 20
cube.position.y = 0
cube.position.x = 0
directionBall.directionX = THREE.MathUtils.randFloat(0, 1)
directionBall.directionY = THREE.MathUtils.randFloat(0, 1)

function collide() {
	var ballBox = new THREE.Box3().setFromObject(cube);
	var pallet1 = new THREE.Box3().setFromObject(Pallet);
	var pallet2 = new THREE.Box3().setFromObject(Pallet2);
	if (ballBox.intersectsBox(pallet2) || ballBox.intersectsBox(pallet1))
		hit = true;
	else
		hit = false;
	
	if (cube.position.z < 2.5 || cube.position.z > 37.5)
	{
		if (cube.position.z < 2.5)
			score++;
		else
			score--;
		console.log(score)
		reset_game()
	}
}



controls.maxDistance = 35
// var w = 0;
function animate() {
	requestAnimationFrame( animate );
	// w++;
	// if (w >= 200)
		// return
	cube.rotation.z += speedRotate;
	// cube.rotation.y += speedRotate;
	// cube.rotation.x += speedRotate;
	cube.position.z +=( directionBall.speedBall * directionBall.directionZ);
	cube.position.y +=( directionBall.speedBall * directionBall.directionY);
	cube.position.x +=( directionBall.speedBall * directionBall.directionX);

	controls.update();
	collide()
	// rebound()
	directionBall = rebound(cube.position, directionBall)
	if(hit == true)
		directionBall.directionZ *= -1;
	renderer.render( scene, camera );
	// console.log("Min"+ controls.minDistance)
	// console.log("Min="+controls.maxDistance)
	// composer.render();
}
animate();

let callBack = (msg) => {
	console.log(msg);
	if (typeof msg !== "object" && !Array.isArray(msg))
		return ;
	console.log(msg.type);
}

socket.use(callBack);

// const materialLine = new THREE.LineBasicMaterial( { color: 0xffffff } );
// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 10, 0 ) );
// points.push( new THREE.Vector3( 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, -10, 0 ) );
// points.push( new THREE.Vector3( -10, 0, 0 ) );


// const geometryLines = new THREE.BufferGeometry().setFromPoints( points );
// const line = new THREE.Line( geometryLines, materialLine );
// scene.add( line );

// renderer.render( scene, camera );


/////


//////////

console.log("cookieeeeeeee");
