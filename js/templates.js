// stores all template pages

var TwoColumns = function(model)
{
	var box1 = new TextBox(PPI, PPI,	// offset box by 1 inch from page by default;		
					(PAGE_SIZE.width - 2*PPI)/2,
					PAGE_SIZE.height - 2*PPI, this);

	var box2 = new TextBox(PPI+(PAGE_SIZE.width-2*PPI)/2, PPI,	// offset box by 1 inch from page by default;		
					(PAGE_SIZE.width - 2*PPI)/2,
					PAGE_SIZE.height - 2*PPI, this);

	box1.visible = true;
	box2.visible = true;
	this.boxes = [box1, box2];
	this.model = model || null;
};

TwoColumns.prototype = new Page;

var FourBoxes = function(model)
{
	var box0 = new TextBox(PPI, PPI,	// offset box by 1 inch from page by default;		
					(PAGE_SIZE.width - 2*PPI)/2,
					(PAGE_SIZE.height - 2*PPI)/3, this);

	var box1 = new TextBox(PPI, 2*PPI+(PAGE_SIZE.height-2*PPI)/3,	// offset box by 1 inch from page by default;		
					(PAGE_SIZE.width - 2*PPI)/2,
					(PAGE_SIZE.height - 2*PPI)*2/3 - 2*PPI, this);

	var box2 = new TextBox(PPI+(PAGE_SIZE.width-2*PPI)/2, PPI,	// offset box by 1 inch from page by default;		
					(PAGE_SIZE.width - 2*PPI)/2,
					(PAGE_SIZE.height - 2*PPI)/2, this);

	var box3 = new TextBox(PPI+(PAGE_SIZE.width-2*PPI)/2, 2*PPI+(PAGE_SIZE.height-2*PPI)/2,	// offset box by 1 inch from page by default;		
					(PAGE_SIZE.width - 2*PPI)/2,
					(PAGE_SIZE.height - 2*PPI)/2 - PPI, this);
	
	box0.visible = true;
	box1.visible = true;
	box2.visible = true;
	box3.visible = true;
	this.boxes = [box0, box1, box2, box3];
	this.model = model || null;
};

FourBoxes.prototype = new Page;

