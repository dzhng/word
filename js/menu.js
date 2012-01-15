var Menu = function()
{
	//Set the different variables in the Menu
	
	//Different tools defaulting to normal cusor
	this.cursor = true;
	this.textBox = false;
	this.insertImage = false;
	this.drawShape = false;

	//Initialize text editting values
	this.font= "Arial";
	this.fontSize=10;
	this.alignLeft = null;
	this.alignRight = null;
	this.alignCenter = null;
	this.alignJustify = null;
	this.bold = null;
	this.italic =null;
	this.underline = null;
	this.textColor = null;
	this.lineSpacing = null;
	this.subscript = null;
	this.strikethrough = null
	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var testing = document.getElementById("pointerButton");
	this.testing.addEventListener("mousedown", this.mouseDownHandler, false);

};

Menu.prototype.mouseDown = function(e)
{
		this.pX = e.pageX;
		this.pY = e.pageY;
		this.click = true;
		this.model.updateClick(this.pX, this.pY);
		console.log('something funny');
};
