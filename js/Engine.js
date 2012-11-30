var Engine = function (container) {

	this.container = container;

	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.fieldOfView = 60;
	this.aspectRatio = this.width / this.height;
	this.renderer = null;
	this.camera = null;
	this.scene = new THREE.Scene();
	this.mouseCamera = null;
	this.initialized = false;

	try {
		this.renderer = new THREE.WebGLRenderer();
	} 
	catch (exception) {
		this.renderer = new THREE.CanvasRenderer();
	}
		
	this.renderer.setSize(this.width, this.height);
	this.renderer.setClearColorHex(0xffffff, 1);
	this.container.appendChild(this.renderer.domElement);
	
	this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, 1, 5000);
	this.camera.position.set(0, 100, 200);
	this.camera.lookAt(this.scene.position);

	this.mouseState = new MouseState(this.renderer.domElement);
	this.mouseState.startEventListening();

    this.keyboardState = new KeyboardState();   
    
	this.mouseCamera = new MouseCamera({
		scene: this.scene,
		camera: this.camera, 
		lookAtPosition: this.scene.position,
		mouseState: this.mouseState,
		keyboardState: this.keyboardState,
		renderer: this.renderer,
		radius: 200,
		buttonsMap: { move: 1, rotate: 2 }
	});

	this.draggableObjects = [];
	this.dragControls = new THREE.DragControls(this.camera, this.draggableObjects, this.renderer.domElement);
	this.dragControls.constrains("xz");

	this.initialize();
};

Engine.prototype.initialize = function () {
	if (!this.initialized) {
		var that = this;
		window.addEventListener("resize", function (event) { 
			that.width = window.innerWidth;
			that.height = window.innerHeight;
			that.aspectRatio = that.width / that.height;
			that.renderer.setSize(that.width, that.height);
			that.camera.aspect = that.aspectRatio; 
		}, false);

		document.addEventListener("contextmenu", function (event) {
			event.preventDefault();
		}, false);
		this.initialized = true;
	}
};

Engine.prototype.update = function (elapsedTime) {
	this.mouseState.update(elapsedTime);
	this.mouseCamera.update(elapsedTime);
};

Engine.prototype.draw = function (elapsedTime) {
	this.renderer.render(this.scene, this.camera);
};

Engine.prototype.addDraggableObject = function (object) {
	this.draggableObjects.push(object);
	this.scene.add(object);
}

Engine.prototype.repeatTexture = function (texture, x, y) {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.x = 8;
	texture.repeat.y = 8;
	return texture;
};

Engine.prototype.isWebGLAvailable = function () {
	return (this.renderer instanceof THREE.WebGLRenderer);
}