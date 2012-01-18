// text editor text section
// Keep tracks of a section of text in the document, and the text box chain the text goes into
// Written by: David Zhang

// TODO: 
// Make a section capable of holding generalize objects instead of just boxes
//
// NOTE:
//

/************** OBJECT DECLARATION *******************/
var Section = function(model)
{
	this.chars = [];

	this.model = model;
};

/************** BUILTIN FUNCTIONS *******************/
// insert char at the current cursor location
Section.prototype.insertChar = function(key, index)
{
	var style = new Style(cursor.style.color, cursor.style.type,
			cursor.style.style, cursor.style.size, cursor.style.script, cursor.style.align);

	if(index <= 0) {
		this.chars.splice(0, 0, new Char(key, style, this));
	} else if (index >= this.chars.length) {
		this.chars.splice(this.chars.length, 0, new Char(key, style, this));
	} else {
		this.chars.splice(index, 0, new Char(key, style, this));
	}
	cursor.index++;
};

// generate lines and add all the section chars to boxes and lines
// index = index to start the process
Section.prototype.format = function(index)
{
	var width = 0;
	var height = 0;	// stores the width and height of the current word
	var ch = 0;		// index of the current character

	// parse into words and insert into box
	// first iterate through each one of the boxes
	for(var p = 0; p < this.model.pages.length; p++) {
		var boxes = this.model.pages[p].boxes;
		for(var b = 0; b < boxes.length; b++) {
			var box = boxes[b];
			ch = box.setChar(this.chars, ch, index);
		}
	}

	// if there's still characters left over, return false to signal to model that we need to
	// make a new page
	if(ch < this.chars.length) {
		return false;
	} else {
		return true;
	}
};

Section.prototype.resetHighlight = function()
{
	// reset the highlight first
	for(var i = this.chars.length-1; i >= 0; i--) {
		this.chars[i].highlighted = false;
	}
};

// highlight the input chars at start and end index, inclusive
Section.prototype.highlight = function(start, end)
{
	// swap them if end is lower
	if(end < start) {
		var tmp = end;
		end = start;
		start = tmp;
	}
	this.resetHighlight();
	// highlight selected fonts
	for(var i = end; i >= start; i--) {
		this.chars[i].highlighted = true;
	}
};

