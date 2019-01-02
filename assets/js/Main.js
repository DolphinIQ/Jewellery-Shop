// Global Variables
let canvas = document.getElementById("canvas-display");
let itemColorsSelect = document.getElementById("item-options");
let camera0, scene0, renderer, controls, clock, stats;
let gltfLoader;
let Lights = [];
let lightHelpers = false;
let diamondRing;
let ringColors = {
	gold: new THREE.Color( 0.8 , 0.54 , 0.09 ),
	white: new THREE.Color( 0.8 , 0.85 , 0.9 ),
	dark: new THREE.Color( 0.2 , 0.2 , 0.2 ),
};

function init() {
	// Renderer
	renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
	// renderer.setSize( $(canvas).width(), $(canvas).height() );
	renderer.setPixelRatio( $(canvas).width() / $(canvas).height() );
	
	// Scene
	scene0 = new THREE.Scene();
	scene0.background = new THREE.Color( 0xe0e0e0 );
	
	// Camera
	camera0 = new THREE.PerspectiveCamera( 60, $(canvas).width() / $(canvas).height(), 0.1, 1000 );
	camera0.position.set( 0 , 2 , 6 );
	camera0.lookAt( new THREE.Vector3() );
	
	// Clock
	clock = new THREE.Clock();
	
	//Stats
	stats = new Stats();
	document.body.appendChild( stats.dom );
	
	// Loaders
	gltfLoader = new THREE.GLTFLoader();

	// Resize Event
	window.addEventListener("resize", function(){
		// renderer.setSize( $(canvasContainer).width(), $(canvasContainer).height() );
		renderer.setPixelRatio( $(canvas).width() / $(canvas).height() );
		camera0.aspect = $(canvas).width() / $(canvas).height();
		camera0.updateProjectionMatrix();
	}, false);
	
	// Color Change
	itemColorsSelect.addEventListener( "change", function(){
		
		if( diamondRing.material === undefined ) return;
		switch( itemColorsSelect.value ){
			case "gold":
				diamondRing.material.color = ringColors.gold;
				break;
			case "white":
				diamondRing.material.color = ringColors.white;
				break;
			case "dark":
				diamondRing.material.color = ringColors.dark;
				break;
			
		}
	}, false );
	
	// Inits
	initControls();
	initLights();
	createStartingMesh();
}

let createStartingMesh = function(){
	
	gltfLoader.load( 'assets/models/ring.glb', function( gltf ){
		
		diamondRing = gltf.scene.getObjectByName("Ring");
		let scale = 2.0;
		diamondRing.scale.set( scale , scale , scale );
		diamondRing.rotation.y += 20 *Math.PI/180;
		let emissiveFactor = 0.5;
		diamondRing.children[0].material.emissive = new THREE.Color( 
			emissiveFactor , 
			emissiveFactor , 
			emissiveFactor 
		);
		
		scene0.add( diamondRing );
		console.log( diamondRing );
		
	}, function( xhr ){
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	}, function( err ){
		console.log( 'Error happened: ' + err );
	} );
	
}

let initControls = function(){
	controls = new THREE.OrbitControls( camera0 , canvas );
}

let rotateRing = function(){
	// diamondRing.rotation.x -= 0.0004;
	diamondRing.rotation.y -= 0.0006;
	// diamondRing.rotation.z += 0.0003;
}

let initLights = function(){
	Lights[0] = new THREE.AmbientLight( 0xffffff , 1.0 );
	Lights[1] = new THREE.PointLight( 0xffffff , 2.5 );
	Lights[1].position.set( 3 , 3 , 4 );
	Lights[2] = new THREE.PointLight( 0xffffff , 2.5 );
	Lights[2].position.set( -3 , 5 , -5 );
	Lights[3] = new THREE.PointLight( 0xffffff , 2.5 );
	Lights[3].position.set( -3 , -1.5 , 4 );
	
	let sphereSize = 1;
	
	
	for(let i = 0; i < Lights.length; i++){
		scene0.add( Lights[i] );
		
		if( Lights[i] instanceof THREE.PointLight && lightHelpers ){
			let pointLightHelper = new THREE.PointLightHelper( Lights[i], sphereSize );
			scene0.add( pointLightHelper );
		}
	}
}

function animate() {
	stats.begin();
	let delta = clock.getDelta();
	
	if( diamondRing instanceof THREE.Mesh ){
		rotateRing();
	}
	
	requestAnimationFrame( animate );
	renderer.render( scene0, camera0 );
	stats.end();
}

init();
requestAnimationFrame( animate );

