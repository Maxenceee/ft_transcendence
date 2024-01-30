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
camera.position.set( 10, 10, 10 );


const controls = new OrbitControls( camera, renderer.domElement );
const scene = new THREE.Scene();
controls.update();
// camera.position.z = 5;






// light.position.set( );
// light.shadow.mapSize.width = 512; // default
// light.shadow.mapSize.height = 512; // default
// light.shadow.camera.near = 0.5; // default
// light.shadow.camera.far = 500; // default
// scene.add( light );

// const Alight = new THREE.AmbientLight(0xffffff);
// scene.add( Alight );
// const helper = new THREE.DirectionalLightHelper( light, 5 );
// scene.add( helper );
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
// const frieren = new THREE.TextureLoader().load( "kitten.jpg" );
const frieren = new THREE.TextureLoader().load( "smug_frieren.jpg" );
// frieren.
// frieren.wrapS = THREE.RepeatWrapping;
// frieren.wrapT = THREE.RepeatWrapping;
// frieren.repeat.set( 4, 2 );
const geometryPlane = new THREE.PlaneGeometry( 30, 30 );
const materialPlane = new THREE.MeshPhysicalMaterial( {color: 0xff0000, side: THREE.DoubleSide, opacity:0.5, transparent : true} );
const plane = new THREE.Mesh( geometryPlane, materialPlane );
scene.add( plane );


const geometryCube = new THREE.BoxGeometry( 5, 5, 5 );

// const materialCube = new THREE.MeshBasicMaterial( {wireframe:true}, {texture:texture});
// const materialCube = new THREE.MeshBasicMaterial( {wireframe:false, map: frieren});
const materialCube = new THREE.MeshPhysicalMaterial( {
	wireframe:false, 
	color:0xffffff, 
	opacity: 1, 
	iridescence :1,
	map:frieren});
// const materialCube = new THREE.MeshDepthMaterial({wireframe:false});

const cube = new THREE.Mesh( geometryCube, materialCube );
scene.add( cube );

const light = new THREE.RectAreaLight( 0xffffff, 1, 30, 30);


var i = -1
var speedRotate =0.01

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 39) {
        i = -1;
    } else if (keyCode == 37) {
        i = 1;
    }
	else if (keyCode == 82) {
        cube.position.z = 0.0;
    }
	console.log(keyCode)
};

function animate() {
	requestAnimationFrame( animate );
	
	cube.rotation.z += speedRotate;
	cube.rotation.y += speedRotate;
	cube.rotation.x += speedRotate;
	cube.position.z +=( 0.1 * i);
	if (cube.position.z > 10 || cube.position.z < 0){
		i *= -1
		speedRotate *= -1.25

		}

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
	camera.lookAt( cube.position );
	renderer.render( scene, camera );
	controls.update();
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
