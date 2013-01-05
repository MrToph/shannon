// declare a bunch of variable we will need later
var container;
var representation, controller;
var gui;
var stats;

var isUserInteracting = false,
    onPointerDownPointerX = 0, onPointerDownPointerY = 0,
	lon = 55, onPointerDownLon = 0,
	lat = 0, onPointerDownLat = 0,		// set lat to 40 to change the cameras position from start
    fov = 70.711;

// ## bootstrap functions
if ( ! Detector.webgl ){
	// test if webgl is supported
	//Detector.addGetWebGLMessage();
    
    // Run it in canvas
    // initialiaze everything
    init();
	// make it move			
	animate();	
}else{
	// initialiaze everything
	init();
	// make it move			
	animate();	
}

// ## Initialize everything
function init() {
	// create the container element
	container = document.createElement( 'div' );
	container.id = "3D";
	document.body.appendChild( container );

	// start game
    var model = new Game.Game(location.hash.substring(1));
    representation = new Game.Representation(model);
    controller = new Game.Controller(model);            // in this order, because controller needs to listen to representaitons events
    
    
    container.appendChild( representation.getRendererDOM() );
    // init the Stats and append it to the Dom - performance vuemeter
	stats	= new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom	= '0px';
	container.appendChild( stats.domElement );
    
    // create GUI controls
    createGUI();

	// add Mouse events
	representation.getRendererDOM().addEventListener( 'mousedown', onDocumentMouseDown, true );		// we only want to activate the user dragging when we click on the canvas and not on the gui/stats
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);
    
    // add on hash change event
    window.onhashchange = locationHashChanged;
    
    //representation.endLevelAnim();
    guiRestartGame("Human", "AI");
}			

// ## Animate and Display the Scene
function animate() {                         
	// render the 3D scene
	render();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
	// update the stats
	stats.update();
}


// ## Render the 3D Scene
function render() {
	// actually display the scene in the Dom element
    representation.setCamera(lon, lat);
	representation.render();
}


/***************************************************
Mouse handling and camera movement taken from 
http://mrdoob.github.com/three.js/examples/webgl_panorama_equirectangular.html


***************************************************/

function onDocumentMouseDown( event ) {
    event.preventDefault();
	
	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;
	
//	// Shoot ray through the scene [example from http://mrdoob.github.com/three.js/examples/canvas_interactive_cubes.html]
//	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
//	projector.unprojectVector( vector, camera );
//
//	var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
//
//	var intersects = ray.intersectObjects( world.gameMeshSphereArr() );
//
//	if ( intersects.length > 0 ) {
//		world.clickedOnSphere(intersects[0].object.index);
//		// var particle = new THREE.Particle( particleMaterial );
//		// particle.position = intersects[ 0 ].point;
//		// particle.scale.x = particle.scale.y = 8;
//		// scene.add( particle );
//
//	}
}

function onDocumentMouseMove( event ) {
	if ( isUserInteracting ) {

		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		//console.log("lon = " + lon + "    lat = " + lat);
	}
	
}

function onDocumentMouseUp( event ) {

	isUserInteracting = false;

}

function onDocumentMouseWheel( event ) {
	// WebKit

	if ( event.wheelDeltaY ) {

		fov -= event.wheelDeltaY * 0.025;

	// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		fov -= event.wheelDelta * 0.025;

	// Firefox

	} else if ( event.detail ) {

		fov += event.detail * 0.50;
	}
    
    if(fov < 2) fov = 2;
    if(fov > 90) fov = 90;

	representation.getCamera().projectionMatrix = new THREE.Matrix4().makePerspective( fov, window.innerWidth / window.innerHeight, 1, 2000 );
	render();
}

function locationHashChanged() {
    var s = location.hash.substring(1);
    if(Game.Game.isValidGraphString(s)){
        representation.destroyWorld();
        controller.initLevel(location.hash.substring(1));
        representation.createWorld();
    }
}

function guiRestartGame(p1S, p2S) {
	//console.log("RestartGame called with " + p1S + " " + p2S);
	// 0 Human, 1 AI easy, 2 AI normal, 3 AI hard
	var p1 = 0, p2 = 0;
	if(p1S.indexOf("Human") !== -1){p1 = 1}
	else {p1 = 0;}      // AI

	if(p2S.indexOf("Human") !== -1){p2 = 1}
	else {p2 = 0;}     // AI
    
    representation.destroyWorld();
	controller.restartLevel(p1, p2);
    representation.createWorld();
}


function createGUI() {
	gui = new dat.GUI({
	height : 3 * 32 - 1
	}); 
	
	var params = {player1AI : "Human", player2AI : "AI", restart : function(){}}; 

	gui.add(params, 'player1AI', [ 'Human', 'AI' ] ).name("Player 1");
	gui.add(params, 'player2AI', [ 'Human', 'AI' ] ).name("Player 2");
	
	gui.add(params, 'restart').name("Restart").onFinishChange(function(){
		guiRestartGame(params.player1AI, params.player2AI);
	});
}




