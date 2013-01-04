Game.Game = new Class({
    initialize: function(){
        this.levels = [];
        this.initLevels();
        
        this.curLevelIndex = 0;
        this.curLevel = new Game.Level(this.levels[this.curLevelIndex]);
        //this.player = new Game.Player();
        
    },
    
    initLevels: function(){
        var i = 0;
        this.levels[i++] = "9; 1;1;1;0;0;0;0;0; 0;0;0;0;0;0;1; 1;0;1;1;0;0; 1;0;1;0;1; 0;1;1;1; 1;0;0; 1;0; 0; ";
        
        this.levels[i++] = "2;1";
        this.levels[i++] = "3;1;1;1";
        this.levels[i++] = "3;1;0;2";
        this.levels[i++] = "7; 1;1;1;0;0;0; 0;1;1;0;0; 1;0;1;0; 1;1;0; 0;1; 1;";
        this.levels[i++] = "9; 1;1;1;0;0;0;0;0; 0;0;0;0;0;0;1; 1;0;1;1;0;0; 1;0;1;0;1; 0;1;1;1; 1;0;0; 1;0; 0; ";
        

        



        
    },
    
    initLevel: function(graphAsStringRepres){
        this.curLevel = new Game.Level(graphAsStringRepres);
    },

});