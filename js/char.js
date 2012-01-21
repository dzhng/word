// Char - basic display element in word editor
// Stores the letter font, size, height, location

// TODO: Kernling can be defined as multiplier, to be multiplied by the letterWidth to determine new kerned letterWidth
var Char = function(letter, style, section)
{
	// set default values
	// set point, NOTE: point for letters is starting from baseline
	this.x = 0;
	this.y = 0;

	// string character of letter
	this.letter = letter;

	// char style
	this.style = style;

	// section this char belong to
	this.section = section;
	// letter index in the section
	this.index = Infinity;

	// letter width - obtained from lookup table
	// if it's an unknown letter, set the default size
	if(letterWidth[this.style.type][this.style.style][letter] != undefined) {
		this.width = Math.round(letterWidth[this.style.type][this.style.style][letter]*(parseInt(this.style.size,10)/72));
	} else {
		this.width = Math.round(letterWidth[this.style.type][this.style.style]["i"]*(parseInt(this.style.size,10)/72));
	}

	// height of the letter taking into account all the margins
	this.height = style.height;

	// highlighted state, defaults to false
	this.highlighted = false;
};

Char.prototype = new cObject;

