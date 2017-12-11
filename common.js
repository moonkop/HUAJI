var username;
var userid;
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
function getUserInfo() {
	var regxName = /[\u4e00-\u9fa5]+(?=\s+【)/;
	var regxId = /\d+(?=\s+姓名)/;
	try {
		var userstr = document.getElementsByClassName("bottom")[0].innerText;
		username = regxName.exec(userstr)[0];
		userid = regxId.exec(userstr)[0];
		log(username + "  " + userid);
	} catch (error) {
		log("cant get user name and id");
	}
}
function goToCourseHomePage() {
	window.location.href = "student/teachingTask/coursehomepage.do?courseId=" + GetQueryString(courseId);
}
var myTimerArray = [];

function sendToBackgroud(data, pageName) {
	data.UserId = userid;
	data.UserName = username;
	data.pageName = pageName;
	try {
		chrome.runtime.sendMessage(data);
	} catch (error) {
		console.log("cant connect to background");
		console.dir(error);
	}
}

function SendNotification(note, icon = "hj", requireInteraction = false) {
	sendToBackgroud(
		{
			action: "Notification",
			icon: icon,
			Notification: note,
			requireInteraction: requireInteraction
		},
		"note"
	);
}

var LogArea;
function log(str) {
	LogArea.innerHTML += str + "<br>";
	console.log(str);
}

function log_Clear() {
	LogArea.innerHTML = "";
}

function initLogArea() {
	var str =
		'<div id="mask" style="background: rgba(255,255,255,0.7);float: left;z-index: 2;position: absolute;">	<div id="log-body" style="min-width: 100px;width: auto;min-height: 0;height: auto;border: 1px solid #DDDDDD;opacity: 2;"></div>	</div>';
	$("body").prepend(str);
	LogArea = document.getElementById("log-body");
}

$(document).ready(function () {
	getUserInfo();
});
initLogArea();
log("common.js Loaded");
