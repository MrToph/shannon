Game.Utils = {};
Game.Utils.getVectorByDir = function(v1, v2, dir, segmentsRadius){
    var circleSplitAngle = 2*Math.PI/segmentsRadius;
    var angle = (Math.PI/2) - dir * circleSplitAngle;
    if(angle < 0) angle = 2*Math.PI + angle;
    var dir2 = v1.clone().multiplyScalar(Math.sin(angle)).addSelf(v2.clone().multiplyScalar(Math.cos(angle)));
    return dir2;
};

Game.Utils.arrayShuffle = function(arr){
    var tmp, rand;
    for(var i =0; i < arr.length; i++){
        rand = Number.random(0, arr.length-1);
        tmp = arr[i]; 
        arr[i] = arr[rand]; 
        arr[rand] =tmp;
  }
};

Game.Utils.UrlsPosx    = function(prefix, extension)
{
	return [
		prefix + "posx" + extension,
		prefix + "negx" + extension,
		prefix + "posy" + extension,
		prefix + "negy" + extension,
		prefix + "posz" + extension,
		prefix + "negz" + extension
	];	
};

/**
 * Generate an almost equal probability of numbers from 0 to max
*/
Game.Utils.Random = function(max){			
	return Math.floor(Math.random()*(max+1));	
};

/**
 * Build the urls array for THREEx.SkyMap.buildMesh()
*/
Game.Utils.UrlsPx	= function(prefix, extension)
{
	return [
		prefix + "px" + extension,
		prefix + "nx" + extension,
		prefix + "py" + extension,
		prefix + "ny" + extension,
		prefix + "pz" + extension,
		prefix + "nz" + extension
	];
};
