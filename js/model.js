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
	this.mode = "edit";	// 3 modes: edit, layout, collaborate

	/*** MODULES ***/
	// variable deciarations
	this.controller = new Controller(this);								// user input controller
	this.section = new Section(this);									// section object stores all chars in the document
	this.menu = new Menu();												// option selection menu
	this.pages = [];													// array to store all currently viewable window
	this.currentPage = 0;												// currently viewed page, the page to draw

	// initialize the text cursor - this is in the model because there'll be only one cursor in the program
	var anim = Raphael.animation({opacity:0}, 800, '>').repeat(Infinity);
	this.cursor = paper.rect(0,0, settings.cursor.width, settings.cursor.height)
		.attr({"stroke-width": 0, fill: settings.cursorColor, opacity:1})
		.animate(anim).show();
	
	// make new pages
	this.insertPage(0);
	// change to the newly inserted page
	this.changePage(0);

	// make menu invisible by default
	this.menuVisible = false;

	/*** SETUP VIEW ***/
	// find the correct window size
	this.updateSize();

	// handler to update draws on window resize
	window.onresize = this.updateSize.bind(this);

	// focus on new pages
	this.focus();
};

/************** VIEW FUNCTIONS **************/
Model.prototype.focus = function()
{
	overlay.focus();
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

// redraw everything
Model.prototype.draw = function()
{
	// keep inserting new pages until the char can be inserted
	while(this.section.format(0) === false) {
		this.insertPage(this.pages.length);
		//this.changePage(this.pages.length-1);
	}

	// redraw the current window
	this.pages[this.currentPage].drawBackground();
	this.pages[this.currentPage].drawMain();
	this.pages[this.currentPage].drawMarkup();
	this.drawCursor();
};

// update the location of the cursor
Model.prototype.drawCursor = function()
{
	// move the cursor to the correct location and set height
	// special case when the cursor needs to be at the end of the last char
	var ch;
	var cx, cy, height;

	// if no chars on the document yet, draw at box
	if(this.section.chars.length == 0) {
		cx = this.pages[this.currentPage].boxes[0].getAbsolute().x-settings.cursor.width/2;
		cy = this.pages[this.currentPage].boxes[0].getAbsolute().y;
		height = cursor.style.height;
	} else if(cursor.index == this.section.chars.length) {	// if there are chars there, draw in front of char
		ch = this.section.chars[cursor.index-1];
		cx = ch.getAbsolute().x+ch.width-settings.cursor.width/2;
		cy = ch.getAbsolute().y-ch.height+(ch.style.margin._bottom*ch.style.size);
		height = ch.height;
	} else {	// in all other cases, the cursor is in front of the currently selected char
		ch = this.section.chars[cursor.index];
		cx = ch.getAbsolute().x-settings.cursor.width/2;
		cy = ch.getAbsolute().y-ch.height+(ch.style.margin._bottom*ch.style.size);
		height = ch.height;
	}
	this.cursor.attr({x:cx, y:cy, height:height});
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
		this.drawCursor();
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
	this.pages[this.currentPage].drawMarkup();
	this.pages[this.currentPage].drawMain();
	this.drawCursor();
	//TODO: Delete all highlighted characters
};

/************** MOUSE HANDLERS *******************/
// called by the controller to update the model and redraw
Model.prototype.updateClick = function(x, y)
{
	this.focus();
	if(this.pages[this.currentPage].isHovering(x, y)) {
		switch(this.mode) {
		case "edit":
			// if the page failed to update click, it didn't select any object. Default to the last char in the section
			if(this.pages[this.currentPage].updateClick(x, y) == false) {
				// if nothing is clicked, then cursor doesn't change
				// TODO: This behavior might need to be adjusted
			}
			this.drawCursor();
			break;
		}
	} else {
		// if nothing else is clicked, toggle menu visibility
		this.menuVisible = !this.menuVisible;
		if(this.menuVisible) {
			this.pages[this.currentPage].showLayoutMenu();
			this.mode = "layout";
		} else {
			this.pages[this.currentPage].hideLayoutMenu();
			this.mode = "edit";
		}
		//console.log("menu visible status: %d", this.menuVisible);
	}
};

// Used to drag highlighted text, or highlighted picture
Model.prototype.updateDrag = function(x, y)
{
	this.focus();
	switch(this.mode) {
	case "edit":
		this.pages[this.currentPage].updateDrag(x, y);
		this.drawCursor();
		break;
	}
};

Model.prototype.stopDrag = function(x, y)
{
	this.focus();
	this.pages[this.currentPage].stopDrag(x, y);
	this.drawCursor();
};

// called when mouse moves
// change poiner highlight as needed
Model.prototype.updateMove = function(x,y)
{
};

Model.prototype.updateScroll = function()
{
};

