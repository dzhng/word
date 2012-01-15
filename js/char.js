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
	this.index = 9999999;

	// letter width - obtained from lookup table
	// if it's an unknown letter, set the default size
	if(letterWidth[this.style.type][this.style.style][letter] != undefined) {
		this.width = letterWidth[this.style.type][this.style.style][letter]*(parseInt(this.style.size,10)/72);
	} else {
		this.width = letterWidth[this.style.type][this.style.style]["i"]*(parseInt(this.style.size,10)/72);
	}

	// height of the letter taking into account all the margins
	this.height = style.size * (1 + style.margin._top + style.margin._bottom);

	// highlighted state, defaults to false
	this.highlighted = false;
};

Char.prototype.setPoint = function(x, y)
{
	this.x = x;
	this.y = y;
};

Char.prototype.draw = function(context)
{
	//context.font = this.style.fontString;
	//context.fillStyle = this.style.color;
	context.fillText(this.letter, this.x, this.y);
	//context.fillRect(this.x, this.y, this.width, this.height);
};

