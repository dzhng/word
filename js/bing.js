// Replace the following string with the AppId you received from the
// Bing Developer Center.
var AppId = "F0729D08BC4BB526435E658A9FB3915E13D96378";
var bingCallback;		// callback function

// Bing API 2.0 code sample demonstrating the use of the
// Image SourceType over the JSON Protocol.
function Search(Query, offset, callback)
{
	// set callback function
	bingCallback = callback;

	var requestStr = "http://api.bing.net/json.aspx?"
	
		// Common request fields (required)
		+ "AppId=" + AppId
		+ "&Query=" + Query
		+ "&Sources=Image"
		
		// Common request fields (optional)
		+ "&Version=2.0"
		+ "&Market=en-us"
		+ "&Adult=Moderate"

		// Image-specific request fields (optional)
		+ "&Image.Count=15"
		+ "&Image.Offset=" + offset

		// JSON-specific request fields (optional)
		+ "&JsonType=callback"
		+ "&JsonCallback=SearchCompleted";  

	var head = document.getElementsByTagName('head');
	var script = document.createElement('script');
	script.type = "text/javascript";
	script.src = requestStr;
	head[0].appendChild(script);
}

function SearchCompleted(response)
{
	var errors = response.SearchResponse.Errors;
	if (errors != null)
	{
		// There are errors in the response. Display error details.
		DisplayErrors(errors);
	}
	else
	{
		// There were no errors in the response. Display the
		// Image results.
		DisplayResults(response);
	}
}

function DisplayResults(response)
{
	var images = [];	// return array of images
	var results = response.SearchResponse.Image.Results;
	if(results == undefined || results.length <= 0) {
		bingCallback(undefined);
		return;
	}

	// Display the Image results.
	var img = null;
	for (var i = 0; i < results.length; ++i)
	{
		img = {bigUrl: results[i].MediaUrl, bg_width: results[i].Width, bg_height: results[i].Height,
			smallUrl: results[i].Thumbnail.Url, sm_width : results[i].Thumbnail.width, sm_height: results[i].Thumbnail.height};
		images.push(img);
	}
	bingCallback(images);
	return;
}

function DisplayErrors(errors)
{
	// Iterate over the list of errors and display error details.
	console.error("Bing errors: ");
	var errorsListItem = null;
	for (var i = 0; i < errors.length; ++i)
	{
		for (var errorDetail in errors[i])
		{
			console.error(errorDetail + ": " + errors[i][errorDetail] + "\n");
		}
	}
}

