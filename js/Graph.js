Game.Graph = new Class({            // represents a graph as an adjacency matrix. The graph is symmetric, so we can save some space, if we only store a (upper) triangular matrix.
    initialize: function(amountOfVertices){
        this.dim = amountOfVertices;
        this.g = new Array((this.dim*(this.dim+1)) /2);
        for(var i = 0, l = this.g.length; i < l; i++){
            this.g[i] = 0;      // initialize with 0
        }
    },
    
    get: function(i, j){
        //A[i*(i+1)/2+j] i > j
        i--;j--;    // graph starts intern at 0,0 not at 1,1
        if(i<=j){
            return this.g[(j*(j+1))/2 + i];   
        }
        else{
            return this.g[(i*(i+1))/2 + j];   
        }
    },
    
    set: function(i, j, val){
        i--;j--;    // graph starts intern at 0,0 not at 1,1
        if(i<=j){
            this.g[(j*(j+1))/2 + i] = val;   
        }
        else{
            this.g[(i*(i+1))/2 + j] = val;   
        }
    },
    
    clone: function(){
        // dirty, because we can't overload constructors/no polymorphism
        var g = new Game.Graph(0);
        g.dim = this.dim;
        g.g = this.g.slice();       // copy whole array
        return g;
    },

});