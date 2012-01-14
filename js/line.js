// A TextLine is an array of letters on the same display line
// runs alignment algorithms, stores total line height, and determines letter baseline for drawing
// Written by: David Zhang

var TextLine = function()
{
	// buffer to store all the chars
	this.chars = [];
	this.textHeight = 0;

	// line margin
	this.margin = {_top: 0.1, _bottom: 0.1};
};

// Inherit prototypes from Window object
TextLine.prototype = new cObject;

TextLine.prototype.insertWord = function(word, width, height, margin)
{
	this.width += width;
	this.textHeight = Math.max(height, this.textHeight);

	//TODO: Decide weather to push the last space or not	
	for(var i = 0; i < word.length; i++) {
		this.chars.push(word[i]);
	}
};

// returns the curser position from a x pixel offset from the line
TextLine.prototype.getPositionFromPoint = function(x)
{
	// if we go over the length of the line, then it's definitely the last word
	if(x >= this.length) {
		return this.chars.length;
	}
	// if it's negative position, it's before the length, so first position
	if(x <= 0) {
		return 0;
	}

	var totalWidth=0;
	for(var w=0; w < this.chars.length; w++) {
		// if the start of next letter is over the curser, the current letter must be the curser
		if(totalWidth+this.chars[w].width < x) {
			totalWidth += this.chars[w].width;
		} else {
			break;
		}
	}
	console.log("char %d selected", w);

	if(w == this.chars.length) {
		return this.chars[w-1].getIndex() + 1;
	} else {
		return this.chars[w].getIndex();
	}
};

// set text, realign words in lines to make sure they all fit in one line, update letter position
// margin = white space to put on top and bottom of word, as percentage of font height
//				use the highest letter spacing in letter array
// len = max length of line, usually length of box, in pixels
// NOTE: If the last word is a space, it does not count in length measurement
//			this is so we can split a sentence into 2 lines elegantly, because
//			a newline is essentially a space
// alignment = text spacing, could be centered, left, right, even.
TextLine.prototype.align = function(len, alignment)
{
	// get baseline for drawing the letters (y position)
	var baseline = this.textHeight * (1+this.margin._top);
	this.height = this.textHeight * (1+this.margin._top+this.margin._bottom);

	// starting x position for drawing letters, offset from beginning of line
	var x = 0;

	// align
	switch(alignment)
	{
		case "left":
			for(var w=0; w < this.chars.length; w++) {
				this.chars[w].setPoint(x, baseline);
				x += this.chars[w].width;
			}
			break;
		case "right":
			// TODO
			break;
		case "even":
			// TODO
			for(var w=0; w < this.chars.length; w++) {
				this.chars[w].setPoint(x, baseline);
				x += this.chars[w].width;
			}
			break;
		case "centered":
			// TODO
			break;
	}
};

// draw all the chars in the line
TextLine.prototype.draw = function(context)
{
	context.save();
	context.translate(this.x, this.y);	// all points are relative to the parent object
	
	for(var i = 0; i < this.chars.length; i++) {
		this.chars[i].draw(context);
	}

	context.restore();
};

