var Point = function(x, y)
{
	this.x = x;
	this.y = y;
};

Point.prototype.equals = function(point)
{
	return ((this.x === point.x) && (this.y === point.y));
};

Point.prototype.subtract = function(point)
{
	return (new Point(this.x - point.x, this.y - point.y));
};

Point.prototype.add = function(point)
{
	return (new Point(this.x + point.x, this.y + point.y));
};

Point.prototype.multiply = function(mult)
{
	return (new Point(Math.ceil(this.x*mult), Math.ceil(this.y*mult)));
};

Point.prototype.divide = function(div)
{
	return (new Point(Math.ceil(this.x/div), Math.ceil(this.y/div)));
};

