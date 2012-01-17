// text editor controller
// Responsible for handling user events from view
// Written by: David Zhang

//TODO: 
//	Replace capslock key with search function?
//	set style cursor: text when over text, pointer when over picture

/************** OBJECT DECLARATION *******************/
var Controller = function(model)
{    
    // get the view
	this.model = model;
	// store if pointer has moved since last frame refresh
	this.pointerMoved = false;
	// store if pointer has moved since last frame refresh
	this.capsLock = false;

	// stores pointer data
	this.pX = 0;
	this.pY = 0;
    
    // add input event listeners
	
    this.mouseDownHandler = this.mouseDown.bind(this);
    layers.topContext.canvas.addEventListener("mousedown", this.mouseDownHandler, false);
    
    this.mouseUpHandler = this.mouseUp.bind(this);
	layers.topContext.canvas.addEventListener("mouseup", this.mouseUpHandler, false);
    
    this.mouseMoveHandler = this.mouseMove.bind(this);
    layers.topContext.canvas.addEventListener("mousemove", this.mouseMoveHandler, false);
    
    //this.mouseWheelHandler = this.mouseWheel.bind(this);
    //window.addEventListener("mousewheel", this.mouseWheelHandler, false);

	this.keyDownHandler = this.keyDown.bind(this);
	layers.topContext.canvas.addEventListener("keydown", this.keyDownHandler, false);

	this.keyUpHandler = this.keyUp.bind(this);
	layers.topContext.canvas.addEventListener("keyup", this.keyUpHandler, false);

	this.keyPressHandler = this.keyPress.bind(this);
	layers.topContext.canvas.addEventListener("keypress", this.keyPressHandler, false);

	// setup timer for frame refresh
	var fps = 30;	// frames per second
	setInterval(this.frameRefresh.bind(this), 1000/fps);
};

/************** EVENT HANDLERS *******************/
Controller.prototype.mouseDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
	this.click = true;
	this.model.updateClick(this.pX, this.pY);
	// TODO: setup timer for menu popup
};

Controller.prototype.mouseUp = function(e)
{
	this.click = false;
	this.model.stopDrag(this.pX, this.pY);
};

Controller.prototype.mouseMove = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
	this.pointerMoved = true;	// set flag to indicate pointer has changed
};

Controller.prototype.mouseWheel = function(e)
{
	// we actually want to take advantage of scroll
    //e.preventDefault();
	this.model.updateScroll();
};

Controller.prototype.frameRefresh = function()
{
	// if pointer is moving while the mouse is held down, it's highlighted
	if(this.pointerMoved) {
		if(this.click) {
			this.model.updateDrag(this.pX, this.pY);
		} else {
			this.model.updateMove(this.pX, this.pY);
		}
		this.pointerMoved = false;	// reset pointer moved flag
	}
};

/************** KEYBOARD FUNCTIONS *******************/
Controller.prototype.processKey = function(keyCode, shiftKey, ctrlKey, altKey, metaKey)
{
	// we treat control and command key the same
	var ctrl = ctrlKey || metaKey;
	var text;

	// CTRL key combos
	if (ctrl && !shiftKey && !altKey)
	{
		switch(keyCode)
		{
			case 65:	// CTRL-A
				break;
			case 69:	// CTRL-E
				break;	
			case 37:	// CTRL-LEFT
				break;	
			case 39:	// CTRL-RIGHT
				break;
			case 67:	// CTRL-C
				console.debug("copy");
				break;
			case 86:	// CTRL-V
				console.debug("paste");
				break;	
			case 88:	// CTRL-X
				console.debug("cut");
				break;
			case 90:	// CTRL-Z
				console.debug("undo");
				break;
			case 82:	// CTRL-R
			case 89:	// CTRL-Y
				console.debug("redo");
				break;
		}
	}
	// check for numpad keys
	else if(keyCode >= 91 && keyCode <= 111)
	{
	}
	// check for special keys
	else if(keyCode >= 219 && keyCode <= 222)
	{
	}
	// check for special keys
	else if(keyCode >= 186 && keyCode <= 192)
	{
	}
	// check if the keycode is a normal character
	else if(keyCode >= 48 && keyCode <= 90)
	{
		if(isWebKit) {
			text = String.fromCharCode(keyCode);
			// set text to correct state depends on keys
			if(shiftKey || this.capsLock) {
				text = text.toUpperCase(text);
			} else {
				text = text.toLowerCase(text);
			}
			//console.debug("%s key pressed", text);
			this.model.insertChar(text);
		}
	}
	// other special keys
	else
	{
		switch(keyCode)
		{
			case 8:		// Backspace
				console.debug("backspace");
				this.model.backspace();
				break;
			case 9:		// tab
				console.debug("tab");
				break;
			case 13:	// enter
				console.debug("enter");
				break;
			case 20:	// caps lock
				this.capsLock = true;
				console.debug("caps lock");
				break;
			case 46:	// delete
				console.debug("delete");
				break;
			case 33:	// page up
				console.debug("page up");
				break;
			case 34:	// page down
				console.debug("page down");
				break;
			case 32:
				this.model.insertChar(" ");
				break;
		}
	}
};


/************** EVENT HANDLERS *******************/
Controller.prototype.keyDown = function(e)
{
    e.preventDefault();
	this.processKey(e.keyCode, e.shiftKey, e.ctrlKey, e.altKey, e.metaKey);
};

Controller.prototype.keyUp = function(e)
{
    e.preventDefault();
	if(e.keyCode == 20) {
		this.capsLock = false;
		console.debug("caps unlock");
	}
};

Controller.prototype.keyPress = function(e)
{
    e.preventDefault();
	// NOTE: this is used in Mozilla to determine caps of keys
	if(isMozilla) {
		var text;
		if (e.which == null) {
			text = String.fromCharCode(e.keyCode) // IE
		} else if (e.which!=0 && e.charCode!=0) {
			text = String.fromCharCode(e.which)   // the rest
		} else {
			text = null // special key
		}

		//console.debug("%s key pressed", text);
		this.model.insertChar(text);
	}
};

