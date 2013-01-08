Game.Graph = new Class({            // represents a graph as an adjacency matrix. The graph is symmetric, so we can save some space, if we only store a (upper) triangular matrix.
    initialize: function(amountOfVertices){
        this.dim = amountOfVertices;
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
        g.g = this.g.slice();       // copy whole array
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
        
        
    },
    
    cut: function(v1,v2){
        this.setUpper(v1, v2, this.getUpper(v1,v2)-1);
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