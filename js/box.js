// text editor text box
// Keep tracks of all the snippets in the box, insert, select, make new snippets as needed
// Written by: David Zhang

// TODO: 
//
// NOTE:

/************** CONSTNATS *******************/ 

/************** GLOBAL VARIABLES *******************/

/************** OBJECT DECLARATION *******************/
var TextBox = function(x, y, Width, Height, Page)
{
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

	// the page this box belongs to
	this.page = Page;

	// buffer to stores all the lines of text in the box
	this.lines = [];
	
	// start with one line
	this.reset();
};

// Inherit prototypes from Window object
TextBox.prototype = new cObject;

/************** BUILTIN FUNCTIONS *******************/
// add the line to the box, returns the height of space left
TextBox.prototype.newLine = function()
{
	var line = new TextLine();
	line.setPoint(0, this.curHeight);
	this.lines.push(line);
	//console.log("new line added, total lines: %d", this.lines.length);
	return true;
};

TextBox.prototype.reset = function()
{
	this.lines = [];	// empty current line array
	this.curHeight = 0;	// reset current line height
	this.newLine();
};

// add word to current textbox, return true on success, false on fail
// the algorithm is keep adding words to the current line, until
// the line returns a false from either running into obsticles or its full
// function returns the index where it ends
TextBox.prototype.setChar = function(chars, index)
{
	// reset textbox
	this.reset();
	var curLine = this.lines.length - 1;

	// chars in a word
	var word = [];

	// word size
	var width = 0;
	var height = 0;

	// counter
	var ch = index;

	while(ch < chars.length) {
		// set index first so it can be refered back later
		chars[ch].index = ch;
		// push into word
		word.push(chars[ch]);
		width += chars[ch].width;
		height = Math.max(chars[ch].height, height);
		// if space encountered, word found
		if(chars[ch].letter == ' ') {
			// if can't add to this line, make a new line
			if(this.lines[curLine].width + width < this.width) {
				// check if this word will fit
				if((this.curHeight + height) > this.height) {
					// return the beginning of the current line
					var lline = this.lines.pop();
					var idx = lline.chars[0].index;
					//console.log("box full, returning to idx %d", idx);
					return idx;
				}
				this.lines[curLine].insertWord(word, width, height);
			} else {
				var lheight = this.lines[curLine].align();
				// check if the word fits in the box
				if((this.curHeight + height) > this.height) {
					// return the beginning of the current line
					return word[0].index;
				}
				this.curHeight += lheight;
				this.newLine();
				this.lines[++curLine].insertWord(word, width, height);
			}
			// reset word variables
			width = 0;
			height = 0;
			word = [];
		}
		ch++;
	}
	return ch;

	// see if there are any obsticles in the way, if so, make a new line
	/*if(this.page.checkObsticle(this.x, this.y, 
				this.lines[curLine].width + width, 
				Math.max(this.lines[curLine].height, height)) === false) {
		this.lines[curLine].align();
		this.curHeight += this.lines[curLine].height;
		this.newLine();
	}*/
};

TextBox.prototype.getLocationFromPoint = function(x, y)
{
	// check if it's an empty box
	if(this.lines.length <= 0) {
		console.log("box empty, going back to last index of section");
		return false;
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
	console.log("line %d selected, x: %d, y: %d", c, x, y);
	// now get the letter within the line
	var idx = this.lines[c].getPositionFromPoint(x-this.lines[c].x);
	
	// set cursor position
	cursor.index = idx;
	return true;
};

TextBox.prototype.draw = function(context)
{
	//console.log("drawing %d lines", this.lines.length);

	context.save();
	context.translate(this.x, this.y);	// all object points are relative to the parent

	// call model draw function, pass it canvas context
	for(var l=0; l < this.lines.length; l++) {
		this.lines[l].align(this.width, "even");
		this.lines[l].draw(context);
	}

	// restore canvas back to orginal settings
	context.restore();
};

