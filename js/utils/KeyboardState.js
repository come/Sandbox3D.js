var KeyboardState = function(params) {
	this.initialized = false;

	var params = params || {};

	this.preventDefault = params.preventDefault || false;

	this.keys = { 
	    up: false, down: false, left: false, right: false, escape: false,
	    space: false, enter: false, control: false, alt: false, shift: false,
	    num_0: false, num_1: false, num_2: false, num_3: false, num_4: false, 
	    num_5: false, num_6: false, num_7: false, num_8: false, num_9: false,
	    a: false, b: false, c: false, d: false, e: false, f: false, g: false,
	    h: false, i: false, j: false, k: false, l: false, m: false, n: false,
	    o: false, p: false, q: false, r: false, s: false, t: false, u: false,
	    v: false, w: false, x: false, y: false, z: false, 
	    k_0: false, k_1: false, k_2: false, k_3: false, k_4: false, 
	    k_5: false, k_6: false, k_7: false, k_8: false, k_9: false
	};    

	this.initialize();
};

KeyboardState.prototype.initialize = function () {
	if (!this.initialized) {
	  this.initialized = true;
	  var that = this;
	  window.addEventListener("keydown", function (e) { that.onKeyboardStateChange(e, that); }, false);
	  window.addEventListener("keyup", function (e) { that.onKeyboardStateChange(e, that); }, false);
	}
};

KeyboardState.prototype.destroy = function () {
	if (this.initialized) {
	  this.initialized = false;
	  var that = this;
	  window.removeEventListener('keydown', function (e) { that.onKeyboardStateChange(e, that); });
	  window.removeEventListener('keyup', function (e) { that.onKeyboardStateChange(e, that); });
	}
};

KeyboardState.prototype.onKeyboardStateChange = function (event, context) {
	
	if (context.preventDefault) {
	  event.preventDefault();
	}

	var pressed = event.type == "keydown" ? true : false;

	switch (event.keyCode)
	{
		case 13: context.keys.enter = pressed; break; // Entrer
		case 16: context.keys.shift = pressed; break; // Shift    
		case 17: context.keys.control = pressed; break; // Control
		case 18: context.keys.alt = pressed; break; // Alt                        
		case 27: context.keys.escape = pressed; break; // Escape
		case 32: context.keys.space = pressed; break; // Espace
		case 37: context.keys.left = pressed; break; // Gauche
		case 38: context.keys.up = pressed; break; // Haut
		case 39: context.keys.right = pressed; break; // Droite
		case 40: context.keys.down = pressed; break; // Bas
		case 48: context.keys.k_0 = pressed; break; // Touche 0
		case 49: context.keys.k_1 = pressed; break; // Touche 1
		case 50: context.keys.k_2 = pressed; break; // Touche 2
		case 51: context.keys.k_3 = pressed; break; // Touche 3
		case 52: context.keys.k_4 = pressed; break; // Touche 4
		case 53: context.keys.k_5 = pressed; break; // Touche 5
		case 54: context.keys.k_6 = pressed; break; // Touche 6
		case 55: context.keys.k_7 = pressed; break; // Touche 7
		case 56: context.keys.k_8 = pressed; break; // Touche 8
		case 57: context.keys.k_9 = pressed; break; // Touche 9
		case 65: context.keys.a = pressed; break; // Touche A
		case 65: context.keys.b = pressed; break; // Touche B
		case 65: context.keys.c = pressed; break; // Touche C
		case 68: context.keys.d = pressed; break; // Touchd D
		case 69: context.keys.e = pressed; break; // Touche E
		case 70: context.keys.f = pressed; break; // Touche F
		case 71: context.keys.g = pressed; break; // Touche F
		case 72: context.keys.h = pressed; break; // Touche F
		case 73: context.keys.i = pressed; break; // Touche F
		case 74: context.keys.j = pressed; break; // Touche F
		case 75: context.keys.k = pressed; break; // Touche F
		case 76: context.keys.l = pressed; break; // Touche F
		case 77: context.keys.m = pressed; break; // Touche F
		case 78: context.keys.n = pressed; break; // Touche F
		case 79: context.keys.o = pressed; break; // Touche F
		case 80: context.keys.p = pressed; break; // Touche F
		case 81: context.keys.q = pressed; break; // Touche Q
		case 82: context.keys.r = pressed; break; // Touche R
		case 83: context.keys.s = pressed; break; // Touche S
		case 84: context.keys.t = pressed; break; // Touche T
		case 85: context.keys.u = pressed; break; // Touche U
		case 86: context.keys.v = pressed; break; // Touche V
		case 87: context.keys.w = pressed; break; // Touche W
		case 88: context.keys.x = pressed; break; // Touche X
		case 89: context.keys.y = pressed; break; // Touche Y
		case 90: context.keys.z = pressed; break; // Touche Z
		case 96: context.keys.num_0 = pressed; break; // Pad 0
		case 97: context.keys.num_1 = pressed; break; // Pad 1 
		case 98: context.keys.num_2 = pressed; break; // Pad 2
		case 99: context.keys.num_3 = pressed; break; // Pad 3
		case 100: context.keys.num_4 = pressed; break; // Pad 4
		case 101: context.keys.num_5 = pressed; break; // Pad 5
		case 102: context.keys.num_6 = pressed; break; // Pad 6
		case 103: context.keys.num_7 = pressed; break; // Pad 7
		case 104: context.keys.num_8 = pressed; break; // Pad 8
		case 105: context.keys.num_9 = pressed; break; // Pad 9
	}
};

KeyboardState.prototype.pressed = function (key) {
	return this.keys[key];
};
