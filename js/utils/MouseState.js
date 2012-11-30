var MouseState = {};

(function() {
  var that;
  
  MouseState = function(domElement, params) 
  {
    this.x = 0;
    this.y = 0;
    this.click = false;
    this.doubleClick = false;
    this.justClicked = false; 
    this.released = true;
    this.justReleased = false;
    this.drag = false;
    this.drop = false;
    this.preventDefault = false;
    this.delta = { x: 0, y: 0 }
    this.realX = 0;
    this.realY = 0;
    this.button = null;
    this.altKey = false;
    this.controlKey = false;
    this.shiftKey = false;
    this.wheelDelta = 0;

    this.lastMouseState = this.clone();
    
    var params = params || {};
    this.domElement = domElement || document.body;
    this.offsets = params.offsets || { x: 0, y: 0 };
    this.width = params.width || this.domElement.clientWidth;
    this.height = params.height || this.domElement.clientHeight;
    
    that = this;
  }  
  
  MouseState.prototype.clone = function()
  {
    var state = {};
    state.delta = {};
    
    state.x               =   this.x;
    state.y               =   this.y;
    state.click           =   this.click;
    state.doubleClick           =   this.doubleClick;
    state.justClicked     =   this.justClicked;
    state.released        =   this.released;
    state.drag            =   this.drag;
    state.drop            =   this.drop;
    state.preventDefault  =   this.preventDefault;
    state.delta.x         =   this.delta.x;
    state.delta.y         =   this.delta.y;
    state.realX           =   this.realX;
    state.realY           =   this.realY;
    state.button          =   this.button;
    state.altKey          =   this.altKey;
    state.controlKey      =   this.controlKey;
    state.shiftKey        =   this.shiftKey;
    state.wheelDelta      =   this.wheelDelta;
    
    return state;
  }
  
  MouseState.prototype.updateRealXY = function (event)
  {
    this.realX = this.getX(event);
    this.realY = this.getY(event);
  }
  
  MouseState.prototype.getX = function(event) 
  {
  	var x = 0;
    
  	if (event.pageX) 
  		x = event.pageX; 
  	else if (event.clientX) 
  		x = event.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft); 
   
  	return x;
  }
  
  MouseState.prototype.getY = function(event) 
  {
    var y = 0;
    
  	if (event.pageY) 
  		y = event.pageY; 
  	else if (event.clientY) 
  		y = event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop); 

    return y;
  }
  
  MouseState.prototype.updateSize = function (width, height)
  {
    this.width = width;
    this.height = height;
  }
  
  // Démarre l'écoute des évenements souris
  MouseState.prototype.startEventListening = function ()
  {
    this.domElement.addEventListener("mousedown", this.onMouseDown, false);
    this.domElement.addEventListener("mousemove", this.onMouseMove, false);
    this.domElement.addEventListener("mouseup", this.onMouseUp, false);
    this.domElement.addEventListener("click", this.onMouseClick, false);
  }
  
  // Arrête l'écoute des évenements souris
  MouseState.prototype.stopEventListening = function ()
  {
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.domElement.removeEventListener("mousemove", this.onMouseMove);
    this.domElement.removeEventListener("mouseup", this.onMouseUp);
    this.domElement.removeEventListener("click", this.onMouseClick);
  }
  
  // Mise à jour de l'objet
  MouseState.prototype.update = function (deltaTime)
  {
    this.justClicked = this.click && this.lastMouseState.released;
    this.justReleased = this.lastMouseState.click && this.released;
    
    if (this.x == this.lastMouseState.x)
      this.delta.x = 0;
    
    if (this.y == this.lastMouseState.y)
      this.delta.y = 0;
    
    this.lastMouseState = this.clone();
  }
  
  MouseState.prototype.updateMouseState = function (event)
  {
    if (that.preventDefault)
      event.preventDefault();
    
    that.doubleClick = false;
    that.button = event.button;
    
    // Hack pour firefox >_<' #FAIL #SCANDAL #VOLEUR #AUSECOUR #ACHETETOIUNINTERPRETEURJS
    if (event.buttons > 0)
    { 
      if (event.buttons == 4)
        that.button = 1;     // Bouton du milieu
      else if (event.buttons == 2)
        that.button = 2;     // Bouton droit
    }
      
    // Ne fonctionne pas sur Firefox pour changer T_T'
    if (that.button == 1) 
      event.preventDefault();
    
    that.altKey = event.altKey;
    that.controlKey = event.ctrlKey;
    that.shiftKey = event.shiftKey;
    
    that.x = ((event.clientX + that.offsets.x) / that.width) * 2 - 1;
		that.y = - ((event.clientY + that.offsets.y) / that.height ) * 2 + 1;
  }
  
  // ---
  // --- Début des traitements des évenements souris
  // ---
  MouseState.prototype.onMouseDown = function (event)
  {
    that.updateMouseState(event); 
    that.click = true;
    that.released = false;
  }
  
  MouseState.prototype.onMouseMove = function (event)
  {
    that.updateMouseState(event);

    that.updateRealXY(event);

    that.delta.x = that.realX - that.lastMouseState.realX;
    that.delta.y = that.realY - that.lastMouseState.realY;
    
    if (that.click)
      that.drag = true;
  }
  
  MouseState.prototype.onMouseUp = function (event)
  {
    that.updateMouseState(event);
    that.click = false;
    that.released = true;
    that.drag = false;
  }
  
  MouseState.prototype.onMouseClick = function (event)
  { 
    that.updateMouseState(event);
    that.released = true;
    that.drag = false;
    that.click = false;
  }

  MouseState.prototype.onMouseDoubleClick = function (event)
  {
    that.updateMouseState(event);
    that.click = false;
    that.doubleClick = true;
  }
  // --- Fin des évenements souris
})();