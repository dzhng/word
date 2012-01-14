// text editor model
// Keeps track of cursors and pages in document
// Written by: David Zhang
//

// TODO: 
//	Use charcodes (ascii) to get char distance
//	Catagorize width of special characters, e.g. space, ;, ` # @.. etc
//  Use jQuery to manage windows

/************** GOLBAL CONSTNATS *******************/ 
var PPI = 72;												// pixel per inch to calibrate everything to
var PAGE_SIZE = {width: 8.5*PPI, height: 11*PPI};			// size for one page, standard paper size, in inches

/************** GLOBAL VARIABLES *******************/
// initialize the curser at default position, also keeps track of current page, box..etc
var cursor = {section: null, index: 0, x: 0, y: 0, style: new Style("rgb(0,0,0)", "Arial", "Normal", "11", "none", "even")};
		
/************** OBJECT DECLARATION *******************/
var Model = function()
{
	/*** SETUP VIEW ***/
	// find the correct window size
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	console.log("window width: %d, height: %d", this.width, this.height);

	// make background transparent
	this.background = "rgba(255, 255, 255, 0)";

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

	// clear canvas
	this.clear();
	this.menuVisible = false;

	// setup context for drawing
	this.context.textAlign = "left";
	this.context.textBaseline = "alphabetic";

	this.redraw = true;		// determines if the canvas needs to be redrawn

	// setup bing search window
	// TODO: User jQuery for this
	//var search = new SearchWindow(this);

	/*** SETUP CONTROLLER ***/
	// variable deciarations
	this.controller = new Controller(this);								// user input controller
	this.windows = [];													// array to store all currently viewable window
	this.sections = [];													// array to store all sections in document
	this.currentPage = 0;												// currently viewed page, the page to draw
	this.currentWindow = 0;												// currently selected window	
	
	// make the default full page box
	var box = new TextBox(PPI, PPI,	// offset box by 1 inch from page by default;		
					PAGE_SIZE.width - 2*PPI,
					PAGE_SIZE.height - 2*PPI);

	// make new pages and sections
	this.insertPage(0);
	this.newSection(box);
	// change to the newly inserted page
	this.changePage(0);

	// handler to update draws on window resize
	this.updateSize();
	window.onresize = this.updateSize.bind(this);
	// focus on new pages
	this.focus();
};

/************** VIEW FUNCTIONS **************/
Model.prototype.clear = function()
{
	// clear the page canvas of all drawn objects
	this.context.fillStyle = this.background;
	this.context.clearRect(0,0,this.width, this.height);
	this.redraw = true;
};

Model.prototype.focus = function()
{
	this.canvas.focus();
};

/************** BUILTIN FUNCTIONS *******************/
Model.prototype.insertPage = function(index)
{
	var page = new Page(PAGE_SIZE);
	this.windows.splice(index, 0, page);
	this.redraw = true;
};

// make the input page the new center page
Model.prototype.changePage = function(index)
{
	// hide current page
	this.windows[this.currentPage].visible = false;
	// make new page
	this.currentPage = index;
	// make current page in middle of screen, draw left page and right page
	var page = this.windows[this.currentPage];
	page.x = this.width/2 - page.width/2;
	page.visible = true;

	this.redraw = true;
};

// draw the current page, as well as the 2 adjecent pages
Model.prototype.draw = function()
{
	if(this.redraw === true) {
		this.context.save();

		this.clear();
		// redraw the current window
		this.windows[this.currentWindow].draw(this.context);

		this.context.restore();

		this.redraw = false;
	}
};

// Make a new section along with a new box and add to next available page
Model.prototype.newSection = function(box)
{
	var section = new Section(box);

	cursor.section = section;
	cursor.index = 0;
	this.sections.push(section);
	this.windows[this.currentPage].addBox(box);
};

// add a box to continue the current section
Model.prototype.insertBox = function(index)
{
	var box = cursor.section.cloneBox(index);
	this.windows[this.currentPage].addBox(box);
};

// add a new image to the current page
Model.prototype.insertImage = function(image)
{
	this.windows[this.currentPage].addImage(image);
};

// rescale the page to fit on one window
Model.prototype.updateSize = function() 
{
	// find the maximum size of the canavs that would fit on the page
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.canvas.height = this.height;
	this.canvas.width = this.width;
	this.changePage(this.currentPage);
	this.redraw = true;
};

Model.prototype.setText = function(text)
{
	for(var i = 0; i < text.length; i++) {
		this.insertChar(text[i]);
	}
};

/************** KEYBOARD HANDLERS *******************/
Model.prototype.insertChar = function(key)
{
	if(key != null) {
		cursor.section.insertChar(key, cursor.index);
		cursor.section.format(cursor.index-1);
		this.redraw = true;
	}
};

// removes character at the index before it
Model.prototype.backspace = function()
{
	// if index is already at beginning, don't do anything
	if(cursor.index <= 0) {
		return;
	}
	cursor.section.chars.splice(--cursor.index, 1);
	cursor.section.format();
	this.redraw = true;
};

/************** MOUSE HANDLERS *******************/
// called by the controller to update the model and redraw
Model.prototype.updateClick = function(x, y)
{
	this.focus();
	if(this.windows[this.currentWindow].isHovering(x, y)) {
		this.windows[this.currentWindow].updateClick(x, y);
	} else {
		// if nothing else is clicked, toggle menu visibility
		this.menuVisible = !this.menuVisible;
		this.search.visible = this.menuVisible;
		console.log("menu visible status: %d", this.menuVisible);
	}
	this.redraw = true;
};

// Used to drag highlighted text, or highlighted picture
Model.prototype.updateDrag = function(x, y)
{
	this.windows[this.currentWindow].updateDrag(x, y);
	this.redraw = true;
};

Model.prototype.stopDrag = function()
{
	this.windows[this.currentWindow].stopDrag();
	this.redraw = true;
};

// called when mouse moves
// change poiner highlight as needed
Model.prototype.updateMove = function(x,y)
{
};

Model.prototype.updateScroll = function()
{
};

