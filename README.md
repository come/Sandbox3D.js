Sandbox3D.js
============

A simple sandbox for playing with Three.js

You can use the mouse for moving the camera around the scene with right button and zoom with the wheel button.

The engine use WebGL for rendering but if the browser don't support it, a fallback with a CanvasRenderer is used.

This sandbox can be use on modern browsers (even Intenet Explorer 9)

#### How to use it

```javascript
// Setup the engine
var container = ujs.getById("container");
var engine = new Engine(container);
createScene();

// Your test code in this function
function createScene() {
	// Your code here

	// Create a blue cube and add it to the scene
	var mesh = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshPhongMaterial({ color: 0x008800 }));
	engine.scene.add(mesh); // That's it :)
}

// Main loop
(function mainLoop() {
	requestAnimationFrame(mainLoop);
	engine.update(1);
	engine.draw(1);
})();	
``` 

#### What objects are available ?

```javascript
engine.scene // The scene
engine.camera // The camera 
engine.renderer // The default renderer (WebGL or Canvas)
engine.mouseState // Object helper for working with mouse
engine.keyboardState // Object helper for working with keyboard
```

So you've full access to Three.js

### Licence

MIT license, check the license file for more informations