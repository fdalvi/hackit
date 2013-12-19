$(document).ready(function() {
	$(document).keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			var currentCommand = $("#cmd-entry").html();
			// alert(typeof(currentCommand));
			// currentCommand.attr('id','');
			// currentCommand = currentCommand.replace(' id="cmd-prompt"','');
			// currentCommand = currentCommand.replace(' id="cmd-input"','');

			$("#cmd-history").append(currentCommand);
			$("#cmd-entry > #cmd-input").html("");
		}
	});
});
