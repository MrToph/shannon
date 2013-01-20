Game.Controller = new Class({
    initialize: function(model){
       // init Model
       this.model = model;
       this.gameOver = false;
       this.isHuman1 = true;
       this.isHuman2 = false;
       this.p1Turn = true;
       
       // representation is a global var
       representation.addEvent('endLevelAnimFinished', this.onEndLevelAnimFinished.bind(this));
       representation.addEvent('nextLevelAnimFinished', this.onNextLevelAnimFinished.bind(this));

    },
    
    initLevel: function(graphAsStringRepres){
        this.p1Turn = true;
        this.gameOver = false;
        this.model.initLevel(graphAsStringRepres);
        this.setUrl(this.model.curLevel.stringRepresentation);
        
        // next move if ai is first player is done in main.restartGame
    },
    
    restartLevel: function(isHuman1, isHuman2){
        this.isHuman1 = isHuman1;
        this.isHuman2 = isHuman2;
        
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
        
        if(this.gameOver || !this.isValidMove(v1,v2,this.p1Turn)){
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
        
        var over = this.model.curLevel.graph.getWinner(v1, v2, this.p1Turn);
        if(over !== 0){
            this.gameOver = true;
            if(over === 1){ // join won
                console.log("JOIN WIN");
            }
            else{
                console.log("CUT WIN");
            }
            representation.endLevelAnim(over);
        }
        
        // set up next players turn
        this.p1Turn = !this.p1Turn;
        
        if(this.p1Turn){
            if(!this.isHuman1){ // do AI join move
                var moves = Game.AI.getJoinMove(this.model.curLevel.graph.clone());
                this.doMove(moves[0], moves[1]);
            }
        }
        else{
            if(!this.isHuman2){ // do AI cut move
                var moves = Game.AI.getCutMove(this.model.curLevel.graph.clone());
                this.doMove(moves[0], moves[1]);
            }
        }
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
        
        window.setTimeout(representation.nextLevelAnim, Game.NEXTLVLTIMEOUT);
    },
    
    onNextLevelAnimFinished: function(){    // this points to representation
          this.gameOver = false;
    }
});