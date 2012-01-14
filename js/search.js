
/************** GLOBAL VARIABLES ****************/
// array of images being displayed in the search window
var images = [];
var refreshImage = null;

/************** OBJECT DECLARATION *******************/
var SearchWindow = function(model)
{    
	// constants
	this.imgSize = 100;						// size of each image in pixels
	this.size = {width: 3, height: 5};		// how many images per side
	this.maxImages = this.size.width*this.size.height;	// max number of images displayed
	this.topHeight = 50;					// pixels in top search bar
	this.topPad = 10;						// pad room on top of the searchbox
	this.border = 10;

	// size of image window in pixels
	this.sizep = {width: this.size.width*this.imgSize, height: this.size.height*this.imgSize};
	// size of entire window in pixels
	this.width = this.sizep.width + 2*this.border;
	this.height = this.sizep.height + this.topHeight + 2*this.border;

	// position array
	this.positions = [];
	for(var h = 0; h < this.size.height; h++) {
		for(var w = 0; w < this.size.width; w++) {
			this.positions.push(new Point(w*this.imgSize, h*this.imgSize + this.topHeight));
		}
	}

	// model super object
	this.model = model;
	// global function used to redraw images after they're done loading
	refreshImage = this.model.draw.bind(this.model);

	// hidden means not shown and cannot be clicked
	this.visible = false;
	// image in the array currently hovered over by the user
	this.selected = -1;

	// array of bing search results
	this.results = [];
	this.scrollPosition = 0;	// position in the current image array

	// make the text input bar
	this.inputDiv = document.createElement("div");
	this.input = document.createElement("input");
	this.inputDiv.appendChild(this.input);
	document.body.appendChild(this.inputDiv);

	this.input.style.width = this.sizep.width;
	this.inputDiv.style.width = this.sizep.width;
	this.inputDiv.style.height = this.topHeight;
	this.inputDiv.style.visibility = "hidden";
	this.inputDiv.style.zIndex = 2;
	this.inputDiv.style.position = "absolute";

	this.inputDefaultText = "search for images..";
	this.input.value = this.inputDefaultText;
	this.input.style.color='#B3B3B3'; 
	this.input.style.fontStyle='italic'; 
	this.input.style.fontSize=20; 

	this.submitHandler = this.submit.bind(this);
	this.input.addEventListener("keydown", this.submitHandler, false);
	this.inputBlurHandler = this.inputBlur.bind(this);
	this.input.addEventListener("blur", this.inputBlurHandler, false);
	this.inputFocusHandler = this.inputFocus.bind(this);
	this.input.addEventListener("focus", this.inputFocusHandler, false);

	// draw settings
	this.contentText = "Search for Images,";	// text to display on image grid
	this.instructionText = "Drag to Canvas.";	// text to display on image grid
	this.ctextOffset = 250;						// top height offset for text
	this.itextOffset = 280;						// top height offset for text
	this.ctextFont = "20pt Arial";				// text font settings
	this.itextFont = "16pt Arial";				// text font settings

	// colors
	this.textColor = "rgba(180,180,180,1)";
	this.borderColor = "rgba(20,20,20,0.95)";
	this.borderOutlineColor = "rgba(255,255,255,0.5)";
	this.imageGridColor = "rgba(80,80,80,1)";
	this.imageFrameColor = "rgba(240,240,240,1)";
};

// inherit from window object
SearchWindow.prototype = new cObject;

SearchWindow.prototype.updateClick = function(x, y)
{
};

/************** BUILTIN FUNCTIONS *******************/
SearchWindow.prototype.draw = function(context)
{
	if(!this.visible) {
		this.inputDiv.style.visibility = "hidden";
		return;
	} else {
		// sanity check
		if(this.point.y < 0) {
			this.point.y = 0;
		} else if(this.point.y > this.model.canvas.height - this.height) {
			this.point.y = this.model.canvas.height - this.height;
		}

		if(this.point.x < 0) { 
			this.point.x = 0;
		} else if(this.point.x > this.model.canvas.width - this.width) {
			this.point.x = this.model.canvas.width - this.width;
		}

		// fill in border
		context.save();
		var x = this.point.x;
		var y = this.point.y;
		var width = this.width;
		var height = this.height;
		var radius = this.border;
		context.fillStyle = this.borderColor;
		context.lineWidth = 1;
		context.strokeStyle = this.borderOutlineColor;
		context.beginPath();
		context.moveTo(x + radius, y);
		context.lineTo(x + width - radius, y);
		context.quadraticCurveTo(x + width, y, x + width, y + radius);
		context.lineTo(x + width, y + height - radius);
		context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		context.lineTo(x + radius, y + height);
		context.quadraticCurveTo(x, y + height, x, y + height - radius);
		context.lineTo(x, y + radius);
		context.quadraticCurveTo(x, y, x + radius, y);
		context.closePath();
		context.stroke();
		context.fill();
		context.restore();

		// fill in content
		context.save();
		context.fillStyle = this.imageGridColor;
		context.fillRect(this.point.x + this.border, this.point.y + this.border + this.topHeight, this.sizep.width, this.sizep.height);

		context.fillStyle = this.textColor;
		context.textAlign = "center";
		context.font = this.ctextFont;
		context.fillText(this.contentText, this.point.x+this.border+(this.sizep.width/2), this.point.y+this.border+this.ctextOffset);
		context.font = this.itextFont;
		context.fillText(this.instructionText, this.point.x+this.border+(this.sizep.width/2), this.point.y+this.border+this.itextOffset);
		context.restore();

		// position the input div
		this.inputDiv.style.visibility = "visible";
		this.inputDiv.style.top = this.point.y + this.border + this.topPad;
		this.inputDiv.style.left = this.point.x + this.border;

		// draw the images
		for(var i = this.scrollPosition; i < images.length - this.scrollPosition; i++) {
			var frame = images[i];
			var width = frame.image.width;
			var height = frame.image.height;
			// crop the image first
			if(width > height) {
				frame.sy = 0;
				frame.sx = (width - height)/2;
				width = height;
			} else {
				frame.sx = 0;
				frame.sy = (height - width)/2;
				height = width;
			}
			frame.x = this.positions[i].x + this.border;
			frame.y = this.positions[i].y + this.border;
			frame.swidth = width;
			frame.sheight = height;

			// draw the image
			context.fillStyle = "rgb(255,255,255)"	// make sure the background is white, for transparent images
			context.fillRect(this.point.x + frame.x, this.point.y + frame.y, this.imgSize, this.imgSize);
			context.drawImage(frame.image, frame.sx, frame.sy, frame.swidth, frame.sheight,
					this.point.x + frame.x, this.point.y + frame.y, this.imgSize, this.imgSize);
		}

		// we want to draw a frame around the currently selected image
		if(this.selected >= 0) {
			var im = images[this.selected];
			context.save();

			context.lineWidth = 5;
			context.strokeStyle = this.imageFrameColor;
			context.beginPath();
			context.moveTo(this.point.x + im.x - 2, this.point.y + im.y - 2);
			context.lineTo(this.point.x + im.x - 2, this.point.y + im.y + this.imgSize + 2);
			context.lineTo(this.point.x + im.x + this.imgSize + 2, this.point.y + im.y + this.imgSize + 2);
			context.lineTo(this.point.x + im.x + this.imgSize + 2, this.point.y + im.y - 2);
			context.closePath();
			context.stroke();

			context.restore();
		}
	}
};

// see if any image frame falls within the point
// point input is relative to searchwindow coordinates
SearchWindow.prototype.getImageFromPoint = function(point)
{
	var Px, Py;
	// see if any images fall within the point
	for(var i = this.scrollPosition; i < images.length - this.scrollPosition; i++){
		Px = point.x - images[i].x;
		Py = point.y - images[i].y;
		if(Px > 0 && Py > 0 && Px < this.imgSize && Py < this.imgSize) {
			// modify the input anchor point
			point.x = Px;
			point.y = Py;
			// keep track of selected images
			this.selected = i;
			(this.model.draw.bind(this.model))();
			return images[i];
		}
	}
	this.selected = -1;
	return undefined;
};

SearchWindow.prototype.unselect = function()
{
	this.selected = -1;
	(this.model.draw.bind(this.model))();
};

SearchWindow.prototype.scrollUp = function()
{
};

SearchWindow.prototype.scrollDown = function()
{
};

SearchWindow.prototype.submit = function(e)
{
	// enter key pressed
	if(e.keyCode == 13)
	{
		var query = this.input.value;
		console.log("search form submitted, input: %s\n", query);
		images = [];	// clear data structure
		Search(query, this.scrollPosition.toString(), this.submitCallback.bind(this));
	}
};

SearchWindow.prototype.submitCallback = function(results)
{
	if(results == undefined) {
		console.log("no results found\n");
		return;
	}
	console.log("bing results fetched, %d items\n", results.length);

	// convert results into image items and push into data structure
	for(var i = 0; i < results.length; i++) {
		var img = new Image();  
		img.onload = function(){  
			images.push(new Frame(this));	// push into main data structure once it's done loading
			refreshImage();
		};
		img.src = results[i].bigUrl;
		console.log("grabbing image: %s\n", img.src);
	}
	this.results = results;
};

SearchWindow.prototype.inputBlur = function()
{
	if(this.input.value == '') 
	{ 
		this.input.value = this.inputDefaultText;
		this.input.style.color='#B3B3B3'; 
		this.input.style.fontStyle='italic'; 
		this.input.style.fontWeight='lighter'; 
		this.input.style.fontSize=20;
	}
};
	
SearchWindow.prototype.inputFocus = function()
{
	if(this.input.value == this.inputDefaultText)
	{ 
		this.input.value = ''; 
		this.input.style.color='#000000'; 
		this.input.style.fontStyle='normal'; 
		this.input.style.fontWeight='normal'; 
		this.input.style.fontSize=20;
	}
};

