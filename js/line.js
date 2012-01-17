// A TextLine is an array of letters on the same display line
// runs alignment algorithms, stores total line height, and determines letter baseline for drawing
// Written by: David Zhang

var TextLine = function()
{
	// buffer to store all the chars
	this.chars = [];

	// line margin
	this.margin = {_top: 0.1, _bottom: 0.1};
};

// Inherit prototypes from Window object
TextLine.prototype = new cObject;

TextLine.prototype.insertWord = function(word, width, height, margin)
{
	this.width += width;
	this.height = Math.max(height, this.height);

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
		console.log("x value too high: %d", x);
		return this.chars.length;
	}
	// if it's negative position, it's before the length, so first position
	if(x <= 0) {
		console.log("x value too low: %d", x);
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
	//console.log("char %d selected", w);

	if(w == this.chars.length) {
		return this.chars[w-1].index + 1;
	} else {
		return this.chars[w].index;
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
// returns: the final height after alignment
TextLine.prototype.align = function(len, alignment)
{
	// get baseline for drawing the letters (y position)
	var baseline = this.height * (1-this.margin._bottom);

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
	return this.height;
};

// draw all the chars in the line
TextLine.prototype.drawText = function()
{
	var context = layers.mainContext;

	for(var i = 0; i < this.chars.length; i++) {
		var ch = this.chars[i];

		// see if letter style has changed, if so, reset canvas state machine
		// and change cursor style
		if(ch.style.fontString != cursor.style.fontString ||
				ch.style.color != cursor.style.color) {
			context.font = ch.style.fontString;
			context.fillStyle = ch.style.color;
			cursor.style = new ch.style;
		}
		context.fillText(ch.letter, ch.x + this.x, ch.y + this.y);
	}
};

// draw all markups in the line
TextLine.prototype.drawMarkup = function()
{
	var context = layers.markupLowContext;

	context.save();
	context.translate(this.x, this.y);	// all points are relative to the parent object
	
	for(var i = 0; i < this.chars.length; i++) {
		var ch = this.chars[i];
		if(ch.highlighted) {
			context.fillRect(ch.x, 0, ch.width, this.height);
		}
	}

	context.restore();
};

