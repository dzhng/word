// NOTE: This object should be destoryed and remade when changed

var Style = function(color, type, style, size, script, align)
{
	// fill style for canvas
	this.color = color;

	// used for font string
	this.type = type;
	this.style = style;
	this.size = size;

	// sub, super, none
	this.script = script;

	// could be "centered, left, right, even"
	this.align = align;

	// spaces between each letter in pixels
	// set as multiplier for font width, so 1 = default
	this.kerning = 1;

	// white space to put on top and bottom of word, as percentage of font height
	// line element will take the highest margin as default
	this.margin = {_top: 0.1, _bottom: 0.1};

	// total height after margins
	this.height = this.size * (1 + this.margin._top + this.margin._bottom);

	this.fontString = this.style + " " + this.size + "px " + this.type;
};

