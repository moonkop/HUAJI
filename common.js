var username;
var userid;
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

function goToCourseHomePage() {
	if (GetQueryString("courseId") != null) {
		window.location.href = "student/teachingTask/coursehomepage.do?courseId=" + GetQueryString("courseId");
	}
	else if ($(".homeIcon") != []) {
		$(".homeIcon").parent().click();
	} else if ($(".mainNavLi").eq(1).find("li").length == 1) {
		$(".mainNavLi").eq(1).find("li").click();
	}
	else {
		window.location.href = "/student/index.do?1513014567024";
	}
	//
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

function SendNotification(note, level) {
	sendToBackgroud(
		{
			action: "Notification",
			level: level,
			Notification: note,
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

function disableAlert() {
	var script = document.createElement("script");
	script.innerHTML = 'alert=comfirm=function(){}';
	document.body.appendChild(script);
}

initLogArea();
disableAlert();
log("common.js Loaded");
