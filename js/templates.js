// stores all template pages

var box1 = new TextBox(PPI, PPI,	// offset box by 1 inch from page by default;		
				(PAGE_SIZE.width - 2*PPI)/2,
				PAGE_SIZE.height - 2*PPI);

var box2 = new TextBox(PPI+(PAGE_SIZE.width-2*PPI)/2, PPI,	// offset box by 1 inch from page by default;		
				(PAGE_SIZE.width - 2*PPI)/2,
				PAGE_SIZE.height - 2*PPI);

var TwoColumns = new Page(PAGE_SIZE);
TwoColumns.boxes.push(box1);
TwoColumns.boxes.push(box2);

