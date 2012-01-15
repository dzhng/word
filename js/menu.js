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

	
	//select cursor
	this.mouseDownHandler = this.cursorDown.bind(this);
	var selectCursor= document.getElementById("pointerButton");
	selectCursor.addEventListener("mousedown", this.mouseDownHandler, false);
	
	//select textBox
    this.mouseDownHandler = this.textBoxDown.bind(this);
	var selectTextBox = document.getElementById("textBoxButton");
	selectTextBox.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select insertImage	
    this.mouseDownHandler = this.insertImageDown.bind(this);
	var selectImage = document.getElementById("insertImageButton");
	selectImage.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select drawShape	
    this.mouseDownHandler = this.DrawShapesDown.bind(this);
	var drawShape = document.getElementById("drawShapeButton");
	drawShape.addEventListener("mousedown", this.mouseDownHandler, false);
		
	//select font	
    this.mouseDownHandler = this.selectFontDown.bind(this);
	var selectFont = document.getElementById("font");
	selectFont.addEventListener("mousedown", this.mouseDownHandler, false);

	//select fontSize 	
    this.mouseDownHandler = this.fontSizeDown.bind(this);
	var fontSize = document.getElementById("fontSize");
	fontSize.addEventListener("mousedown", this.mouseDownHandler, false);


	//select alignleft
	this.mouseDownHandler = this.alignLeftDown.bind(this);
	var selectCursor= document.getElementById("textAlignLeft");
	selectCursor.addEventListener("mousedown", this.mouseDownHandler, false);
	
	//select alignCenter
    this.mouseDownHandler = this.alignCenterDown.bind(this);
	var alignCenter = document.getElementById("textAlignCenter");
	alignCenter.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select alignRight 
    this.mouseDownHandler = this.alignRightDown.bind(this);
	var alignRight = document.getElementById("textAlignRight");
	alignRight.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select justify	
    this.mouseDownHandler = this.justifyDown.bind(this);
	var justifying= document.getElementById("textAlignJustify");
	justifying.addEventListener("mousedown", this.mouseDownHandler, false);
		
	//select bold	
    this.mouseDownHandler = this.boldDown.bind(this);
	var selectBold = document.getElementById("textBold");
	selectBold.addEventListener("mousedown", this.mouseDownHandler, false);
	
	//select Italic
    this.mouseDownHandler = this.italicDown.bind(this);
	var selectItalic = document.getElementById("textItalic");
	selectItalic.addEventListener("mousedown", this.mouseDownHandler, false);

	//select Underline	
    this.mouseDownHandler = this.underlineDown.bind(this);
	var selectUnderline = document.getElementById("textUnderline");
	selectUnderline.addEventListener("mousedown", this.mouseDownHandler, false);

	//select Color 
    this.mouseDownHandler = this.colorDown.bind(this);
	var selectColor = document.getElementById("textColor");
	selectTextColor.addEventListener("mousedown", this.mouseDownHandler, false);

	//select Line Spacing	
    this.mouseDownHandler = this.lineSpacingDown.bind(this);
	var selectSpacing = document.getElementById("textLineSpacing");
	selectBold.addEventListener("mousedown", this.mouseDownHandler, false);

	//select subscritp	
    this.mouseDownHandler = this.subScriptDown.bind(this);
	var selectSubScript = document.getElementById("textSubScript");
	selectSubScript.addEventListener("mousedown", this.mouseDownHandler, false);

	//select superscript	
    this.mouseDownHandler = this.suoerScriptDown.bind(this);
	var selectSuperScript = document.getElementById("textSuperScript");
	selectSuperScript.addEventListener("mousedown", this.mouseDownHandler, false);

	//select strikethrough
    this.mouseDownHandler = this.strikethroughDown.bind(this);
	var selectStrikethrough = document.getElementById("textStrikethrough");
	selectStrikethrough.addEventListener("mousedown", this.mouseDownHandler, false);
};


Menu.prototype.cursorDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.textBoxDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.insertImageDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.drawShapesDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.selectFontDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.fontSizeDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.alignLeftDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.alignCenterDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.alignRightDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.justifyDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.boldDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.italicDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.underlineDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.colorDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.lineSpacingDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.subScriptDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.superScriptDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

Menu.prototype.strikethroughDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
};

