// text editor page
// Keeps track of textboxes in pages
// Written by: David Zhang

// TODO: 
// when adding boxes, check if the new box can fit - if not, return false so the model can make a new page for it
//
// NOTE:
// There is no concept of page margin in this editor, this is abstracted away
// by the object oriented model of using dynmanicly placed boxes

/************** OBJECT DECLARATION *******************/
var Page = function(model)
{
	this.model = model || null;

	this.width = PAGE_SIZE.width;
	this.height = PAGE_SIZE.height;

	this.background = "rgb(250,250,250)";

	// array of text boxes in the current page
	this.boxes = [];
	// array of objects in the current page
	this.objects = [];

	this.dragging = null;	// currently dragging object
	this.highlightStart = 0;	// highlight start position
};

Page.prototype = new cObject;

/************** BUILTIN FUNCTIONS *******************/
// input is point on the page, using page coordinates
// find the box nearest to the point on the page, looking at boxes' edges
Page.prototype.getBoxFromPoint = function(x, y)
{
	//console.log("clicked x:%d, y:%d", x,y);

	// stores index of closest box
	var closest = -1;

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
	//console.log("box %d selected", closest);
	// convert point to box coordinate space and update cursor location
	return this.boxes[closest].getLocationFromPoint(x - this.boxes[closest].x, y - this.boxes[closest].y);
};

Page.prototype.getObjectFromPoint = function(x, y)
{
	// iterate through all objects and see if any is hovering
	for(i = 0; i < this.objects.length; i++) {
		if(this.objects[i].isHovering(x, y)) {
			this.dragging = this.objects[i];
			//console.log("dragging object %d", i);
			return true;
		}
	}
	this.dragging = null;
	return false;
};

Page.prototype.updateDrag = function(x, y)
{
	if(this.dragging != null) {
		var nx = x-this.x-this.dragging.xoff;
		var ny = y-this.y-this.dragging.yoff;

		var dx = nx - this.dragging.x;
		var dy = ny - this.dragging.y;
		
		// optimize the x
		while(dx != 0) {
			dx = nx - this.dragging.x;
			for(i = 0; i < this.objects.length; i++) {
				if(this.objects[i] != this.dragging && this.objects[i].isIntersecting(this.dragging)) {
					break;
				}
			}
			if(i == this.objects.length && this.dragging.x >= 0 && this.dragging.x+this.dragging.width <= this.width) {
				// no intersection found, reduce x
				if(dx > 0) this.dragging.x++; else this.dragging.x--;
			} else {
				// intersection found, revert x
				if(dx > 0) this.dragging.x--; else this.dragging.x++;
				break;
			}
		}

		// optimize y
		while(dy != 0) {
			dy = ny - this.dragging.y;
			for(i = 0; i < this.objects.length; i++) {
				if(this.objects[i] != this.dragging && this.objects[i].isIntersecting(this.dragging)) {
					break;
				}
			}
			if(i == this.objects.length && this.dragging.y >= 0 && this.dragging.y+this.dragging.height <= this.height) {
				// no intersection found, reduce x
				if(dy > 0) this.dragging.y++; else this.dragging.y--;
			} else {
				// intersection found, revert x
				if(dy > 0) this.dragging.y--; else this.dragging.y++;
				break;
			}
		}

		this.dragging.setPoint(this.dragging.x, this.dragging.y);

		// format if there's any text on the page
		if(this.boxes.length > 0) {
			// reformat all text starting with the first letter on the page
			this.model.section.format(this.boxes[0].index.start);	
		} 
		this.drawMain();
	} else if(this.model.section.chars.length > 0) {
		if(this.getBoxFromPoint(x-this.x, y-this.y)) {
			// set start highlight index if it's not set
			// mark highlighted chars
			this.model.section.highlight(this.highlightStart, cursor.index);
		} else {
			this.model.section.highlight(this.highlightStart, this.model.section.chars.length-1);
		}
		this.drawMarkup();
	}
};

Page.prototype.stopDrag = function(x, y)
{
	if(this.dragging != null) {
		// stop dragging any objects
		this.dragging = null;
	} else {
		//console.log("highlighted text from %d to %d", this.highlightStart, cursor.index);
		if(this.highlightStart == cursor.index) {
			this.model.section.resetHighlight();
			this.drawMarkup();
		}
	}
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
	// format if there's any text on the page
	if(this.boxes[0].lines[0].chars[0] != undefined) {
		var idx = this.boxes[0].lines[0].chars[0].index;
		this.model.section.format(idx);	// reformat all text starting with the first letter on the page
	} else {
		this.model.section.format(0);	// else, format from beginning so we can fill the new box
	}
	this.drawMain();
	console.log("box added, total of %d boxes on page", this.boxes.length);
	console.log("box: (x:%d, y:%d), curHeight: %d" , box.x, box.y, box.curHeight);

	return true;
};

Page.prototype.addImage = function(image)
{
	image.visible = true;
	this.objects.push(image);
	// format if there's any text on the page
	if(this.boxes[0].lines[0].chars[0] != undefined) {
		var idx = this.boxes[0].lines[0].chars[0].index;
		this.model.section.format(idx);	// reformat all text starting with the first letter on the page
	} 
	this.drawMain();
	console.log("image: (x:%d, y:%d)" , image.x, image.y);
	return false;
};

Page.prototype.updateClick = function(x, y)
{
	// first see if an object can be selected
	if(this.getObjectFromPoint(x-this.x, y-this.y) == false) {
		// find new section and index for cursor
		if(this.getBoxFromPoint(x-this.x, y-this.y)) {
			this.highlightStart = cursor.index;
			this.drawMarkup();	// draw the cursor
			return true;
		}
	} else {
		this.model.section.resetHighlight();
		this.drawMarkup();
	}
	// return false means cursor is the last index in section
	return false;
};

// check for obsticles and returns an x offset and width offset
Page.prototype.checkObsticle = function(x, y, width, height)
{
	var b = settings.imageBorder;
	// x1 is for left beginning x coord, x2 is for right ending coord
	var x1, x2;
	// we want to maximize x1, minimize x2
	var mx1 = x, mx2 = x+width;

	// iterate through upper layers and see if there's anything in the way
	for(var i = 0; i < this.objects.length; i++) {
		var obj = this.objects[i];
		// check for y axis intersecting
		if((y > obj.y-b && y < obj.y+obj.height+b) || 
				(y+height > obj.y-b && y+height < obj.y+obj.height+b) ||
				(y > obj.y-b && y+height < obj.y+obj.height+b) || 
				(y < obj.y-b && y+height > obj.y+obj.height+b)) {
			// TODO: object is in between the lines
			// check if object is on left or right
			if((obj.x-b > x) && (obj.x-b < x+width)) {
				// object is on right side, modify the width so its shorter
				x1 = x;
				x2 = obj.x-b;
			} else if((obj.x+obj.width+b > x) && (obj.x+obj.width+b < x+width)) {
				// object is on the left side, shift x value right and change width so its shorter
				//console.log("width: %d", (x+width - (obj.x+obj.width)));
				x1 = obj.x+obj.width+b;
				x2 = x+width;
			}
			// maximize mx1
			if(x1 > mx1) {
				mx1 = x1;
			}
			// minimize x2
			if(x2 < mx2) {
				mx2 = x2;
			}
		}
	}
	var w = mx2 - mx1;
	return {nX: mx1, nWidth: (w<0) ? 0 : w};
};

Page.prototype.drawBackground = function()
{
	var context = layers.bottomContext;

	// TODO: Selective clearing. clear the entire canvas before drawing background
	context.clearRect(0,0,context.canvas.width,context.canvas.height);

	context.save();
	context.shadowOffsetX = 5;
	context.shadowOffsetY = 5;
	context.shadowBlur    = 4;
	context.shadowColor   = settings.shadowColor;
	context.fillStyle = this.background;
	context.fillRect(this.x,this.y,this.width, this.height);
	context.restore();
};

Page.prototype.drawMain = function()
{
	var context = layers.mainContext;

	context.save();
	context.translate(this.x, this.y);
	context.clearRect(0,0,this.width, this.height);

	// update all objects on page
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].draw();
	}

	cursor.style.fontString = "";
	cursor.style.color = "";

	for(var i = 0; i < this.boxes.length; i++) {
		this.boxes[i].drawText();
	}

	context.restore();
};

Page.prototype.drawMarkup = function()
{
	var context = layers.markupLowContext;

	context.save();
	context.translate(this.x, this.y);

	context.clearRect(0,0,this.width, this.height);
	context.fillStyle = settings.highlightColor;

	// draw the highlights
	for(var i = 0; i < this.boxes.length; i++) {
		this.boxes[i].drawMarkup();
	}
	context.restore();
};

