Game.Skybox = new Class({
    initialize: function(size){
        this.size = size;
        //var urls	= Game.Utils.UrlsPx("images/skybox/red/", ".jpg");

    	//var urls	= Game.Utils.UrlsPx("images/skybox/mountain/", ".jpg");
        
    	var urls	= Game.Utils.UrlsPx("images/skybox/castle/", ".jpg");
        //var urls    = Game.Utils.UrlsPx("images/skybox/moonlight/", ".jpg");
        //var urls    = Game.Utils.UrlsPx("images/skybox/colors/", ".jpg");
        var urls    = Game.Utils.UrlsPx("images/skybox/interstellar/", ".jpg");
        
        this.texturePlaceholder;
        this.texturePlaceholder = document.createElement( 'canvas' );
		this.texturePlaceholder.width = 128;
		this.texturePlaceholder.height = 128;

		var context = this.texturePlaceholder.getContext( '2d' );
		context.fillStyle = 'rgb( 200, 200, 200 )';
		context.fillRect( 0, 0, this.texturePlaceholder.width, this.texturePlaceholder.height );
        
        var materials = [
			this.loadTexture( urls[0] ), // right
			this.loadTexture( urls[1] ), // left
			this.loadTexture( urls[2] ), // top
			this.loadTexture( urls[3] ), // bottom
			this.loadTexture( urls[4] ), // back
			this.loadTexture( urls[5] )  // front

		];
	
        this.mesh = new THREE.Mesh( new THREE.CubeGeometry( size, size, size, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
        this.mesh.scale.x = - 1;    // flipSided = true analogon
        //this.mesh.position.y = -200;
    },
    
    initLevels: function(){
        var i = 0;
        this.levels[i++] = "3;1;0;2";
        this.levels[i++] = "10;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1";
        
        
    },
    
    loadTexture: function( path ) {
		var texture = new THREE.Texture( this.texturePlaceholder );
		var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

		var image = new Image();
		image.onload = function () {

			texture.needsUpdate = true;
			material.map.image = this;

			representation.render();

		};
		image.src = path;

		return material;
	},
    
//    createMaterial: function(urls) {
//	return [
//                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(urls[0])}), // right
//                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(urls[1])}), // left
//                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(urls[2])}), //top
//                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(urls[3])}), // bottom
//                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(urls[4])}), // back
//                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(urls[5])}) // front
//        ];
//    },
    
    getMesh: function(){
        return this.mesh;
    },

});