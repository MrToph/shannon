Game.Representation = new Class({
    Implements: Events,
    initialize: function(model){
        this.model = model;
        // init the WebGL renderer and append it to the Dom
        this.renderer = new THREE.CanvasRenderer({
    		antialias	: true
    	});
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    
        // create the Scene
    	this.scene = new THREE.Scene();
    	var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 1, 0, 1 ).normalize();
        this.scene.add( directionalLight );
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 0, 1, -1 ).normalize();
        this.scene.add( directionalLight );
        
        // create camera
        var fov = 70.11;
        this.camDistance = 100;
        this.camera    = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1100 );
        this.camera.position.x = this.camDistance;
        this.camera.position.z = this.camDistance;
        this.camera.position.y = this.camDistance;
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        
        //add camera to scene
        this.scene.add(this.camera);
	
        WindowResize(this.renderer, this.camera);
        //this.scene.fog = new THREE.Fog( 0x000000, 1, 40 );
        //this.renderer.setClearColor( this.scene.fog.color, 1 );
        this.renderer.setClearColorHex( 0x333333, 1 );
    	//this.renderer.autoClear = false;							// no need
        
        
        this.sphereMaterial = null, this.vertexMaterial = null, this.eTakenMaterial = null, this.eNotTakenMaterial = null;
        this.sphere = null, this.vertices = [], this.edges = [];
    
        
        this.initMaterials();
        
        // add skybox
        this.skybox = new Game.Skybox(300);
        this.scene.add(this.skybox.getMesh());
    },
    
    setCamera: function(lon, lat){
        // set camera
        lat = Math.max( - 85, Math.min( 85, lat ) );
    	var phi = ( 90 - lat ) * Math.PI / 180;
    	var theta = lon * Math.PI / 180;
    
    	// camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    	// camera.target.y = 500 * Math.cos( phi );
    	// camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
    	this.camera.position.x = this.camDistance * Math.sin( phi ) * Math.cos( theta );
    	this.camera.position.y = this.camDistance * Math.cos( phi );
    	this.camera.position.z = this.camDistance * Math.sin( phi ) * Math.sin( theta );
    
    	this.camera.lookAt(new THREE.Vector3(0,0,0));
    },
    
    initMaterials: function(){
        this.sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x151515, wireframe: false, overdraw: true });
        this.vertexMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
        this.specialVertexMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: false });
    },
    
    destroyWorld: function(human1, human2){
        // destroy all 
        this.scene.remove(this.sphere);
        this.sphere = null;
          
        for(var i = 0, l = this.vertices.length; i < l; i++){
            this.scene.remove(this.vertices[i]);
            this.vertices[i] = null;
        }
        this.vertices = [];
          
        for(var i = 0, l = this.edges.length; i < l; i++){
            this.scene.remove(this.edges[i]);
            this.edges[i] = null;
        }
        this.edges = [];
    },
    
    createWorld: function(human1, human2){
        var lvl = this.model.curLevel;
        var radius = 5*lvl.sphereRadius;
        this.camDistance = 4*radius;
        
        var geom = new THREE.SphereGeometry(radius, 18, 18);
        this.sphere = new THREE.Mesh(geom, this.sphereMaterial);
        this.scene.add(this.sphere);
        
        var geom = new THREE.CubeGeometry(2, 2, 2, 1, 1, 1);
        for(var i = 0, l = lvl.graph.dim; i < l; i++){
            var vertex;
            if(i == 0 || i === l-1){
                vertex = new THREE.Mesh(geom, this.specialVertexMaterial);
            }
            else{
                vertex = new THREE.Mesh(geom, this.vertexMaterial);
            }
            vertex.position = lvl.vertexPositions[i].multiplyScalar(radius + Math.sqrt(2) + 0.05);
            
            this.scene.add(vertex);
            this.vertices[i] = vertex;
        }
    },
    
    endLevelAnim: function(){
        this.fireEvent('endLevelAnimFinished');  
    },
    
    nextLevelAnim: function(){
        this.fireEvent('nextLevelAnimFinished');  
    },
    
    render: function(){
        this.renderer.render( this.scene, this.camera );
    },
    
    getRendererDOM: function(){
        return this.renderer.domElement;   
    },
    
    getCamera: function(){
        return this.camera;
    }
});