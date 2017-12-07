window.addEventListener(
	"message",
	function(event) {
		// We only accept messages from ourselves
		if (event.source != window) return;
		console.log(event.data);
	},
	false
);
