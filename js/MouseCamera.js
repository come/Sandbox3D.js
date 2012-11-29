var MouseCamera = {};

(function () {
    var that;

    // La caméra tournera autour de l'objet et fixera son centre
    // Typiquement c'est la scène
    MouseCamera = function (params) {
        this.lookAtPosition = params.lookAtPosition || new THREE.Vector3();
        this.renderer = params.renderer;
        this.scene = params.scene;
        this.camera = params.camera;
        this.mouse = params.mouseState;
        this.input = params.keyboardState;
        this.enabled = true;
        this.initialized = false;
        this.force = false;
        this.positionOffset = {
            x: 0,
            y: 0,
            z: 0
        };

        var buttonsMap = params.buttonsMap || {};
        this.buttonsMap = {
            move: buttonsMap.move || 1,
            rotate: buttonsMap.rotate || 0
        };

        this.theta = 0;
        this.radius = 700;

        this.lookPoint = {
            x: lookAtPosition.x,
            y: lookAtPosition.y,
            z: lookAtPosition.z
        };

        this.phi = {
            value: 35,
            min: 2,
            max: 180
        };

        this.zoom = {
            min: 50,
            max: 1500,
            speed: 25
        };

        this.animation = {
            leftRight: false,
            topBottom: false,
            angle: 180,
            speed: {
                leftRight: 5,
                topBottom: 5
            }
        };

        this.animationTarget = {
            leftRight: -1,
            topBottom: -1
        };

        this.animationStep = {
            leftRight: 4,
            topBottom: 4
        };

        that = this;

        this.reset = false;
        this.reactive();
    }

    MouseCamera.prototype.reactive = function () {
        if (!this.initialized) {
            this.initialized = true;
            this.renderer.domElement.addEventListener("mousewheel", this.onMouseWheel, false);
            this.renderer.domElement.addEventListener("DOMMouseScroll", this.onMouseWheel, false);
        }

        this.enabled = true;
        this.resetControl();
    }

    MouseCamera.prototype.destroy = function () {
        if (this.initialized) {
            this.initialized = false;
            this.renderer.domElement.removeEventListener("mousewheel", this.onMouseWheel);
            this.renderer.domElement.removeEventListener("DOMMouseScroll", this.onMouseWheel);
        }
        this.enabled = false;
    }

    MouseCamera.prototype.onMouseWheel = function (event) {
        var wheel = (event.wheelDelta || -event.detail);
        var delta = Math.max(-1, Math.min(1, wheel));
        that.mouse.wheelDelta = delta;

        that.setZoom(delta);
    }

    MouseCamera.prototype.resetControl = function () {
        this.theta = 0;
        this.phi.value = 45;
        this.radius = 700;
        this.animation.leftRight = false;
        this.reset = false;
        this.updateCameraPosition();
    }

    MouseCamera.prototype.rotateLeft = function () {
        this.animation.leftRight = true;
        this.animationTarget.leftRight = this.theta - this.animation.angle;
        this.animationStep.leftRight = -this.animation.speed.leftRight;
    }

    MouseCamera.prototype.rotateRight = function () {
        this.animation.leftRight = true;
        this.animationTarget.leftRight = this.theta + this.animation.angle;
        this.animationStep.leftRight = this.animation.speed.leftRight;
    }

    MouseCamera.prototype.rotateUp = function () {
        this.animation.topBottom = true;

        if (this.phi.value == 0) {
            this.animationTarget.topBottom = 90;
        }
        else {
            this.animationTarget.topBottom = 180;
        }

        this.animationStep.topBottom = this.animation.speed.topBottom;
    }

    MouseCamera.prototype.rotateDown = function () {
        this.animation.topBottom = true;

        if (this.phi.value == 180) this.animationTarget.topBottom = 90;
        else this.animationTarget.topBottom = 0;

        this.animationStep.topBottom = -this.animation.speed.topBottom;
    }

    MouseCamera.prototype.setZoom = function (zoom) {
        if (this.radius - zoom * this.zoom.speed > this.zoom.min && this.radius - zoom * this.zoom.speed < this.zoom.max) {
            this.radius -= zoom * this.zoom.speed;
        }
    }

    MouseCamera.prototype.applyZoom = function (zoom, deltaTime) {
        this.setZoom(-zoom * 0.6, deltaTime);
    }

    MouseCamera.prototype.startSimpleAnimation = function () {
        this.animation.leftRight = true;
        this.animationTarget.leftRight = -1;
        this.animationStep.leftRight = 0.5;
    }

    MouseCamera.prototype.stopSimpleAnimation = function () {
        this.animation.leftRight = false;
    }

    MouseCamera.prototype.move = function (direction, deltaTime) {
        switch (direction) {
            case "up":
                this.rotateUp();
                break;
            case "down":
                this.rotateDown();
                break;
            case "left":
                this.rotateLeft();
                break;
            case "right":
                this.rotateRight();
                break;
        }
        this.force = true;
    }

    MouseCamera.prototype.update = function (deltaTime) {
        if (this.enabled) {
            if (this.mouse.drag && (this.mouse.button == this.buttonsMap.rotate || this.mouse.button == this.buttonsMap.move)) {
                if (this.mouse.button == this.buttonsMap.move) {
                    this.phi.value += this.mouse.delta.y / 8;
                    this.theta -= this.mouse.delta.x / 8;
                    this.lookAtPosition.y += this.mouse.delta.y;
                }
                else {
                    this.phi.value += this.mouse.delta.y / 2;
                    this.theta -= this.mouse.delta.x / 2;
                }
            }

            if (this.animation.leftRight) {
                if (!this.force && (this.mouse.button == this.buttonsMap.rotate)) {
                    this.animation.leftRight = false;
                }
                else {
                    if (this.theta == this.animationTarget.leftRight) {
                        this.animation.leftRight = false;
                        this.animationTarget.leftRight = -1;
                        this.force = false;
                    }
                    else {
                        this.theta += this.animationStep.leftRight;
                    }
                }
            }

            else if (this.animation.topBottom) {
                if (!this.force && (this.mouse.button == this.buttonsMap.rotate)) {
                    this.animation.topBottom = false;
                }
                else {
                    if (this.phi.value == this.animationTarget.topBottom) {
                        this.animation.topBottom = false;
                        this.animationTarget.topBottom = -1;
                        this.force = false;
                    }
                    else {
                        this.phi.value += this.animationStep.topBottom;
                    }
                }
            }

            // Determine la valeur minimum ou maximum de l'angle phi utilisé sur Y
            this.phi.value = Math.min(this.phi.max, Math.max(this.phi.min, this.phi.value));

            this.updateCameraPosition();

            if (this.reset) {
                this.resetControl();
            }
            if (this.mouse.button != this.buttonsMap.move) {
                var lookPoint = this.lookAtPosition.clone();
                lookPoint.y = this.lookPoint.y;
                this.camera.lookAt(lookPoint);
            }
        }
    }

    MouseCamera.prototype.updateCameraPosition = function () {
        this.camera.position.x = this.lookAtPosition.x + this.radius * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi.value * Math.PI / 360) + this.positionOffset.x;
        this.camera.position.y = this.lookAtPosition.y + this.lookPoint.y + this.radius * Math.sin(this.phi.value * Math.PI / 360) + this.positionOffset.y;
        this.camera.position.z = this.lookAtPosition.z + this.radius * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi.value * Math.PI / 360) + this.positionOffset.z;

        this.camera.updateMatrix();
    }
})();