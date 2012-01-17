
var TextImage = function(x, y, width, height, url)
{
	this.setPoint(x, y);

	// add the border
	this.width = width + 2*settings.imageBorder;
	this.height = height + 2*settings.imageBorder;

	this.url = url;
	this.image = new Image();
	this.image.src = this.url;
};

TextImage.prototype = new cObject;

TextImage.prototype.draw = function()
{
	var context = layers.mainContext;

	context.save();
	context.fillStyle = "rgb(200,0,0)";  
	//context.fillRect(this.x+settings.imageBorder, this.y+settings.imageBorder, 
	//		this.width-2*settings.imageBorder, this.height-2*settings.imageBorder);
	context.drawImage(this.image,
				this.x+settings.imageBorder, this.y+settings.imageBorder, 
				this.width-2*settings.imageBorder, this.height-2*settings.imageBorder);
	context.restore();
};

