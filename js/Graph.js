Game.Graph = new Class({            // represents a graph as an adjacency matrix. The graph is symmetric, so we can save some space, if we only store a (upper) triangular matrix.
    initialize: function(amountOfVertices){
        this.dim = amountOfVertices;
        this.endVertex = this.dim;      // the special end vertex which needs to be connected to vertex 1; it changes with joining vertexes, because the higher one gets joined with the lower one
        this.g = new Array((this.dim*(this.dim+1)) /2);
        for(var i = 0, l = this.g.length; i < l; i++){
            this.g[i] = 0;      // initialize with 0
        }
    },
    
    get: function(i, j){
//        i--;j--;    // graph starts intern at 0,0 not at 1,1
//        if(i<=j){
//            return this.g[(j*(j+1))/2 + i];   
//        }
//        else{
//            return this.g[(i*(i+1))/2 + j];   
//        }
        if(i<=j){
            return this.g[(j*(j-1))/2 + i - 1];   
        }
        else{
            return this.g[(i*(i-1))/2 + j - 1];   
        }
    },
    
    getUpper: function(i, j){
        // i has to be <= j <=> gets from upper triangular matrix
        return this.g[(j*(j-1))/2 + i - 1];
    }.protect(),
    
    set: function(i, j, val){
//        i--;j--;    // graph starts intern at 0,0 not at 1,1
//        if(i<=j){
//            this.g[(j*(j+1))/2 + i] = val;   
//        }
//        else{
//            this.g[(i*(i+1))/2 + j] = val;   
//        }
        if(i<=j){
            this.g[(j*(j-1))/2 + i - 1] = val;   
        }
        else{
            this.g[(i*(i-1))/2 + j - 1] = val;   
        }
    },
    
    setUpper: function(i, j, val){
        this.g[(j*(j-1))/2 + i - 1] = val;   
    }.protect(),
    
    clone: function(){
        // dirty, because we can't overload constructors/no polymorphism
        var g = new Game.Graph(0);
        g.dim = this.dim;
        g.endVertex = g.dim;
        g.g = this.g.slice(0);       // copy whole array
        return g;
    },
    
    join: function(v1,v2){
        // v1 <= v2
        var dim = this.dim;
        
        // merge edges from rnd to v2 to v1 to rnd
        for(var i = 1; i <= dim; i++){
            if(i === v1 || i === v2) continue;
            
            var tmp = this.get(v2,i);
            if(tmp > 0){
                this.set(v1, i, tmp+this.get(v1,i));    // g[v1,i] += tmp
                this.set(v2, i, 0);
            }
        }
        // remove self loops etc
        this.setUpper(v1, v1, 0);       // not necessary
        this.setUpper(v1, v2, 0);       // not necessary
        
        this.log();
        if(/*this.endVertex === v1 ||  not needed because, if endVertex = v1 then it would get merged to v1 again*/ this.endVertex === v2){ // endVertex got joined
            this.endVertex = v1;
        }
        
    },
    
    cut: function(v1,v2){
        this.setUpper(v1, v2, this.getUpper(v1,v2)-1);
    },
    

    
    getWinner: function(){    // returns 0 if game is not yet over, 1 if join won, and 2 if cut won
        if(this.endVertex === 1){   // join just joined v1 and endVertex
            return 1;
        }
        else{   // did cut win?
            // depth search/ breadth search from v1 to endVertex, if no path exists => cut won
            var paths = this.bfs(1, this.endVertex);
            if(paths.length === 0){
                return 2;
            }
        }
        return 0;
    },
    
    bfs: function(startVertex, findVertex){
        return this.bfsRec([[startVertex]], findVertex);
    },
    
    bfsRec: function(paths,vFind){    // initialize startVertices with [startVertex], path with [startVertex]        
        var newPaths = [];
        var counterAlreadyFoundPaths = 0;
        var g = this.clone();
        
        for(var i = 0, l = paths.length; i < l; i++){
            var path = paths[i];
            var vPathEnd = path[path.length - 1];
            if(vPathEnd === vFind){    // this is already a finished path (ended in vFind)
                newPaths.push(path.slice(0));
                counterAlreadyFoundPaths++;
                continue;
            }
            
            // unfinished graph
            for(var j = 1, lGraph = g.dim; j <= lGraph; j++){
                for(var k = 0, amountEdges = g.get(vPathEnd, j); k < amountEdges; k++){
                    var tmp = path.slice(0);    // return copy of array
                    tmp.push(j);                // would return pushed element
                    newPaths.push(tmp);       // extends amountEdges new paths from vPathEnd to j
                }
                g.set(vPathEnd, j, 0);
            }
        }
        
        if(counterAlreadyFoundPaths === newPaths.length){       // no edges to traverse found => we finished searching
            return newPaths;
        }
        else{
            return g.bfsRec(newPaths, vFind);
        }
    },
    
    log: function(){
        var s = "";
        var dim = this.dim;
        for(var i = 1; i <= dim; i++){
            for(var j = i+1; j <= dim; j++){         // 1,2 1,3 .. 1,n 2,3 ...
                var tmp = this.getUpper(i,j);
                if(tmp > 0){
                    s += i.toString() + "-" + j.toString() + ":" + tmp.toString() + "    ";
                }
            }
        }
        console.log(s);
    }

});