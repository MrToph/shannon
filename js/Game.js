Game.Game = new Class({
    initialize: function(initGraphRepresentation){
        this.levels = [];
        this.initLevels();
        
        this.curLevelIndex = 0;
        if(Game.Game.isValidGraphString(initGraphRepresentation)){
            this.curLevel = new Game.Level(initGraphRepresentation);
        }
        else{
            this.curLevel = new Game.Level(this.levels[this.curLevelIndex]);
        }
        //this.player = new Game.Player();
        
    },
    
    initLevels: function(){
        var i = 0;
        this.levels[i++] = "3;6;4;0";
        
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

Game.Game.isValidGraphString = function(s){   
    s = Game.Game.standarizeGraphString(s);
    
    var arr = s.split(";");
    if(arr.length < 1){
        return false;
    }
    var dim = parseInt(arr[0], 10);
    if((arr.length-1) != ((dim+1)*dim)/2 - dim){     // symmetric and no diagonal (-dim)
        //console.log("in Level:decodeStringToGraph: sizes do not match. Expected: " + ( ((dim+1)*dim)/2 - dim) + "got: " + (arr.length-1));
        return false;
    }

    return true;
};

Game.Game.standarizeGraphString = function(s){
    s = s.replace(/ /g, "");    // remove all whitespaces
    while(s.charAt(s.length - 1) == ";") s = s.slice(0, -1);        // remove ending in ;;;;;
    var arr = s.split(";");
    
    for(var c = 0, l = arr.length; c < l; c++){
        if(isNaN(parseInt(arr[c]))){
            arr[c] = "";
        }
        else{
            arr[c] = parseInt(arr[c], 10).toString();
        }
    }
    
    return arr.join(";");
};
