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
        this.levels[i++] = "3;1;0;2";
        this.levels[i++] = "10;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1";
        
        
    },
    
    initLevel: function(graphAsStringRepres){
        this.curLevel = new Game.Level(graphAsStringRepres);
    },

});