Game.Level = new Class({
    initialize: function(graphAsStringRepres){
        this.stringRepresentation = graphAsStringRepres;
        this.edges = [];
        this.graph = null;
        this.sphereRadius = 0;
        this.vertexPositions = [];      // on unit Sphere
        
        this.decodeStringToGraph();
        this.determineSphereRadius();
        this.determineVertexPositions();
    },
    
    decodeStringToGraph: function(){
        var arr = this.stringRepresentation.split(";");
        if(arr.length < 1){
            return;
        }
        var dim = parseInt(arr[0]);
        if((arr.length-1) != ((dim+1)*dim)/2 - dim){     // symmetric and no diagonal (-dim)
            console.log("in Level:decodeStringToGraph: sizes do not match. Expected: " + ( ((dim+1)*dim)/2 - dim) + "/tgot: " + (arr.length-1));
            return;
        }

        this.graph = new Game.Graph(dim);
        var c = 1;
        for(var i = 1; i <= dim; i++){
            for(var j = i+1; j <= dim; j++){         // 1,2 1,3 .. 1,n 2,3 ...
                this.graph.set(i,j, parseInt(arr[c++]));
            }
        }
    },
    
    determineSphereRadius: function(){
        this.sphereRadius = this.graph.dim;
    },
    
    determineVertexPositions: function(){
//        % Generate a set of evenly distributed points on a unit sphere
//% using the method of the Golden Section Spiral method.
//%
//% Output is a 3xN matrix of points for X,Y,Z.
//%
//% Based on python code from Patric Boucher on http://www.xsi-blog.com
//    inc = math.pi * (3 - math.sqrt(5))
//    off = 2 / N
//    for k in range(0, N):
//        y = k * off - 1 + (off / 2)
//        r = math.sqrt(1 - y*y)
//        phi = k * inc
//        pts.append([math.cos(phi)*r, y, math.sin(phi)*r])
// 
//    return pts
        this.vertexPositions = [];
        var n = this.graph.dim;
        var inc = Math.PI * (3-Math.sqrt(5));
        var off = 2/n;
        
        for(var k = 0; k<n; k++){
            var y = k*off - 1 + (off/2);
            var r = Math.sqrt(1 - y*y);
            var phi = k * inc;
            this.vertexPositions.push(new THREE.Vector3(Math.cos(phi)*r, y, Math.sin(phi)*r));
        }
    },
    
});



