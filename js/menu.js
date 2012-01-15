var Menu = function()
{
	/*//Set the different variables in the Menu
	
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
	this.mouseDownHandler = this.mouseDown.bind(this);
	var selectCursor= document.getElementById("pointerButton");
	selectCursor.addEventListener("mousedown", this.mouseDownHandler, false);
	
	//select textBox
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectTextBox = document.getElementById("textBoxButton");
	selectTextBox.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select insertImage	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectImage = document.getElementById("insertImageButton");
	selectImage.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select drawShape	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var drawShape = document.getElementById("drawShapeButton");
	drawShape.addEventListener("mousedown", this.mouseDownHandler, false);
		
	//select font	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectFont = document.getElementById("font");
	selectFont.addEventListener("mousedown", this.mouseDownHandler, false);

	//select fontSize 	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var fontSize = document.getElementById("fontSize");
	fontSize.addEventListener("mousedown", this.mouseDownHandler, false);


	//select alignleft
	this.mouseDownHandler = this.mouseDown.bind(this);
	var selectCursor= document.getElementById("textAlignLeft");
	selectCursor.addEventListener("mousedown", this.mouseDownHandler, false);
	
	//select alignCenter
    this.mouseDownHandler = this.mouseDown.bind(this);
	var alignCenter = document.getElementById("textAlignCenter");
	alignCenter.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select alignRight 
    this.mouseDownHandler = this.mouseDown.bind(this);
	var alignRight = document.getElementById("textAlignRight");
	alignRight.addEventListener("mousedown", this.mouseDownHandler, false);
			
	//select justify	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var justifying= document.getElementById("textAlignJustify");
	justifying.addEventListener("mousedown", this.mouseDownHandler, false);
		
	//select bold	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectBold = document.getElementById("textBold");
	selectBold.addEventListener("mousedown", this.mouseDownHandler, false);
	
	//select Italic
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectItalic = document.getElementById("textItalic");
	selectItalic.addEventListener("mousedown", this.mouseDownHandler, false);

	//select Underline	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectUnderline = document.getElementById("textUnderline");
	selectUnderline.addEventListener("mousedown", this.mouseDownHandler, false);

	//select Color 
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectColor = document.getElementById("textColor");
	selectTextColor.addEventListener("mousedown", this.mouseDownHandler, false);

	//select Line Spacing	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectSpacing = document.getElementById("textLineSpacing");
	selectBold.addEventListener("mousedown", this.mouseDownHandler, false);

	//select subscritp	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectSubScript = document.getElementById("textSubScript");
	selectSubScript.addEventListener("mousedown", this.mouseDownHandler, false);

	//select superscript	
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectSuperScript = document.getElementById("textSuperScript");
	selectSuperScript.addEventListener("mousedown", this.mouseDownHandler, false);

	//select strikethrough
    this.mouseDownHandler = this.mouseDown.bind(this);
	var selectStrikethrough = document.getElementById("textStrikethrough");
	selectStrikethrough.addEventListener("mousedown", this.mouseDownHandler, false);*/
};

Menu.prototype.mouseDown = function(e)
{
	this.pX = e.pageX;
	this.pY = e.pageY;
	console.log('something funny');
};

