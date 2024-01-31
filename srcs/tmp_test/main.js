// import * as THREE from 'three';
// import { randInt } from './node_modules/three/src/math/MathUtils.js';
// import * as THREE from './node_modules/three/build/three.module.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { TextureLoader } from 'three/addons/lights/SpotLight.js';


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
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

const Alight = new THREE.AmbientLight(0xffffff);
scene.add( Alight );
// const helper = new THREE.DirectionalLightHelper( light, 5 );
// scene.add( helper );
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
const kitten = new THREE.TextureLoader().load( "kitten.jpg" );
const frieren = new THREE.TextureLoader().load( "smug_frieren.jpg" );
const fire = new THREE.TextureLoader().load( "fire.jpg" );
// frieren.
// frieren.wrapS = THREE.RepeatWrapping;
// frieren.wrapT = THREE.RepeatWrapping;
// frieren.repeat.set( 4, 2 );
const geometryPlane = new THREE.PlaneGeometry( 30, 30 );
const materialPlane = new THREE.MeshPhysicalMaterial( {color: 0xff00ff, side: THREE.DoubleSide, opacity:0.5, transparent : true} );
const materialPlane2 = new THREE.MeshPhysicalMaterial( {color: 0xff0000, side: THREE.DoubleSide, opacity:0.5, transparent : true} );
const materialPalette = new THREE.MeshPhysicalMaterial( {side: THREE.DoubleSide, opacity:1, transparent : true, map: kitten} );
const materialPalette2 = new THREE.MeshPhysicalMaterial( {side: THREE.DoubleSide, opacity:1, transparent : true, map: frieren} );
// const geometryPlane = new THREE.Plane({normal:(30, 30, 30)})
const plane = new THREE.Mesh( geometryPlane, materialPlane );
const tmp = new THREE.BoxGeometry( 30, 30, 1 )
const tmp2 = new THREE.BoxGeometry( 6, 6, 1 )
const plane2 = new THREE.Mesh( tmp, materialPlane2 );
const Pallet = new THREE.Mesh( tmp2, materialPalette );
const Pallet2 = new THREE.Mesh( tmp2, materialPalette2 );
plane2.position.z += 40
Pallet.position.z += 38
Pallet2.position.z += 2
// const planeBox = plane.geometry.boundingBox.containsBox();
scene.add( plane , plane2, Pallet, Pallet2);
//  IntersectionObserver()

const geometrySphere = new THREE.SphereGeometry( 5 );
const materialSphere = new THREE.MeshPhysicalMaterial( {
	wireframe:true, 
	color:0xffffff, 
	opacity: 1, 
	iridescence :1,
	map:frieren});
	
// const geometryCube = new THREE.BoxGeometry( 5, 5, 5 );
const geometryCube = new THREE.SphereGeometry( 2 );
// var cube = new THREE.Object3D;

// const materialCube = new THREE.MeshBasicMaterial( {wireframe:true}, {texture:texture});
// const materialCube = new THREE.MeshBasicMaterial( {wireframe:false, map: frieren});
const materialCube = new THREE.MeshPhysicalMaterial( {
	wireframe:false, 
	color:0xffffff, 
	opacity: 1, 
	iridescence :1,
	map:fire});
	// const materialCube = new THREE.MeshDepthMaterial({wireframe:false});
	
const cube = new THREE.Mesh( geometryCube, materialCube );
const sphere = new THREE.Mesh( geometrySphere, materialSphere );

cube.position.z = 20;
scene.add( cube);


const light = new THREE.RectAreaLight( 0xffffff, 1, 30, 30);


var i = -1
var speedRotate =0.01

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 39) {
        Pallet.position.x -=0.3;
    } else if (keyCode == 37) {
        Pallet.position.x +=0.3;
    } else if (keyCode == 40) {
        Pallet.position.y -=0.3;
	} else if (keyCode == 38) {
        Pallet.position.y +=0.3;
    }else if (keyCode == 82) {
        cube.position.z = 20.0;
    }else if (keyCode == 87) {
		Pallet2.position.y+=0.3;
	}else if (keyCode == 83) {
		Pallet2.position.y-=0.3;
	}else if (keyCode == 68) {
		Pallet2.position.x -=0.3;
	}else if (keyCode == 65) {
		Pallet2.position.x += 0.3;
	}
	console.log(keyCode)
};

// cube.geometry = new THREE.BoxGeometry();
var hit = false;
var collidableMeshList = [sphere];

// collidableMeshList.push()
var score = 0; 

function collide(){
	var ballBox = new THREE.Box3().setFromObject(cube);
	var wall1 = new THREE.Box3().setFromObject(plane);
	var wall2 = new THREE.Box3().setFromObject(plane2);
	var pallet1 = new THREE.Box3().setFromObject(Pallet);
	var pallet2 = new THREE.Box3().setFromObject(Pallet2);
	if (ballBox.intersectsBox(pallet2) || ballBox.intersectsBox(pallet1))
		hit = true;
	else
		hit = false;
	if (ballBox.intersectsBox(wall2) || ballBox.intersectsBox(wall1))
	{
		score++;
		console.log(score)
		cube.position.z = 20
	}
	// const helper = new THREE.Box3Helper( bbox, 0xffff00 );
	// scene.add( helper );
}
// 	var originPoint = cube.position.clone();
// 	for (var vertexIndex = 0;  1 < 0 ; vertexIndex++) // vertexIndex < cube.geometry.vertices[vertexIndex]
// 	{   
//         var ray = new THREE.Raycaster( cube.position, cube.geometry.vertices[vertexIndex] );
//         var collisionResults = ray.intersectObjects( collidableMeshList );
//         if ( collisionResults.length > 0)  
//            hit = true;
// 		else
// 			hit = false;
// 	}
// 	// console.log(cube.geometry.getAttribute('position'))
// }

// var w = 0;
function animate() {
	requestAnimationFrame( animate );
	// w++;
	// if (w >= 200)
		// return
	cube.rotation.z += speedRotate;
	// cube.rotation.y += speedRotate;
	// cube.rotation.x += speedRotate;
	cube.position.z +=( 0.2 * i);
	// if (cube.position.z > 10 || cube.position.z < 0){
		// i *= -1
		// speedRotate *= -1.25
// 
		// }
// 
	// else if (cube.position.z < 5)
		// cube.position.z += 0.1
	// if(cube.position.z < 5)
	// 	cube.translateX(0.1);
	// else
	// 	cube.translateX(-0.1);
	// light.target = cube.position ;
	// scene.add( light);
	// camera.lookAt( cub );
	light.position.set(cube.position.x + 6, cube.position.y + 6, cube.position.z + 6);
	scene.add(light);
	// camera.lookAt( cube.position );
	renderer.render( scene, camera );
	controls.update();
	collide()
	if(hit == true)
		i *= -1;

}
animate();

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


console.log("cookie");
