// text editor page
// Keeps track of textboxes in pages
// Written by: David Zhang

// TODO: 
// when adding boxes, check if the new box can fit - if not, return false so the model can make a new page for it
//
// NOTE:
// There is no concept of page margin in <INSERT NAME HERE>, this is abstracted away
// by the object oriented model of using dynmanicly placed boxes

/************** OBJECT DECLARATION *******************/
var Page = function()
{
	this.width = PAGE_SIZE.width;
	this.height = PAGE_SIZE.height;

	this.background = "rgb(250,250,250)";

	// array of text boxes in the current page
	this.boxes = [];
	// array of objects in the current page
	this.objects = [];

	this.dragging = null;	// currently dragging object

//	this.orginOfDrag = null; //is null until mouse interactions begin
};

Page.prototype = new cObject;

/************** BUILTIN FUNCTIONS *******************/
// input is point on the page, using page coordinates
// find the box nearest to the point on the page, looking at boxes' edges
Page.prototype.getBoxFromPoint = function(x, y)
{
	console.log("clicked x:%d, y:%d", x,y);

	// stores index of closest box
	var closest = -1;
	// distance to the cloest box
	var cDist = 99999;

	// if there are only one box on page, then no need to do any math
	if(this.boxes.length <= 0) {
		console.log("No boxes found on this page\n");
		return false;
	} else if(this.boxes.length == 1) {
		closest = 0;
	} else { 
		for(var i = 0; i < this.boxes.length; i++) {
			if(this.boxes[i].isHovering(x, y)) {
				closest = i;
			}
		}
		if(closest == -1) {
			return false;
		}
	}
	console.log("box %d selected", closest);
	// convert point to box coordinate space and update cursor location
	return this.boxes[closest].getLocationFromPoint(x - this.boxes[closest].x, y - this.boxes[closest].y);
};

Page.prototype.getObjectFromPoint = function(x, y)
{
	// iterate through all objects and see if any is hovering
	for(i = 0; i < this.objects.length; i++) {
		if(this.objects[i].isHovering(x, y)) {
			this.dragging = this.objects[i];
			console.log("dragging object %d", i);
			return true;
		}
	}
	this.dragging = null;
	return false;
};

Page.prototype.updateDrag = function(x, y)
{
	if(this.dragging != null) {
		this.dragging.setPoint(x-this.x-this.dragging.xoff, y-this.y-this.dragging.yoff);
	}
};

Page.prototype.stopDrag = function()
{
//	this.originOfDrag = this.dragging;
//	this.dragging.setPoint(x-this.x-this.dragging.xoff, y-this.y-this.dragging.yoff);
//	if(this.originOfDrag != this.dragging){
//
//	}
	this.dragging = null;
};

Page.prototype.addBox = function(box)
{
	// if there's no box on the page yet, and the box 
	// is 75% the size of the page, center the box on the page
	
	// if no box on the page and box is small, put it on top left corner
	
	// if there are already boxes on the page, try to add it behind last box
	
	// add input box to boxes array
	box.page = this;
	this.boxes.push(box);
	console.log("box added, total of %d boxes on page", this.boxes.length);
	console.log("box: (x:%d, y:%d), curHeight: %d" , box.x, box.y, box.curHeight);

	return true;
};

Page.prototype.addImage = function(image)
{
	image.visible = true;
	this.objects.push(image);
	console.log("image: (x:%d, y:%d)" , image.x, image.y);

	return false;
};

Page.prototype.updateClick = function(x, y)
{
	// first see if an object can be selected
	if(this.getObjectFromPoint(x-this.x, y-this.y) == false) {
		// find new section and index for cursor
		return this.getBoxFromPoint(x-this.x, y-this.y);
	}
};

// check for obsticles and returns an x offset and width offset
Page.prototype.checkObsticle = function(x, y, width, height)
{
	// iterate through upper layers and see if there's anything in the way
	for(var i = 0; i < this.objects.length; i++) {
		var obj = this.objects[i];
		// check for y axis intersecting
		if((y > obj.y && y < obj.y+obj.height) || (y+height > obj.y && y+height < obj.y+obj.height) ||
			(y > obj.y && y+height < obj.y+obj.height) || (y < obj.y && y+height > obj.y+obj.height)) {
			// TODO: object is in between the lines
			// check if object is on left or right
			if((obj.x > x) && (obj.x < x+width)) {
				// object is on right side, modify the width so its shorter
				return {nX: x, nWidth: obj.x-x};
			} else if((obj.x+obj.width > x) && (obj.x+obj.width < x+width)) {
				// object is on the left side, shift x value right and change width so its shorter
				console.log("width: %d", (x+width - (obj.x+obj.width)));
				return {nX: (obj.x+obj.width), nWidth: (x+width - (obj.x+obj.width))};
			}
		}
	}
	return null;
};

Page.prototype.draw = function(context)
{
	// don't draw if not visible
	if(!this.visible) {
		return;
	}

	context.save();
	context.translate(this.x, this.y);

	context.fillStyle = this.background;
	context.fillRect(0,0,this.width, this.height);

	// update all objects on page
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].draw(context);
	}

	// update all the textboxes on page
	for(var i = 0; i < this.boxes.length; i++) {
		this.boxes[i].draw(context);
	}
	context.restore();
};

