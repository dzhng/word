
var TextImage = function(x, y, width, height, url)
{
	this.setPoint(x, y);

	// add the border
	this.width = width;
	this.height = height;
	// border used for text alignment
	this.textBorder = settings.imageBorder;

	this.url = url;
	this.image = new Image();
	this.image.src = this.url;
	this.image.onload = this.imageLoaded.bind(this);
};

TextImage.prototype = new cObject;

TextImage.prototype.imageLoaded = function()
{
	console.log("image loaded");
	this.parent.drawMain();
};

TextImage.prototype.draw = function()
{
	var context = layers.mainContext;

	context.save();
	context.fillStyle = "rgb(200,0,0)";  
	//context.fillRect(this.x+settings.imageBorder, this.y+settings.imageBorder, 
	//		this.width-2*settings.imageBorder, this.height-2*settings.imageBorder);
	context.drawImage(this.image, this.x, this.y, this.width, this.height);
	context.restore();
};

