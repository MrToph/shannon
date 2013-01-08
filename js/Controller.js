Game.Controller = new Class({
    initialize: function(model){
       // init Model
       this.model = model;
       this.running = false;
       this.isHuman1 = true;
       this.isHuman2 = false;
       this.p1Turn = true;
       
       // representation is a global var
       representation.addEvent('endLevelAnimFinished', this.onEndLevelAnimFinished.bind(this));
       representation.addEvent('nextLevelAnimFinished', this.onNextLevelAnimFinished.bind(this));

    },
    
    initLevel: function(graphAsStringRepres){
        this.model.initLevel(graphAsStringRepres);
        this.setUrl(this.model.curLevel.stringRepresentation);
    },
    
    restartLevel: function(isHuman1, isHuman2){
        this.isHuman1 = isHuman1;
        this.isHuman2 = isHuman2;
        this.p1Turn = true;
        this.initLevel(this.model.curLevel.stringRepresentation);
    },
    
    nextLevel: function(){

    },
    
    doMove: function(v1, v2, edgeOpt){               // vertex 1 vertex 2
        if(v1 > v2){
            var tmp = v2;
            v2 = v1;
            v1 = tmp;
        }
        
        if(! this.isValidMove(v1,v2,this.p1Turn)){
            return false;
        }
        
        // valid move => do it
        if(this.p1Turn){
            this.model.join(v1,v2);
            representation.markEdge(v1,v2,edgeOpt);
            representation.renameModels(v1, v2);
        }
        else{
            this.model.cut(v1,v2);
            representation.cutEdge(v1,v2,edgeOpt);
        }
        
        // set up next players turn
        this.p1Turn = !this.p1Turn;
    },
    
    isValidMove: function(v1, v2, p1Turn){
        if(this.model.curLevel.graph.get(v1,v2) > 0){
            return true;
        }
        return false;
    },
    
    setUrl: function(s){
        window.location.hash = s;  
    },
    
    onEndLevelAnimFinished: function(){     // this points to representation
        // ... do something
        
        representation.nextLevelAnim();
    },
    
    onNextLevelAnimFinished: function(){    // this points to representation
          this.running = true;
    }
});