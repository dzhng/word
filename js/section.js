// text editor text section
// Keep tracks of a section of text in the document, and the text box chain the text goes into
// Written by: David Zhang

// TODO: 
// Make a section capable of holding generalize objects instead of just boxes
//
// NOTE:
//

/************** CONSTNATS *******************/ 

/************** GLOBAL VARIABLES *******************/

/************** OBJECT DECLARATION *******************/
var Section = function(model)
{
	this.chars = [];

	this.model = model;

	// make a new box and add to box array
	box.section = this;
	this.boxes = [box];
};

/************** BUILTIN FUNCTIONS *******************/
// add a new box at index in section box array, property will be cloned
// from index box
Section.prototype.cloneBox = function(index)
{
	var newBox, idx;

	// add a new box that's a duplicate of the box at index
	if(index < 0) {
		newBox = this.boxes[0].clone();	
		idx = 0;
	} else if (index >= this.boxes.length) {
		newBox = this.boxes[this.boxes.length-1].clone();
		idx = this.boxes.length;
	} else {
		newBox = this.boxes[index].clone();
		idx = index;
	}

	// insert into array
	this.boxes.splice(idx, 0, newBox);
	// return new box so it can be added to a page
	return newBox;
};

// insert char at the current cursor location
Section.prototype.insertChar = function(key, index)
{
	if(index <= 0) {
		this.chars.splice(0, 0, new Char(key, cursor.style, this));
	} else if (index >= this.chars.length) {
		this.chars.splice(this.chars.length, 0, new Char(key, cursor.style, this));
	} else {
		this.chars.splice(index, 0, new Char(key, cursor.style, this));
	}
	cursor.index++;
};

// generate lines and add all the section chars to boxes and lines
// index = index to start the process
Section.prototype.format = function(index)
{
	var box;
	var width = 0;
	var height = 0;	// stores the width and height of the current word
	var word = [];
	var curbox = 0;

	// start with first box
	box = this.boxes[curbox];
	box.reset();

	// parse into words and insert into box
	for(var i = 0; i < this.chars.length; i++) {
		word.push(this.chars[i]);
		width += this.chars[i].width;
		height = Math.max(this.chars[i].height, height);
		if(this.chars[i].letter == ' ') {
			while(box.insertWord(word, width, height)==false) {
				// TODO: need to finish this
				// if there are still boxes in the box array in this section
				if(++curbox < this.boxes.length) {
					box = this.boxes[curbox];
					box.reset();
				} else {	// that was the last box, create a new box and add to page
				}
			}
			word = [];
			width = 0;
			height = 0;
		}
	}
};

