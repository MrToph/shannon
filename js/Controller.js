Game.Controller = new Class({
    initialize: function(model){
       // init Model
       this.model = model;
       this.running = false;
       this.isHuman1 = true;
       this.isHuman2 = false;
       
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
        this.initLevel(this.model.curLevel.stringRepresentation);
    },
    
    nextLevel: function(){

    },
    
    doMove: function(v1, v2){               // vertex 1 vertex 2
        // is a valid move?
        
        // valid move => do it
        
        // set up next players turn
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