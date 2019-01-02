// Global Variables
let canvas = document.getElementById("canvas-display");
let camera0, scene0, renderer, controls, clock, stats;
let gltfLoader;
let Textures = {};
let Lights = [];
let shadows = false;

console.dir( canvas );

function init() {
	// Renderer
	renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
	// renderer.setSize( $(canvas).width(), $(canvas).height() );
	renderer.setPixelRatio( $(canvas).width() / $(canvas).height() );
	if(shadows){ 
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}
	
	// Scene
	scene0 = new THREE.Scene();
	scene0.background = new THREE.Color( 0xd0d0d0 );
	
	// Camera
	camera0 = new THREE.PerspectiveCamera( 60, $(canvas).width() / $(canvas).height(), 0.1, 1000 );
	camera0.position.set( 0 , 1 , 4 );
	
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
	
	// Inits
	initControls();
	
	initLights();
	createStartingMesh();
}

let createStartingMesh = function(){
	let cube = new THREE.Mesh( 
		new THREE.BoxGeometry() , 
		new THREE.MeshLambertMaterial({color: 0x404040 })
	);
	if(shadows) {
		cube.castShadow = true;
		cube.receiveShadow = true;
	}
	scene0.add( cube );
	
}

let initControls = function(){
	controls = new THREE.OrbitControls( camera0 , canvas );
}

let initLights = function(){
	Lights[0] = new THREE.AmbientLight( 0xffffff , 0.3 );
	Lights[1] = new THREE.DirectionalLight( 0xffffff , 0.8 );
	Lights[1].position.set( 50 , 200 , 80 );
	if(shadows){
		Lights[1].castShadow = true;
		Lights[1].shadow.mapSize.width = 1024 * 1;
		Lights[1].shadow.mapSize.height = 1024 * 1;
		Lights[1].shadow.camera.near = 0.1;
		Lights[1].shadow.camera.far = 10000;
		if( Lights[1] instanceof THREE.DirectionalLight ){
			Lights[1].shadow.camera.left = -1000;
			Lights[1].shadow.camera.bottom = -1000;
			Lights[1].shadow.camera.top = 1000;
			Lights[1].shadow.camera.right = 1000;
		}
		Lights[1].shadow.bias = 0.0001;
	}
	
	for(let i = 0; i < Lights.length; i++){
		scene0.add( Lights[i] );
	}
}

function animate() {
	stats.begin();
	let delta = clock.getDelta();
	
	
	requestAnimationFrame( animate );
	renderer.render( scene0, camera0 );
	stats.end();
}

init();
requestAnimationFrame( animate );

