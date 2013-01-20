Game.AI = {};
Game.AI.getJoinMove = function(graph){
    var dim = graph.dim;
    for(var i = 1; i <= dim; i++){
        for(var j = i+1; j <= dim; j++){         // 1,2 1,3 .. 1,n 2,3 ...
            if(graph.get(i,j) > 0){
                // 
                return [i, j];
            }
        }
    }
};

Game.AI.getCutMove = function(graph){
    var dim = graph.dim;
    for(var i = 1; i <= dim; i++){
        for(var j = i+1; j <= dim; j++){         // 1,2 1,3 .. 1,n 2,3 ...
            if(graph.get(i,j) > 0){
                // 
                return [i, j];
            }
        }
    }
};