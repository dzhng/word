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
	settings.template = FourBoxes;

	/*** SETUP VIEW ***/
	// find the correct window size

	this.menuVisible = false;

	/*** MODULES ***/
	// variable deciarations
	this.controller = new Controller(this);								// user input controller
	this.section = new Section(this);									// section object stores all chars in the document
	this.menu = new Menu();												// option selection menu
	this.pages = [];													// array to store all currently viewable window
	this.currentPage = 0;												// currently viewed page, the page to draw

	// setup raphael class for SVG user interaction components
	this.paper = Raphael(overlay, settings.width, settings.height);
	// initialize the text cursor - this is in the model because there'll be only one cursor in the program
	this.cursor = this.paper.rect(0,0, settings.cursor.width, settings.cursor.height)
		.attr({fill: settings.cursorColor}).show();
	
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
	layers.topContext.canvas.focus();
};

/************** BUILTIN FUNCTIONS *******************/
Model.prototype.insertPage = function(index)
{
	// create a new page that's the same as the template page
	var page = new settings.template(this);
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
	page.x = settings.width/2 - page.width/2;
	page.y = pageOffset.top;
	page.visible = true;
};

// redraw the current page, as well as the 2 adjecent pages
Model.prototype.draw = function()
{
	// redraw the current window
	this.pages[this.currentPage].drawBackground();
	this.pages[this.currentPage].drawMain();
	this.pages[this.currentPage].drawMarkup();
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
	settings.width = window.innerWidth;
	settings.height = PAGE_SIZE.height + pageOffset.top + pageOffset.bottom;

	for(context in layers) {
		layers[context].canvas.height = settings.height;
		layers[context].canvas.width = settings.width;
	}

	this.changePage(this.currentPage);
	this.draw();
};

Model.prototype.setText = function(text)
{
	for(var i = 0; i < text.length; i++) {
		this.section.insertChar(text[i], cursor.index);
	}
	// keep inserting new pages until the char can be inserted
	while(this.section.format(0) === false) {
		this.insertPage(this.pages.length);
		//this.changePage(this.pages.length-1);
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
			//this.changePage(this.pages.length-1);
		}

		this.pages[this.currentPage].drawMarkup();
		this.pages[this.currentPage].drawMain();
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
	this.section.format(cursor.index-1);
	this.draw();
	//TODO: Delete all highlighted characters
};

/************** MOUSE HANDLERS *******************/
// called by the controller to update the model and redraw
Model.prototype.updateClick = function(x, y)
{
	this.focus();
	if(this.pages[this.currentPage].isHovering(x, y)) {
		// if the page failed to update click, it didn't select any object. Default to the last char in the section
		if(this.pages[this.currentPage].updateClick(x, y) == false) {
			// if nothing is clicked, then just set the cursor to the last 
			// place in the section. TODO: This behavior might need to be adjusted
			cursor.index = this.section.chars.length;
		}
		// move the cursor to the correct location and set height
		// special case when the cursor needs to be at the end of the last char
		var cx, cy, ch;
		var ch;
		if(cursor.index == this.section.chars.length) {
			ch = this.section.chars[cursor.index-1];
			cx = ch.x+ch.width-settings.cursor.width;
		} else {	// in all other cases, the cursor is in front of the currently selected char
			ch = this.section.chars[cursor.index];
		}
		this.cursor.attr({x:,y:,height:});
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
};

Model.prototype.stopDrag = function(x, y)
{
	this.pages[this.currentPage].stopDrag(x, y);
};

// called when mouse moves
// change poiner highlight as needed
Model.prototype.updateMove = function(x,y)
{
};

Model.prototype.updateScroll = function()
{
};

