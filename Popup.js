var bg = chrome.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", function() {
	var divs = document.getElementById("startwxxx");
	divs.addEventListener("click", bg.startNewWxxx);
});
document.addEventListener("DOMContentLoaded", function() {
	var divs = document.getElementById("startszjy");
	divs.addEventListener("click", bg.startNewSzjy);
});
document.addEventListener("DOMContentLoaded", function() {
	var divs = document.getElementById("getFinish");
	divs.addEventListener("click", bg.getFinish);
});
document.addEventListener("DOMContentLoaded", function() {
	var divs = document.getElementById("forceReload");
	divs.addEventListener("click", bg.ReloadCurrentTab);
});
document.addEventListener("DOMContentLoaded", function() {
	var divs = document.getElementById("deleteFlashDiv");
	divs.addEventListener("click", bg.deleteFlashDiv);
});
document.addEventListener("DOMContentLoaded", function() {
	var divs = document.getElementById("doAssignments");
	divs.addEventListener("click", bg.doAssignments);
});
document.addEventListener("DOMContentLoaded", function() {
	var divs = document.getElementById("test2");
	divs.addEventListener("click", bg.test2);
});
