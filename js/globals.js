
/************** GOLBAL CONSTNATS *******************/ 
var PPI = 72;												// pixel per inch to calibrate everything to
var PAGE_SIZE = {width: 8.5*PPI, height: 11*PPI};			// size for one page, standard paper size, in inches

/************** GLOBAL VARIABLES *******************/
// global persistant settings
// template: template page variable
var settings = {template: null};

// initialize the curser at default position, also keeps track of current page, box..etc
// index: the index of the cursor in the text, (x,y): location of the cursor on the current page, style: style at the current cursor
var cursor = {index: 0, x: 0, y: 0, style: new Style("rgb(0,0,0)", "Arial", "Normal", "11", "none", "even")};
		
