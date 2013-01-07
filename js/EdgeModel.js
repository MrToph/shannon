Game.EdgeModel = new Class({
    initialize: function(v1, v2, pos3D1, pos3D2, nth){
        this.mesh = null, this.geom = null;
        this.marked = false;
        this.v1 = v1, this.v2 = v2;
        this.pos1 = pos3D1, this.pos2 = pos3D2;
        this.nth = parseInt(nth);                         // wie vielte edge von v1 nach v2 (0..graph[v1][v2]-1)
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
        /* drawing lines example: https://github.com/mrdoob/three.js/wiki/Drawing-lines
        
         * -- 3d classes --
         * THREE.LineCurve3
         * THREE.QuadraticBezierCurve3
         * THREE.CubicBezierCurve3
         * THREE.SplineCurve3
         * THREE.ClosedSplineCurve3
        */
        
        // good website for some intuition http://www.movable-type.co.uk/scripts/latlong.html => http://mathforum.org/library/drmath/view/51822.html
        var points = new Array(100);    // might be overkill, but doesnt lower performance, because it doesnt affect the visaul tubemesh (these are not the segments of the tube!) // how many points does the spline have to interpolate, the more the better it approximates a grand arch
        var dir1 = this.pos1.clone().normalize();
        var dir2 = this.pos2.clone().normalize();
        var normal = new THREE.Vector3().cross(dir1, dir2);     // orthogonal to dir1, dir2
        // parallel?
        if(normal.length() < Game.EPS){
            // make dir2 span a random plane with dir1, for easy calc make it orthonormal
            var a = Math.abs(dir1.x), b = Math.abs(dir1.y), c = Math.abs(dir1.z);
            if(a >= b && a >= c){
                a = Math.pow(dir1.y, 2);
                b = Math.pow(dir1.z, 2);
                c = -(a+b)/dir1.x;
                dir2 = new THREE.Vector3(c, dir1.y, dir2.z); // x^2 + y^2 + z1*z2 must be 0 (dot product)
            }
            else if(b >= a && b >= c){
                a = Math.pow(dir1.x, 2);
                b = Math.pow(dir1.z, 2);
                c = -(a+b)/dir1.y;
                dir2 = new THREE.Vector3(dir1.x, c, dir2.z); // x^2 + y^2 + z1*z2 must be 0 (dot product)
            }
            else{
                a = Math.pow(dir1.x, 2);
                b = Math.pow(dir1.y, 2);
                c = -(a+b)/dir1.z;
                dir2 = new THREE.Vector3(dir1.x, dir2.y, c); // x^2 + y^2 + z1*z2 must be 0 (dot product)
            }
            
            normal = THREE.Vector3().cross(dir1, dir2);
            dir2.normalize();
        }
        normal.normalize();
        
        var pos1L = this.pos1.length();
        var step = 1/(points.length - 1);
        var t = 0;
        var sign = (this.nth % 2 === 0) ? -1 : 1;     // alignment left or right from the 0th line (left, right depend on normal)
        var offsetMultiplier = 1.5* Math.floor((this.nth+1) / 2);
        for(var i = 0, l = points.length; i < l; i++){
            points[i] = new THREE.Vector3().add(dir1.clone().multiplyScalar(t), dir2.clone().multiplyScalar(1-t));
            points[i].multiplyScalar(pos1L/points[i].length());
            
            var bow = -4*t*(t-1);// http://www.wolframalpha.com/input/?i=-4t^2+%2B+4t
            points[i].addSelf(normal.clone().multiplyScalar(sign * offsetMultiplier * bow));
            t += step;
        }
        
        var path = new THREE.Curve();
        path = new THREE.SplineCurve3(points);
        this.geom = new THREE.TubeGeometry(path, Game.NUMINTERPOLATIONPOINTS, 0.4, 4, false);
    },
    
    computeInterpolationPointsOld: function(){
        /* drawing lines example: https://github.com/mrdoob/three.js/wiki/Drawing-lines
        
         * -- 3d classes --
         * THREE.LineCurve3
         * THREE.QuadraticBezierCurve3
         * THREE.CubicBezierCurve3
         * THREE.SplineCurve3
         * THREE.ClosedSplineCurve3
        */
        
        // good website for some intuition http://www.movable-type.co.uk/scripts/latlong.html => http://mathforum.org/library/drmath/view/51822.html
        var mid = this.pos1.clone().addSelf(this.pos2);
        mid = mid.multiplyScalar((this.pos1.length()/mid.length()) * 1.2);
        
        var path = new THREE.Curve();
        path = new THREE.SplineCurve3([this.pos1.clone(), mid, this.pos2.clone()]);
        //path = new THREE.QuadraticBezierCurve3(this.pos1.clone(), mid, this.pos2.clone());

//        this.geom = new THREE.Geometry();
//        for(var i = 0, l = this.interpolationPoints.length; i < l; i++){
//            var t = 1.0/((l-1)) * i;
//            this.geom.vertices.push(path.getPoint(t));
//        }
        this.geom = new THREE.TubeGeometry(path, Game.NUMINTERPOLATIONPOINTS, 0.4, 4, false);
    },

});