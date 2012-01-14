
var TextImage = function(x, y, width, height, url)
{
	this.setPoint(x, y);
	this.width = width;
	this.height = height;

	this.url = url;
};

TextImage.prototype = new cObject;

TextImage.prototype.draw = function(context)
{
	context.save();

	context.fillStyle = "rgb(200,0,0)";  
	context.fillRect(this.x, this.y, this.width, this.height);

	context.restore();
};

