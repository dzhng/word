
/************** GOLBAL CONSTNATS *******************/ 
var PPI = 72;												// pixel per inch to calibrate everything to
var PAGE_SIZE = {width: 8.5*PPI, height: 11*PPI};			// size for one page, standard paper size, in inches
var pageOffset = {top: 20, bottom: 20};					// page offsets in pixels

/************** GLOBAL VARIABLES *******************/
// global persistant settings
// template: template page variable
var settings = {
	width: window.innerWidth, height: PAGE_SIZE.height + pageOffset.top + pageOffset.bottom, 
	template: null,	background: "rgba(255, 255, 255, 0)", highlightColor: "rgba(20,20,180,0.5)", 
	shadowColor: "rgba(0,0,0,0.5)", imageBorder: 0.2*PPI
};

// contexts for different canvas layers, arranged from low to high
// top context is on the top most layer, so it also captures user input commands
var layers = {
	bottomContext: null, markupLowContext: null, mainContext: null, 
	markupHighContext: null, topContext: null
};

// create a new canvas element per page
var setupLayers = function()
{
	for (context in layers) {
		var canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.height = settings.height;
		canvas.width = settings.width;
		canvas.border = "0 px";
		canvas.tabIndex = 1;			// make canvas focusable
		canvas.style.visibility = "visible";
		canvas.style.position = "absolute";
		canvas.style.top = 0;
		canvas.style.left = 0;
		layers[context] = canvas.getContext("2d");

		// setup context for drawing
		layers[context].textAlign = "left";
		layers[context].textBaseline = "alphabetic";
		layers[context].clearRect(0,0,settings.height, settings.width);
	}
}

// initialize the curser at default position, also keeps track of current page, box..etc
// index: the index of the cursor in the text, (x,y): location of the cursor on the current page, style: style at the current cursor
var cursor = {index: 0, x: 0, y: 0, style: new Style("rgb(0,0,0)", "Arial", "Normal", "11", "none", "even")};

