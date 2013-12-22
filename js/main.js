$(document).ready(function() {
	$(document).keypress(function(e) {
		if(document.activeElement.contentEditable != "true")
		{
			$("#cmd-entry > .cmd-input")[0].focus();
			//initPromptFocus();
			window.setTimeout(function() {
				$("#cmd-entry > .cmd-input").trigger(e)
			}, 1);
		}
		else if(e.which == 13) {
			e.preventDefault();
			var currentCommand = $("#cmd-entry").html();
			// alert(typeof(currentCommand));
			// currentCommand.attr('id','');
			currentCommand = currentCommand.replace(' onmouseup="saveSelection();" onkeyup="saveSelection();" onfocus="restoreSelection();" contenteditable="true"','');
			// currentCommand = currentCommand.replace(' id="cmd-input"','');

			$("#cmd-history").append(currentCommand);
			$("#cmd-history").append('<br/>');

			$("#cmd-entry > .cmd-input").html("");
		}
	});

	//initPromptFocus();
	$("#cmd-entry > .cmd-input")[0].focus();
});

// Inspired from http://stackoverflow.com/a/3323835
var savedRange;
function saveSelection()
{
	if(window.getSelection)//non IE Browsers
	{
		savedRange = window.getSelection().getRangeAt(0);
	}
	else if(document.selection)//IE
	{ 
		savedRange = document.selection.createRange();
	} 
	savedRange.collapse();
}

function restoreSelection()
{
	$("#cmd-entry > .cmd-input")[0].focus();
	if (savedRange != null) {
		if (window.getSelection)//non IE and there is already a selection
		{
			var s = window.getSelection();
			if (s.rangeCount > 0) 
				s.removeAllRanges();
			s.addRange(savedRange);
		}
		else if (document.createRange)//non IE and no selection
		{
			window.getSelection().addRange(savedRange);
		}
		else if (document.selection)//IE
		{
			savedRange.select();
		}
	}
}