var allowedCommands = ["cd", "mkdir", "rm", "ls"];
var currentDirectory = fileSystem;

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
			var command = $("#cmd-entry > .cmd-input").html();
			// Getting rid of all HTML tags
			command  = $("<div/>").html(command).text();
			$("#cmd-entry > .cmd-input").html(command);

			// Adding to history
			var currentCommand = $("#cmd-entry").html();
			currentCommand = currentCommand.replace(' onmouseup="saveSelection();" onkeyup="saveSelection();" onfocus="restoreSelection();" contenteditable="true"','');

			$("#cmd-history").append(currentCommand);
			$("#cmd-history").append('<br>');

			// Clearing prompt
			$("#cmd-entry > .cmd-input").html("");

			// Processing
			var result = processCommand(command);
			console.log("Result was " + command + "     --?    " + result);
			if(result.length != 0)
			{
				$("#cmd-history").append("<span>" + result + "</span>");
				$("#cmd-history").append('<br>');
			}

			var terminalDiv = $("#terminal")[0];
			terminalDiv.scrollTop = terminalDiv.scrollHeight;
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

function processCommand(commandLine)
{
	// Trimming..
	commandLine = commandLine.trim();
	var delimIndex = commandLine.indexOf(" ");
	var command = commandLine.split(" ");

	if(commandLine.length == 0)
		return "";

	if(allowedCommands.indexOf(command[0]) == -1)
		return command[0] + ": command not found";

	var result = "";
	switch(command[0])
	{
		case "cd":
		if(command[1] == ".")
			break;
		if(command[1] == "..")
		{
			if(!currentDirectory.isRoot())
			{
				currentDirectory = currentDirectory.parent;
				if(currentDirectory.isRoot())
					$("#cmd-entry > .cmd-prompt > #location").html("/");
				else
				{
					var oldPrompt = $("#cmd-entry > .cmd-prompt > #location").html();
					var newPrompt = oldPrompt.substring(0,oldPrompt.lastIndexOf("/"));
					$("#cmd-entry > .cmd-prompt > #location").html(newPrompt);
				}
			}
		}
		else if(command[1] == "/")
		{
			currentDirectory = fileSystem;
			$("#cmd-entry > .cmd-prompt > #location").html("/");

		}
		else
		{
			var newDirectory = currentDirectory.directoryByName(command[1]);
			if(newDirectory == null)
				result = "cd: " + command[1] + ": No such directory!";
			else
			{
				currentDirectory = newDirectory;
				var oldPrompt = $("#cmd-entry > .cmd-prompt > #location").html();
				var newPrompt = oldPrompt;
				if(oldPrompt[oldPrompt.length-1] != "/")
					newPrompt += "/";
				newPrompt += currentDirectory.name;
				$("#cmd-entry > .cmd-prompt > #location").html(newPrompt);
			}
		}
		break;
		case "ls":
		result = currentDirectory.listAll();
		break;
		case "mkdir":
		if(currentDirectory.childByName(command[1]) == null)
		{
			currentDirectory.addDirectory(new Directory(command[1], new Date()));
		}
		else
		{
			result = "mkdir: cannot create directory '" + command[1] + "': File exists";
		}
		break;
		case "rm":
		break;
		default:
		result = command[0] + ": command not found";
	}
	return result;
}