var ThreeHelper = {
	renderer: null,
	width: window.innerWidth,
	height: window.innerHeight,
	aspectRatio: this.width / this.height,
	initialize: function () {
		try {
			this.renderer = new THREE.WebGLRenderer();
		}
		catch (exception) {
			this.renderer = new THREE.CanvasRenderer();
		}
		
		this.onResize(null, this);
		window.addEventListener("resize", function (event) {
			this.onResize(event, that);
		}, false);
	},
	onResize: function (event, context) {
		var context = typeof(context) != "undefined" ? context : this;
		context.width = window.innerWidth;
		context.height = window.innerHeight;
		context.aspectRatio = context.width / context.height; 
		context.renderer.setSize(context.width, context.height);
	}
};