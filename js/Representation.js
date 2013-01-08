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
        this.camera    = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 2000 );

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
        this.skybox = new Game.Skybox(1000);
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
        // based on http://mrdoob.github.com/three.js/examples/canvas_geometry_earth.html
		var earthTexture = new THREE.Texture();
		var loader = new THREE.ImageLoader();
		loader.addEventListener( 'load', function ( event ) {
			earthTexture.image = event.content;
			earthTexture.needsUpdate = true;

		} );
        loader.load( 'images/textures/earth_poison.jpg' );
		this.sphereMaterial = new THREE.MeshBasicMaterial( { map: earthTexture, overdraw: true } );
        //this.sphereMaterial = new THREE.MeshBasicMaterial( { overdraw: false, wireframe: true } );
        
        this.vertexMaterial = new THREE.MeshBasicMaterial({ color: 0x662222, wireframe: false });
        this.specialVertexMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false });
        
        this.eNotTakenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        this.eTakenMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: false });
        this.eLineMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
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
            this.scene.remove(this.edges[i].mesh);
            this.edges[i].mesh = null;
            this.edges[i].geom.dispose();
            this.edges[i].geom = null;
            this.edges[i] = null;
        }
        this.edges = [];
    },
    
    createWorld: function(human1, human2){
        var lvl = this.model.curLevel;
        var radius = lvl.sphereRadius;
        this.camDistance = 4*radius;
        
        var geom = new THREE.SphereGeometry(radius, Game.SPHERESEGMENTS, Game.SPHERESEGMENTS);
        this.sphere = new THREE.Mesh(geom, this.sphereMaterial);
        this.scene.add(this.sphere);
        
        var geom = new THREE.CubeGeometry(Game.CUBESIZE, Game.CUBESIZE, Game.CUBESIZE, 1, 1, 1);
        for(var i = 0, l = lvl.graph.dim; i < l; i++){
            var vertex;
            if(i === 0 || i === l-1){
                vertex = new THREE.Mesh(geom, this.specialVertexMaterial);
            }
            else{
                vertex = new THREE.Mesh(geom, this.vertexMaterial);
            }
            vertex.position = lvl.vertexPositions[i].multiplyScalar(radius + Game.ALIGNOFFSET);
            
            this.scene.add(vertex);
            this.vertices[i] = vertex;
        }
        
        var edges = lvl.edges;
        for(var i = 0, l = edges.length; i < l; i++){
            edges[i].createMesh(this.eNotTakenMaterial, this.eLineMaterial);
            //edges[i].mesh.scale.multiplyScalar(2);
            this.scene.add(edges[i].mesh);
            
            this.edges[i] = edges[i];  // save reference for deleting
        }
    },
    
    clickedOnMesh: function(obj){
        
        // find out what edgeModel was clicked on
        var edge = null;
        for(var i = 0, l = this.edges.length; i < l; i++){
            if(obj.parent == this.edges[i].mesh){
                edge = this.edges[i];
                break;
            }
        }
        
        // already marked
        if(edge.marked){
            console.log("edge already marked");
            return;
        }
        
        //this.markEdge(edge.v1, edge.v2, edge);
        controller.doMove(edge.v1, edge.v2, edge);
    },
    
    markEdge: function(v1, v2, edgeModelOpt){
        // check if we got a concret edgeModel to remove or if we should remove a random one going from v1 to v2
        if(edgeModelOpt === undefined || edgeModelOpt === null){
            for(var i = 0, l = this.edges.length; i < l; i++){
                if(v1 == this.edges[i].v1 && v2 == this.edges[i].v2){
                    edgeModelOpt = this.edges[i];
                    break;
                }
            }
        }
        
        edgeModelOpt.mesh.children[0].material = this.eTakenMaterial;
        edgeModelOpt.marked = true;
        // remove all others going from v1 to v2, because it is unnecessary to join or cut these, because there is already a path
        // WARNING: we got to call this before renaming the edges due to a join
        for(var i = 0, l = this.edges.length; i < l; i++){
            if(v1 == this.edges[i].v1 && v2 == this.edges[i].v2 && this.edges[i] != edgeModelOpt){
                this.scene.remove(this.edges[i].mesh);
                this.edges[i].mesh = null;
                this.edges[i].geom.dispose();
                this.edges[i].geom = null;
                this.edges[i] = null;
            }
        }
        
        // fill empty spaces
        var newArr = [];
        for(var i = 0, c = 0, l = this.edges.length; i < l; i++){
            if(this.edges[i] === null){
                continue;   
            }
            else{
                newArr[c] = this.edges[i];
                c++;
            }
        }
        this.edges = newArr;
    },
    
    cutEdge: function(v1, v2, edgeModelOpt){
        // check if we got a concret edgeModel to remove or if we should remove a random one going from v1 to v2
        if(edgeModelOpt === undefined || edgeModelOpt === null){
            for(var i = 0, l = this.edges.length; i < l; i++){
                if(v1 == this.edges[i].v1 && v2 == this.edges[i].v2){
                    edgeModelOpt = this.edges[i];
                    break;
                }
            }
        }

        this.scene.remove(edgeModelOpt.mesh);
        edgeModelOpt.mesh = null;
        edgeModelOpt.geom.dispose();
        edgeModelOpt.geom = null;
        //edgeModelOpt = null;      // doesnt work here, because its only a copy of a reference

        
        // fill empty spaces
        var newArr = [];
        for(var i = 0, c = 0, l = this.edges.length; i < l; i++){
            if(this.edges[i] === null || this.edges[i] === edgeModelOpt){       // we need the comparison to edgeModelOpt here, because edgeModelOpt = null is not sufficient somehow
                this.edges[i] = null;
                continue;   
            }
            else{
                newArr[c] = this.edges[i];
                c++;
            }
        }
        this.edges = newArr;
    },
    
    renameModels: function(v1, v2){
        // this function is the edgemodel equivalent to joining these two graph vertices
        for(var i = 0, l = this.edges.length; i < l; i++){
            if(this.edges[i].containsVertex(v2)){
                this.edges[i].renameDueToJoin(v2, v1);
            }
        }
    },
    
    getUnmarkedEdgesMeshes: function(){
        var arr = [];
        for(var i = 0, l = this.edges.length; i < l; i++){
            if(!this.edges[i].marked){
                arr.push(this.edges[i].mesh);
            }
        }
        return arr;
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