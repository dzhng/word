// text editor page
// Keeps track of textboxes in pages
// Written by: David Zhang

// TODO: 
// when adding boxes, check if the new box can fit - if not, return false so the model can make a new page for it
//
// NOTE:
// There is no concept of page margin in <INSERT NAME HERE>, this is abstracted away
// by the object oriented model of using dynmanicly placed boxes

/************** CONSTNATS *******************/ 

/************** GLOBAL VARIABLES *******************/

/************** OBJECT DECLARATION *******************/
var Page = function(pageSize)
{
	this.width = pageSize.width;
	this.height = pageSize.height;

	this.background = "rgb(250,250,250)";

	// create a new canvas element per page
	this.canvas = document.createElement('canvas');
	document.body.appendChild(this.canvas);
	this.canvas.height = this.height;
	this.canvas.width = this.width;
	this.canvas.border = "0 px";
	this.canvas.tabIndex = 1;			// make canvas focusable
	this.canvas.style.position = "absolute";
	this.context = this.canvas.getContext("2d");

	this.hide();

	// setup context for drawing
	this.context.textAlign = "left";
	this.context.textBaseline = "alphabetic";

	// array of text boxes in the current page
	this.boxes = [];
	// array of objects in the current page
	this.objects = [];

	this.dragging = null;	// currently dragging object
};

/************** BUILTIN FUNCTIONS *******************/
Page.prototype.setPosition = function(x, y)
{
	console.log("page position set to (%d,%d)", x, y);
	this.canvas.style.top = y;
	this.canvas.style.left = x;
};

Page.prototype.setVisible = function()
{
	this.canvas.style.visibility = "visible";
};

Page.prototype.hide = function()
{
	this.canvas.style.visibility = "hidden";
};

// clear the page canvas
Page.prototype.clear = function()
{
	// clear the page canvas of all drawn objects
	this.context.fillStyle = this.background;
	this.context.clearRect(0,0,this.width, this.height);
};

// input is point on the page, using page coordinates
// find the box nearest to the point on the page, looking at boxes' edges
Page.prototype.getBoxFromPoint = function(x, y)
{
	console.log("clicked x:%d, y:%d", x,y);

	// stores index of closest box
	var closest = 0;
	// distance to the cloest box
	var cDist = 99999;

	// if there are only one box on page, then no need to do any math
	if(this.boxes.length <= 0) {
		console.log("No boxes found on this page\n");
		return false;
	} else if(this.boxes.length == 1) {
		closest = 0;
	} else { 
		var a1, b1, a2, b2, box, distance;
		for(var i = 0; i < this.boxes.length; i++) {
			box = this.boxes[i];
			// find the distance between point and box's edge
			b1 = Math.abs(box.y + box.height/2 - y);
			a1 = Math.abs(box.x + box.width/2 - x);
			if(b1 > a1) {
				// y axis is higher, that means the point must be on top or bottom.
				// this also means the height is already known
				b2 = box.height/2;
				a2 = (b2/b1)*a1;
			} else {
				// x axis is higher, this means the point must be on left or right.
				// this also means the width is already known
				a2 = box.width/2;
				b2 = (b1/a1)*a2;
			}
			// use pythagoras theorem to find the distance
			distance = Math.sqrt(Math.pow(a1,2) + Math.pow(b1,2)) - Math.sqrt(Math.pow(a2,2) + Math.pow(b2,2));
			if(distance < cDist) {
				cDist = distance;
				closest = i;
			}
		}
	}
	// convert point to box coordinate space and update cursor location
	this.boxes[closest].getLocationFromPoint(x - this.boxes[closest].x, y - this.boxes[closest].y);
	return true;
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
		this.getBoxFromPoint(x-this.x, y-this.y);
	}
};

Page.prototype.checkObsticle = function(x, y, width, height)
{
	// iterate through upper layers and see if there's anything in the way
};

Page.prototype.draw = function()
{
	// don't draw if not visible
	if(!this.visible) {
		return;
	}

	this.clear();

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

