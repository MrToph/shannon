Game.EdgeModel = new Class({
    initialize: function(v1, v2, pos3D1, pos3D2){
        this.mesh = null, this.geom = null;
        this.v1 = v1, this.v2 = v2;
        this.pos1 = pos3D1, this.pos2 = pos3D2;
        //this.interpolationPoints = new Array(Game.NUMINTERPOLATIONPOINTS);
        
        this.computeInterpolationPoints();
    },
    
    name: function(graphAsStringRepres){
        return this.v1 + ":" + this.v2;
    },
    
    createMesh: function(material, lineMaterial){
        var color = 0x0000ff;
 
//        this.mesh = THREE.SceneUtils.createMultiMaterialObject(this.geom, [
//            new THREE.MeshLambertMaterial({
//						color: color,
//						opacity: (this.geom.debug) ? 0.2 : 0.5,
//						transparent: true
//					}),
//		    material
//        ]);
            this.mesh = THREE.SceneUtils.createMultiMaterialObject(this.geom, [material]);
    },
    
    computeInterpolationPoints: function(){
        // drawing lines example: https://github.com/mrdoob/three.js/wiki/Drawing-lines
        var path = new THREE.SplineCurve3([this.pos1, new THREE.Vector3(), this.pos2]);
//        this.geom = new THREE.Geometry();
//        for(var i = 0, l = this.interpolationPoints.length; i < l; i++){
//            var t = 1.0/((l-1)) * i;
//            this.geom.vertices.push(path.getPoint(t));
//        }
        this.geom = new THREE.TubeGeometry(path, Game.NUMINTERPOLATIONPOINTS, 0.4, 4, false);

        console.log(path.getPoint(0));
    },

});