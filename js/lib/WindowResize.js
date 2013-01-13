// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
WindowResize	= function(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
		representation.renderer.setSize( window.innerWidth, window.innerHeight );
		// update the camera
		representation.camera.aspect	= window.innerWidth / window.innerHeight;
		representation.camera.updateProjectionMatrix();
        
        var winlose = document.getElementById('winlose');
        var width = (window.innerWidth/5.0);
        winlose.style.width = width.toString() + 'px';
        winlose.style.height = (window.innerHeight/5.0).toString() + 'px';
        winlose.style.left = ((window.innerWidth-width)/2).toString() + 'px';
		
		// if(typeof(world) != "undefined")
		// {
		// }
	};
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
};
