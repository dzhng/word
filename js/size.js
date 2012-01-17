
var FONTS = [ "Lucida Console", "Arial", "Verdana", "Times New Roman", "Georgia", "Courier New" ];
var STYLE = [ "Normal", "Bold", "Italic", "Bold Italic" ];
var CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";		// all printable characters

// Get font letter length as: LetterLen["Arial", "Normal", "a"];
// measured at 72 px font size - scale down from there
var letterWidth = {};

// calculate letter size for all available fonts
var context = document.createElement("canvas").getContext("2d");
for (var f=0; f < FONTS.length; f++) {
	// initialize array
	letterWidth[FONTS[f]] = {};

	for (var s=0; s < STYLE.length; s++) {
		// initialize subarray
		letterWidth[FONTS[f]][STYLE[s]] = {};

		for (var i=0; i < CHARS.length; i++) {
			var fontStr = STYLE[s] + " 72px " + FONTS[f];
			var text = CHARS[i]+CHARS[i]+CHARS[i]+CHARS[i]+CHARS[i];
			context.font = fontStr;
			letterWidth[FONTS[f]][STYLE[s]][CHARS[i]] = Math.round(context.measureText(text).width/5);
		}
	}
}

