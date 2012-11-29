/** @namespace */
var FirstPersonCamera = {};

FirstPersonCamera = function (camera, input, params) {
	this.camera = camera;
	this.input = input;

	var params = params || {};
	this.moveSpeed = params.moveSpeed || 20;
	this.rotationSpeed = params.rotationSpeed || Math.PI / 8;

	this.enabled = false;

	if (this.camera.position.y < 0) {
		this.camera.position.y = 170;
	}
};

FirstPersonCamera.prototype.changeDomListener = function (domElement) {
	this.enabled = false; // Lock
	this.input.destroy();
	this.input = new Input(domElement);
	this.enabled = true; // Delock
};

FirstPersonCamera.prototype.setPosition = function (newPosition) {
	this.camera.position.x = newPosition.x;
	this.camera.position.y = newPosition.y;
	this.camera.position.z = newPosition.z;
};

FirstPersonCamera.prototype.addPosition = function (newPosition) {
	this.camera.position.x += newPosition.x;
	this.camera.position.y += newPosition.y;
	this.camera.position.z += newPosition.z;
};

FirstPersonCamera.prototype.rotateLeft = function (deltaTime) {
	this.camera.rotation.y += this.rotationSpeed * deltaTime;
};

FirstPersonCamera.prototype.rotateRight = function (deltaTime) {
	this.camera.rotation.y -= this.rotationSpeed * deltaTime;
};

FirstPersonCamera.prototype.applyZoom = function (zoom, deltaTime) {
	this.camera.position.y -= zoom * deltaTime;
};

FirstPersonCamera.prototype.move = function (direction, deltaTime, callback) {
	var position = {
		x: 0,
		y: 0,
		z: 0
	};

	// Avancer / reculer
	if (direction == "up") {
		position.x -= Math.sin(-this.camera.rotation.y) * -this.moveSpeed * deltaTime;
		position.z -= Math.cos(-this.camera.rotation.y) * this.moveSpeed * deltaTime;
	}
	else if (direction == "down") {
		position.x -= Math.sin(this.camera.rotation.y) * -this.moveSpeed * deltaTime;
		position.z += Math.cos(this.camera.rotation.y) * this.moveSpeed * deltaTime;
	}

	// Pas de côté
	if (direction == "left") {
		position.x -= Math.cos(this.camera.rotation.y) * this.moveSpeed * deltaTime;
		position.z += Math.sin(this.camera.rotation.y) * this.moveSpeed * deltaTime;
	}
	else if (direction == "right") {
		position.x += Math.cos(this.camera.rotation.y) * this.moveSpeed * deltaTime;
		position.z -= Math.sin(this.camera.rotation.y) * this.moveSpeed * deltaTime;
	}

	if (typeof (callback) != "undefined" && callback != null) {
		callback(direction, position);
	}

	this.addPosition(position);
};

FirstPersonCamera.prototype.update = function (deltaTime) {
	if (this.enabled) {
		var delta = deltaTime * 0.01;

		if (this.input.keys.up || this.input.keys.z) {
			this.move("up", delta);
		}
		else if (this.input.keys.down || this.input.keys.s) {
			this.move("down", delta);
		}

		if (this.input.keys.left) {
			this.rotateLeft(delta);
		}
		else if (this.input.keys.right) {
			this.rotateRight(delta);
		}

		if (this.input.keys.q) {
			this.move("left", delta);
		}
		else if (this.input.keys.d) {
			this.move("right", delta);
		}

		if (this.input.keys.a) {
			this.camera.position.y += this.moveSpeed / 2 * delta;
		}
		else if (this.input.keys.e && this.camera.position.y > 25) {
			this.camera.position.y -= this.moveSpeed / 2 * delta;
		}

		if (this.camera.position.y < 10) {
			this.camera.position.y = 10;
		}
		else if (this.camera.position.y > 225) {
			this.camera.position.y = 225;
		}
	}
};

FirstPersonCamera.prototype.reactive = function () {
	this.camera.position.set(0, 170, 0);
	this.camera.rotation.set(0, 0, 0);
	this.input.initialize();
	this.enabled = true;
};

FirstPersonCamera.prototype.destroy = function () {
	this.input.destroy();
	this.enabled = false;
};
