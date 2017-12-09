function detect502() {
	return $("center")
		.eq(0)
		.text()
		.startsWith("50");
}

$(document).ready(function() {
	if (detect502()) {
		setTimeout(() => {
			window.location.href = "";
		}, 3000);
	}
});
