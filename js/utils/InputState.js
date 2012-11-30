var inputState = { 
	x: 0, 
	y: 0, 
	last:  { x: 0, y: 0 },
	delta: { x: 0, y: 0 },
	click: false,
	release: true,
	drag: false,
	updatePositions: function (event) {
		var evt;
		
		if (typeof(event.touches) != "undefined" && event.touches.length > 0) {
			evt = event.touches[0];
		}
		else {
			evt = event;
		}
		
		this.last.x = this.x;
		this.last.y = this.y;
		this.x = evt.pageX;
		this.y = evt.pageY;
	},
	updateClickStates: function (event) {
		
		if (event.type == "mousedown" || event.type == "touchstart") {
			this.click = true;
			this.release = false;
		}
		else if (event.type == "mousemove" || event.type == "touchmove") {
			if (this.click) {
				this.drag = true;
			}
			else {
				this.drag = false;
			}
		}
		else if (event.type == "mouseup" || event.type == "touchend") {
			this.click = false;
			this.release = true;
			this.drag = false;
		}
		else if (event.type == "click") {
			this.click = false;
			this.release = true;
			this.drag = false;
		}
	},
	updateDelta: function () {
		if (this.x == this.last.x) {
			this.delta.x = 0;
		}
		else {
			this.delta.x = (this.x - this.last.x);
		}
		
		if (this.y == this.last.y) {
			this.delta.y = 0;
		}
		else {
			this.delta.y = (this.y - this.last.y);
		}
		
		if (this.delta.x > 100) {
			this.delta.x = 0;
		}
	},
	update: function (event) {
		event.preventDefault();
		this.updatePositions(event);
		this.updateClickStates(event);
		this.updateDelta();
	},
	toString: function () {
		var positions = "POSITIONS:\nx: " + this.x + " | y: " + this.y + "\nlast.x: " + this.last.x + " | last.y: " + this.last.y + "\ndelta.x: " + this.delta.x + " | delta.y: " + this.delta.y;
		var buttons = "BUTTONS:\nclick: " + this.click + " | release: " + this.release + " | drag: " + this.drag;
		
		return ("-------\n" + positions + "\n" + buttons + "\n-------\n");
	}
};