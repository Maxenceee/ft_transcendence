import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))


const light = new THREE.PointLight(0xffffff, 1000)
light.position.set(2.5, 7.5, 15)
// scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true



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
		// scene.add(cube, plane);
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


// const objLoader = new OBJLoader()
// objLoader.load(
// 	'/static/javascripts/tmp_test/pong_visual.obj',
//     (object) => {
// 		scene.add(object)
//     },
//     (xhr) => {
// 		console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
// 		console.log(error)
//     }
// 	)

const loader = new GLTFLoader()
loader.load( 'static/javascripts/tmp_test/pong_visual.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );




window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// const stats = new Stats()
// document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

	renderer.render( scene, camera );
	composer.render();
    // stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
