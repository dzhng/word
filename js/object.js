
var cObject = function()
{
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.rotation = 0;
	this.scale = 1;
	this.visible = false;

	// hovering offsets
	this.xoff = 0;
	this.yoff = 0;

	// animation settings
	this.amId = null;					// id returned by the setTimeout function - used to cancel current animation
	this.time = 200;					// animation time in seconds
	this.framePeriod = 50;				// period in between each frame

	this.xDelta = null;			// position changes used for animation
	this.yDelta = null;
	this.widthDelta = null;
	this.heightDelta = null;
	this.rotationDelta = null;
	this.scaleDelta = null;

	this.positionFinal = null;			// final position of animation
	this.widthFinal = null;
	this.heightFinal = null;
	this.rotationFinal = null;
	this.scaleFinal = null;
};

cObject.prototype.setPoint = function(x, y)
{
	this.x = x;
	this.y = y;
};

// look at the pointer location and determine if it's over the window
cObject.prototype.isHovering = function(x, y)
{
	// don't check if it's not even visible
	if(this.visible == false) {
		return false;
	} else if((x > this.x) && (y > this.y) &&
			(x < this.x + this.width) && (y < this.y + this.height))
	{
		this.xoff = x - this.x;
		this.yoff = y - this.y;
		return true;
	}
	return false;
};

// convert the input coordinate to one that's relative to the window (where top left is (0,0))
cObject.prototype.relativeCoordinate = function(point)
{
	return new Point(point.x - this.x, point.y - this.y);
};

// keep calling the draw function until the window moves to the location specified
cObject.prototype.animate = function(x, y, width, height, rotation, scale)
{
	// cancel any current animations
	if(this.amId != null) {
		clearTimeout(this.amId);
	}

	// calculate delta position needed for animation
	var divider = this.time/this.framePeriod;

	this.xDelta = (x == null) ? 0 : (x - this.x);
	this.yDelta = (y == null) ? 0 : (y - this.y);
	this.widthDelta = (width == null) ? 0 : (width - this.width);
	this.heightDelta = (height == null) ? 0 : (height - this.height);
	this.rotationDelta = (rotation == null) ? 0 : (rotation - this.rotation);
	this.scaleDelta = (scale == null) ? 0 : (scale - this.scale);

	this.positionFinal = this.point.add(this.positionDelta);
	this.widthFinal = this.width + this.widthDelta;
	this.heightFinal = this.height + this.heightDelta;
	this.rotationFinal = this.rotation + this.rotationDelta;
	this.scaleFinal = this.scale + this.scaleDelta;

	this.positionDelta = this.positionDelta.divide(divider);
	this.widthDelta /= divider;
	this.heightDelta /= divider;
	this.rotationDelta /= divider;
	this.scaleDelta /= divider;

	// start animation tick
	this.amFrame = 0;
	this.amId = setTimeout(this.animateFrame.bind(this), this.framePeriod);
};

cObject.prototype.animateFrame = function()
{
	if(++this.amFrame > this.time/this.framePeriod) {
		// animation done
		this.amFrame = 0;
		this.amId = null;

		// make sure all positions are actually correct, to account for rounding errors
		this.point = this.positionFinal;
		this.width = widthFinal;
		this.height = heightFinal;
		this.rotation = rotationFinal;
		this.scale = scaleFinal;
	} else {
		// update positions
		this.point = post.position.add(this.positionDelta);
		this.width += this.widthDelta;
		this.height += this.heightDelta;
		this.rotation += this.rotationDelta;
		this.scale += this.scaleDelta;

		this.amId = setTimeout(this.animateFrame.bind(this), this.framePeriod);
	}

	// draw the frame
	this.draw();
};

