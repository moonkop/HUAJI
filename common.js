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
	var offset= $("#log-body").height()-$("#log-body").parent().height()
	$("#log-body").parent().scrollTop(offset);
	console.log(str);
}

function log_Clear() {
	LogArea.innerHTML = "";
}

function initLogArea() {
	var str = `<div style="
position: fixed;
width: 100%;
"><div style="
height: 10px;
background-color: #FFF;">
<div  id="progress_total"
style="
background-color: #4f5dd5;
width: 0%;
height: 5px;">
</div>
<div id="progress_eposide"
style="
background-color: #4fd5a3;
width: 0%;
height: 5px;">
</div>
</div>
<div style="min-width: 100px;width: auto;min-height: 0;height: auto;opacity: 2;position: fixed;top: 10px;bottom: 0;overflow: auto;">
<div id="log-body"  style="background: rgba(255,255,255,0.8);"> </div>
</div>`
	$("body").prepend(str);


	LogArea = document.getElementById("log-body");
}
function setTotalProgress(percent) {
	$("#progress_total").css("width", percent*100 + "%")
}
function setEposideProgress(percent) {
	$("#progress_eposide").css("width", percent*100 + "%")
}

function disableAlert() {
	var script = document.createElement("script");
	script.innerHTML = 'alert=comfirm=function(){}';
	document.body.appendChild(script);
}
function ClearAllTimers() {
	for (var i = 0; i < 100; i++) {

		clearInterval(i);
	}
}


initLogArea();
disableAlert();
log("common.js Loaded");
