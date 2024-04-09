import { createElement, Component, link } from '..';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';	

let teapot
const teapotSize = 300;	
let tess = - 1;	// force initialization

let bBottom;
let bLid;
let bBody;
let bFitLid;
let bNonBlinn;
let shading;

function setupGui(effectController, render) {

	effectController = {
		newTess: 15,
		bottom: true,
		lid: true,
		body: true,
		fitLid: false,
		nonblinn: false,
		newShading: 'glossy'
	};
	const gui = new GUI();
	gui.add( effectController, 'newTess', [ 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50 ] ).name( 'Tessellation Level' ).onChange( render );
	gui.add( effectController, 'lid' ).name( 'display lid' ).onChange( render );
	gui.add( effectController, 'body' ).name( 'display body' ).onChange( render );
	gui.add( effectController, 'bottom' ).name( 'display bottom' ).onChange( render );
	gui.add( effectController, 'fitLid' ).name( 'snug lid' ).onChange( render );
	gui.add( effectController, 'nonblinn' ).name( 'original scale' ).onChange( render );
	gui.add( effectController, 'newShading', [ 'wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective' ] ).name( 'Shading' ).onChange( render );
}
function createEffectController(effectController, scene, textureCube){

	if ( effectController.newTess !== tess ||
		effectController.bottom !== bBottom ||
		effectController.lid !== bLid ||
		effectController.body !== bBody ||
		effectController.fitLid !== bFitLid ||
		effectController.nonblinn !== bNonBlinn ||
		effectController.newShading !== shading ) {

			tess = effectController.newTess;
			bBottom = effectController.bottom;
			bLid = effectController.lid;
			bBody = effectController.body;
			bFitLid = effectController.fitLid;
			bNonBlinn = effectController.nonblinn;
			shading = effectController.newShading

			if ( shading === 'reflective' ) {
				scene.background = textureCube;
			} else {
				
				scene.background = null;
				}
			}
}
function createNewTeapot(scene, effectController) {

	if ( teapot !== undefined ) {
		teapot.geometry.dispose();
		scene.remove( teapot );
	}
	
	const geometry = new TeapotGeometry( 300,
		tess,
		effectController.bottom,
		effectController.lid,
		effectController.body,
		effectController.fitLid,
		!effectController.nonblinn
		);
		teapot = new THREE.Mesh( geometry,new THREE.MeshStandardMaterial({
			wireframe:true, 
			color:0xffffff, 
			opacity: 1, 
			side : THREE.DoubleSide,
		}));
		scene.add( teapot );

}
let render_teapot = function({width, height} = {width: window.innerWidth, height: window.innerHeight}) {
	let effectController = {};
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);

	let camera, scene;
	let cameraControls;
	let ambientLight, light;
	let textureCube;
	// const materials = {};

	camera = new THREE.PerspectiveCamera( 45, width / height, 1, 80000 );
	camera.position.set( - 600, 550, 2000 );

	ambientLight = new THREE.AmbientLight( 0x7c7c7c, 3.0 );

	light = new THREE.DirectionalLight( 0xFFFFFF, 3.0 );
	light.position.set( 0.32, 0.39, 0.7 );

	// CONTROLS
	cameraControls = new OrbitControls( camera, renderer.domElement );
	cameraControls.autoRotate = true;
	cameraControls.enabled = false;

	// TEXTURE MAP
	const textureMap = new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );
	textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
	textureMap.anisotropy = 16;
	textureMap.colorSpace = THREE.SRGBColorSpace;

	// REFLECTION MAP
	const path = 'textures/cube/pisa/';
	const urls = [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ];

	textureCube = new THREE.CubeTextureLoader().setPath( path ).load( urls );

	// scene itself
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xAAAAAA );

	scene.add( ambientLight );
	scene.add( light );
	createEffectController(effectController, scene, textureCube);
	// setupGui(effectController, renderer);	
	createNewTeapot(scene, effectController) ;

	let animationid = null,
	ts = Date.now();
	const animate = () => {
		renderer.render(scene, camera);
		cameraControls.update();
		animationid = requestAnimationFrame(animate);
	}

	return ({
		start: animate,
		animationid: () => animationid,
		render: () => renderer.domElement,
		unmount: () => {
			animationid && cancelAnimationFrame(animationid);
		}
	});
}




class TeaPot extends Component {
	constructor(props) {
		super(props);
		
		this.state = { renderer: null };
	}

	componentDidMount() {
		this.setState({renderer: render_teapot()})
	}

	componentDidUpdate() {
		if (this.state.renderer) {
			this.state.renderer.animationid() && cancelAnimationFrame(this.state.renderer.animationid());
			this.state.renderer.start();
		}
	}

	componentWillUnmount() {
		this.state.renderer && this.state.renderer.unmount();
	}
	
	render() {
		return createElement('div', {
			class: "server-error", children: this.state.renderer && this.state.renderer.render()
        });        
	}
}

export default TeaPot;