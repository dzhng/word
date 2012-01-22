// text editor text box
// Keep tracks of all the snippets in the box, insert, select, make new snippets as needed
// Written by: David Zhang

// TODO: 
// need a minimum box size, and use that as the size to start chopping up word
// add support for return character to make new lines
//
// NOTE:
// remember to remove the layout SVG elements when destorying the box

/************** OBJECT DECLARATION *******************/
var TextBox = function(x, y, Width, Height, Page)
{
	// the page this box belongs to
	this.parent = Page;

	// save the point of this box in page coordinates
	this.setPoint(x, y);

	// save the size of this box
	this.width = Width;
	this.height = Height;
	this.curHeight = 0;		// total height of all current lines in the box

	// stores if the size of this text box is fixed
	// unfixed textboxes will expand down until end of page
	this.fixed = true;
	this.stopDistance = PPI;	// distance from bottom of the page to stop expanding (margin)

	// buffer to stores all the lines of text in the box
	this.lines = [];
	// stores the range of section chars currently within this box
	this.index = {start:0, end:0};
	
	// size adjuster handles, start as null since we want to make it as needed
	this.layoutRect = null;
	this.layoutHandles = {top: null, bottom: null, left: null, right: null};

	// hide layout by default
	this.hideLayout();

	// start with one line
	this.reset();
};

// Inherit prototypes from Window object
TextBox.prototype = new cObject;

/************** BUILTIN FUNCTIONS *******************/
TextBox.prototype.reset = function()
{
	this.lines = [];	// empty current line array
	this.curHeight = 0;	// reset current line height

	// add new line
	var line = new TextLine(this);
	line.setPoint(0, this.curHeight);
	this.lines.push(line);
};

// add word to current textbox, return true on success, false on fail
// the algorithm is keep adding words to the current line, until
// the line returns a false from either running into obsticles or its full
// function returns the index where it ends
// start: the starting index of the text box
// index: the current position of new data, everything before this index can be left alone
TextBox.prototype.setChar = function(chars, start, index)
{
	// reset textbox
	var curLine = 0;
	// counter
	var ch = start;
	this.index.start = start;

	// chars in a word
	var word = [];
	// word size
	var width = 0;
	var height = 0;
	// length of current line
	var lineWidth = 0;

	this.reset();	// reset the box at the beginning means format this box from scratch

	while(ch < chars.length) {
		// set index first so it can be refered back later
		chars[ch].index = ch;
		// push into word
		word.push(chars[ch]);
		width += chars[ch].width;
		height = Math.max(chars[ch].height, height);
		// if space encountered, word found
		if(chars[ch].letter == ' ' || ch == chars.length-1) {

			// keep trying until the word is added in
			while(word.length != 0) {
				// check if the current line needs to be resized
				var newPos = this.parent.checkObsticle(this.x, this.y+this.curHeight, 
							this.width, Math.max(this.lines[curLine].height, height));
				this.lines[curLine].x = newPos.nX - this.x;
				lineWidth = newPos.nWidth;

				// if can't add to this line, make a new line
				if(this.lines[curLine].width + width < lineWidth) {
					// check if this word will fit
					if((this.curHeight + height) > this.height) {
						// return the beginning of the current line
						var lline = this.lines.pop();
						var idx = lline.chars[0].index;
						//console.log("box full, returning to idx %d", idx);
						this.index.end = idx;
						return idx;
					}
					this.lines[curLine].insertWord(word, width, height);
					// reset word variables
					width = 0;
					height = 0;
					word = [];
				} else {
					// finish aligning current line and add to line height
					var lheight = this.lines[curLine].align(lineWidth, "even");
					this.curHeight += lheight;

					// check if the word fits in the box
					if((this.curHeight + height) > this.height) {
						// return the beginning of the current line
						this.index.end = word[0].index;
						return word[0].index;
					}

					// if there's enough height left, add new line
					var line = new TextLine(this);
					line.setPoint(0, this.curHeight);
					line.height = height;	// new line defaults to height of coming word
					this.lines.push(line);
					curLine++;
				}
			}
		}
		ch++;
	}
	// make sure to align current line one more time
	this.lines[curLine].align(lineWidth, "even");
	this.index.end = ch;
	return ch;
};

TextBox.prototype.getLocationFromPoint = function(x, y)
{
	// check if it's an empty box. because index.end is the next char
	// from the last char of the box, the only time start == end is when there's
	// no chars in the box
	if(this.index.start == this.index.end) {
		console.log("box empty, going back to last index of section");
		cursor.index = this.index.start;
		return true;
	}

	// reset column and word
	var c=0, w=0;
	// first get the line
	for(var totalHeight=0; c < this.lines.length; c++) {
		// check if the point is within the line
		if(totalHeight+this.lines[c].height < y) {	
			totalHeight += this.lines[c].height;
		} else {	// if the next line goes past the point, then the point must be selecting the current line
			break;
		}
	}
	// select the last line if point extends beyond last line
	if(c == this.lines.length) {
		c = this.lines.length-1;
	}
	//console.log("line %d selected, x: %d, y: %d", c, x, y);
	// now get the letter within the line
	var idx = this.lines[c].getPositionFromPoint(x-this.lines[c].x);
	if(idx === null) {
		return false;
	} else {
		// set cursor position
		cursor.index = idx;
		return true;
	}
};

TextBox.prototype.drawText = function()
{
	var context = layers.mainContext;

	context.save();
	context.translate(this.x, this.y);	// all object points are relative to the parent

	//console.log("box draw text called");
	// call model draw function, pass it canvas context
	for(var l=0; l < this.lines.length; l++) {
		this.lines[l].drawText();
	}

	// restore canvas back to orginal settings
	context.restore();
};

TextBox.prototype.drawMarkup = function()
{
	var context = layers.markupLowContext;

	context.save();
	context.translate(this.x, this.y);	// all object points are relative to the parent

	// call model draw function, pass it canvas context
	for(var l=0; l < this.lines.length; l++) {
		this.lines[l].drawMarkup();
	}

	// restore canvas back to orginal settings
	context.restore();
};

// make layout options visible
TextBox.prototype.showLayout = function()
{
	var abs = this.getAbsolute();
	this.layoutRect = paper.rect(abs.x, abs.y, this.width, this.height).show()
		.attr({"stroke-width":1, stroke:settings.boxOutlineColor, fill:settings.boxFill, opacity:0.1})
		.mouseover((function() {
			this.layoutRect.animate({opacity:0.2}, 200);
		}).bind(this))
		.mouseout((function() {
			this.layoutRect.animate({opacity:0.1}, 200);
		}).bind(this))
		.drag((function(dx, dy, x, y) {
			this.layoutRect.attr({x:this.ox+dx, y:this.oy+dy, width:this.width, height:this.height});
			this.x=this.px+dx;
			this.y=this.py+dy;
			this.parent.updateCanvas();
		}).bind(this),
				(function(){
					// store all current variables
					this.ox = this.layoutRect.attr("x");
					this.oy = this.layoutRect.attr("y");
					this.px = this.x;
					this.py = this.y;
				}).bind(this),null);

	this.layoutHandles.top = paper.rect(abs.x, abs.y-3, this.width, 6).show()
		.attr({"stroke-width":0, fill:settings.boxHandleColor, opacity:0})
		.mouseover((function() {
			this.layoutHandles.top.animate({opacity:1}, 200);
		}).bind(this))
		.mouseout((function() {
			this.layoutHandles.top.animate({opacity:0}, 200);
		}).bind(this))
		.drag((function(dx, dy) {
			var abs = this.getAbsolute();
			if(this.height - dy > 0) {
				this.layoutHandles.top.attr({y:y-3, opacity:1});
				this.height += dy;
				this.y -= dy;
				this.updateLayout();
			}
		}).bind(this),null,null);


	this.layoutHandles.bottom = paper.rect(abs.x, abs.y+this.height-3, this.width, 6).show()
		.attr({"stroke-width":0, fill:settings.boxHandleColor, opacity:0})
		.mouseover((function() {
			this.layoutHandles.top.animate({opacity:1}, 200);
		}).bind(this))
		.mouseout((function() {
			this.layoutHandles.top.animate({opacity:0}, 200);
		}).bind(this))
		.drag((function(dx, dy, x, y) {
			var dy = this.getAbsolute().y - y;
			if(this.height + dy > 0) {
				this.layoutHandles.top.attr({y:y-3, opacity:1});
				this.height += dy;
				this.y -= dy;
				this.updateLayout();
			}
		}).bind(this),null,null);

	this.layoutHandles.left = paper.rect(abs.x-3, abs.y, 6, this.height).show()
		.attr({"stroke-width":0, fill:settings.boxHandleColor, opacity:0})
		.mouseover((function() {
			this.layoutHandles.top.animate({opacity:1}, 200);
		}).bind(this))
		.mouseout((function() {
			this.layoutHandles.top.animate({opacity:0}, 200);
		}).bind(this))
		.drag((function(dx, dy, x, y) {
			var dy = this.getAbsolute().y - y;
			if(this.height + dy > 0) {
				this.layoutHandles.top.attr({y:y-3, opacity:1});
				this.height += dy;
				this.y -= dy;
				this.updateLayout();
			}
		}).bind(this),null,null);

	this.layoutHandles.right = paper.rect(abs.x+this.width-3, abs.y, 6, this.height).show()
		.attr({"stroke-width":0, fill:settings.boxHandleColor, opacity:0})
		.mouseover((function() {
			this.layoutHandles.top.animate({opacity:1}, 200);
		}).bind(this))
		.mouseout((function() {
			this.layoutHandles.top.animate({opacity:0}, 200);
		}).bind(this))
		.drag((function(dx, dy, x, y) {
			var dy = this.getAbsolute().y - y;
			if(this.height + dy > 0) {
				this.layoutHandles.top.attr({y:y-3, opacity:1});
				this.height += dy;
				this.y -= dy;
				this.updateLayout();
			}
		}).bind(this),null,null);
};

// make layout options visible
TextBox.prototype.hideLayout = function()
{
	if(this.layoutRect != null) {
		// if the rect was made before, remove it
		this.layoutRect.remove();
		this.layoutHandles.top.remove();
		this.layoutHandles.bottom.remove();
		this.layoutHandles.left.remove();
		this.layoutHandles.right.remove();
	}
};

