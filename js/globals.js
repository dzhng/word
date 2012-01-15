
/************** GOLBAL CONSTNATS *******************/ 
var PPI = 72;												// pixel per inch to calibrate everything to
var PAGE_SIZE = {width: 8.5*PPI, height: 11*PPI};			// size for one page, standard paper size, in inches
var MAX_IDX = 9999999;										// max index for chars in section

/************** GLOBAL VARIABLES *******************/
// global persistant settings
// template: template page variable
var settings = {template: null, mainContext: null, bottomContext: null, topContext: null, background: "rgba(255, 255, 255, 0)", highlightColor: "rgba(20,20,180,0.5)",
				imageBorder: 0.2*PPI};

// initialize the curser at default position, also keeps track of current page, box..etc
// index: the index of the cursor in the text, (x,y): location of the cursor on the current page, style: style at the current cursor
var cursor = {index: 0, x: 0, y: 0, style: new Style("rgb(0,0,0)", "Arial", "Normal", "11", "none", "even")};
		
