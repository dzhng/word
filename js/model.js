// text editor model
// Keeps track of cursors and pages in document
// Written by: David Zhang

// TODO: 
//	Use charcodes (ascii) to get char distance
//	Catagorize width of special characters, e.g. space, ;, ` # @.. etc
//  Use jQuery to manage windows

/************** OBJECT DECLARATION *******************/
var Model = function()
{
	// set default page template as two columns
	settings.template = TwoColumns;

	/*** SETUP VIEW ***/
	// find the correct window size
	this.width = window.innerWidth;
	this.height = PAGE_SIZE.height;
	console.log("window width: %d, height: %d", this.width, this.height);

	// create a new canvas element per page
	this.canvas = document.createElement('canvas');
	document.body.appendChild(this.canvas);
	this.canvas.height = this.height;
	this.canvas.width = this.width;
	this.canvas.border = "0 px";
	this.canvas.tabIndex = 1;			// make canvas focusable
	this.canvas.style.visibility = "visible";
	this.canvas.style.position = "absolute";
	this.canvas.style.top = 0;
	this.canvas.style.left = 0;
	this.context = this.canvas.getContext("2d");
	settings.mainContext = this.context;

	// clear canvas
	this.context.clearRect(0,0,this.width, this.height);
	this.menuVisible = false;

	// setup context for drawing
	this.context.textAlign = "left";
	this.context.textBaseline = "alphabetic";
	this.context.fillStyle = settings.background;

	/*** SETUP CONTROLLER ***/
	// variable deciarations
	this.controller = new Controller(this);								// user input controller
	this.section = new Section(this);									// section object stores all chars in the document
	this.pages = [];													// array to store all currently viewable window
	this.currentPage = 0;												// currently viewed page, the page to draw
	
	// make new pages
	this.insertPage(0);
	// change to the newly inserted page
	this.changePage(0);

	// handler to update draws on window resize
	this.updateSize();
	window.onresize = this.updateSize.bind(this);
	// focus on new pages
	this.focus();
};

/************** VIEW FUNCTIONS **************/
Model.prototype.focus = function()
{
	this.canvas.focus();
};

/************** BUILTIN FUNCTIONS *******************/
Model.prototype.insertPage = function(index)
{
	// create a new page that's the same as the template page
	var page = new settings.template();
	this.pages.splice(index, 0, page);

	console.log("page inserted, total of %d pages", this.pages.length);
};

// make the input page the new center page
Model.prototype.changePage = function(index)
{
	// hide current page
	this.pages[this.currentPage].visible = false;
	// make new page
	this.currentPage = index;
	// make current page in middle of screen, draw left page and right page
	var page = this.pages[this.currentPage];
	page.x = this.width/2 - page.width/2;
	page.visible = true;

	this.draw();
};

// draw the current page, as well as the 2 adjecent pages
Model.prototype.draw = function()
{
	//console.log("draw called");
	this.context.save();
	this.context.clearRect(0,0,this.width, this.height);

	// redraw the current window
	this.pages[this.currentPage].draw(this.context);
	this.context.restore();
};

// add a box to continue the current page
Model.prototype.insertBox = function(index)
{
	this.pages[this.currentPage].addBox(box);
};

// add a new image to the current page
Model.prototype.insertImage = function(image)
{
	this.pages[this.currentPage].addImage(image);
};

// rescale the page to fit on one window
Model.prototype.updateSize = function() 
{
	// find the maximum size of the canavs that would fit on the page
	this.width = window.innerWidth;
	this.height = PAGE_SIZE.height;
	this.canvas.height = this.height;
	this.canvas.width = this.width;
	this.changePage(this.currentPage);
	this.draw();
};

Model.prototype.setText = function(text)
{
	for(var i = 0; i < text.length; i++) {
		this.section.insertChar(text[i], cursor.index);
		// keep inserting new pages until the char can be inserted
		while(this.section.format(cursor.index-1) === false) {
			this.insertPage(this.pages.length);
			this.changePage(this.pages.length-1);
		}
	}
	this.draw();
};

/************** KEYBOARD HANDLERS *******************/
Model.prototype.insertChar = function(key)
{
	if(key != null) {
		//console.profile();
		this.section.insertChar(key, cursor.index);

		// keep inserting new pages until the char can be inserted
		while(this.section.format(cursor.index-1) === false) {
			this.insertPage(this.pages.length);
			this.changePage(this.pages.length-1);
		}

		this.draw();
		//console.profileEnd();
	}
};

// removes character at the index before it
Model.prototype.backspace = function()
{
	// if index is already at beginning, don't do anything
	if(cursor.index <= 0) {
		return;
	}
	this.section.chars.splice(--cursor.index, 1);
	this.section.format(this.cursor.index-1);
	this.draw();
};

/************** MOUSE HANDLERS *******************/
// called by the controller to update the model and redraw
Model.prototype.updateClick = function(x, y)
{
	this.focus();
	if(this.pages[this.currentPage].isHovering(x, y)) {
		// if the page failed to update click, it didn't select any object. Default to the last char in the section
		if(this.pages[this.currentPage].updateClick(x, y) == false) {
			cursor.index = this.section.chars.length;
		}
		this.draw();
	} else {
		// if nothing else is clicked, toggle menu visibility
		this.menuVisible = !this.menuVisible;
		console.log("menu visible status: %d", this.menuVisible);
	}
};

// Used to drag highlighted text, or highlighted picture
Model.prototype.updateDrag = function(x, y)
{
	this.pages[this.currentPage].updateDrag(x, y);
	this.draw();
};

Model.prototype.stopDrag = function()
{
	this.pages[this.currentPage].stopDrag();
	this.draw();
};

// called when mouse moves
// change poiner highlight as needed
Model.prototype.updateMove = function(x,y)
{
};

Model.prototype.updateScroll = function()
{
};

