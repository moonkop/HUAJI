var reloadTimeOut = 10000;
var videoLength;
var urlStr;
var dataStr;
var username;
var userid;
var sec;
var TimerArea;
var LogArea;
var countInterval;
var homeworkTimer;
var episode;
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
	$(".top").append(str);
	LogArea = document.getElementById("log-body");
}

function getStrs() {
	logtoBackgroundPage("getting strs");
	var regxUrl = RegExp("/student.*Time", "g");
	var regxData = RegExp("teachingTaskId.*=", "g");
	var regxTime = /\d+(?=&playTime)/;
	var regxId = /\d+(?=\s+姓名)/;
	var regEpisode = /\d+/;
	var regxName = /[\u4e00-\u9fa5]+(?=\s+【)/;
	var userstr = document.getElementsByClassName("bottom")[0].innerText;
	var Script = document.getElementsByClassName("content_bg")[0].children[2]
		.innerText;
	episode = regEpisode.exec($("font").html());
	username = regxName.exec(userstr)[0];
	userid = regxId.exec(userstr)[0];
	urlStr = regxUrl.exec(Script)[0];
	dataStr = regxData.exec(Script)[0];
	videoLength = Number(regxTime.exec(dataStr));
	logtoBackgroundPage("dataStr=" + dataStr);
	logtoBackgroundPage("urlStr=" + urlStr);
}

function init() {
	logtoBackgroundPage("getting strs");

	var regxUrl = RegExp("/student.*Time", "g");
	var regxData = RegExp("isOpen.*=", "g");

	var regxTime = /\d + (?=& playTime)/;
	var regxId = /\d + (?= \s + 姓名)/;
	var regxName = /[\u4e00 - \u9fa5] + (?= \s + 【)/;
	var userstr = $(".welcome")
		.children()
		.eq(2)
		.html();
	var Script = $(".content_bg_1")
		.children()
		.eq(3)
		.html();

	try {
		urlStr = regxUrl.exec(Script)[0];
		dataStr = regxData.exec(Script)[0];
	} catch (error) {
		logtoBackgroundPage(
			"Critical error: DataStr or UrlStr undefined" +
				error.message +
				" Reloading"
		);
		ReloadWaitingForInject();
	}

	try {
		username = regxName.exec(userstr)[0];
		userid = regxId.exec(userstr)[0];
	} catch (error) {
		logtoBackgroundPage("error userStr undefined" + error.message);
	}

	videoLength = Number(regxTime.exec(dataStr));
	logtoBackgroundPage("dataStr=" + dataStr);
	logtoBackgroundPage("urlStr=" + urlStr);
}

var PostTimer;
function postAll() {
	log("skipping to end");

	PostTimer = setInterval(postTick, 200);
}
var currentPostTime = 0;
var PostFinished = 1;
function postTick() {
	if (currentPostTime > videoLength) {
		clearInterval(PostTimer);
		var mydate = new Date();
		var ts = mydate.getTime();
		var newdate = new Date();
		newdate.setTime(ts + 1000 * (videoLength + 20));
		log_Clear();
		logtoBackgroundPage(
			userid +
				" " +
				username +
				$("font").html() +
				"<br>" +
				"skipping finished on " +
				mydate.getHours() +
				":" +
				mydate.getMinutes() +
				":" +
				mydate.getSeconds() +
				"  <br> Completing on " +
				newdate.getHours() +
				":" +
				newdate.getMinutes() +
				":" +
				newdate.getSeconds() +
				"<br>Length=" +
				videoLength
		);
		return;
	}
	if (PostFinished == 1) {
		PostFinished = 0;
		postOneData(currentPostTime);
	}
}
function postOneData(PostTime) {
	$.ajax({
		url: urlStr,
		type: "POST",
		data: dataStr + PostTime,
		success: function(result) {
			if (result == "ok") {
				currentPostTime += 200;
				log("Post " + PostTime + " OK");
				PostFinished = 1;
			} else {
				console.dir(result);
			}
		},
		error: function() {
			log("Post " + PostTime + " Error");
			PostFinished = 1;
		}
	});
}

function deleteFlashDiv() {
	$("#player-container_wrapper").html("");
}
function changeNavi() {
	TimerArea = document.getElementById("nav");
	TimerArea.innerHTML = "";
	sec = 0;
	countInterval = setInterval(count, 1000);
}
function count() {
	sec++;
	TimerArea.innerText = sec + "" + "/" + videoLength;
	if (sec > videoLength + 20 && sec % 10 == 0) {
		getfinish();
	}
}

function getfinish() {
	logtoBackgroundPage("try finishing");

	$.ajax({
		async: false,
		type: "POST",
		url: urlStr,
		data: dataStr + videoLength, //此处改为视频时间
		success: function(result) {
			if (result == "complete") {
				log("lessonIsCompelete");
				console.dir(result);
				ReloadWaitingForInject();
			} else {
				log("finishing failed");
				console.dir(result);
				ReloadWaitingForInject();
			}
		}
	});
}
function ClearAllTimers() {
	// clearInterval(4); //停止系统自带上传进度计时器
	// clearInterval(1); 				//停止焦点状态检测计时器
	// clearInterval(3); 		//停止时间记录计时器

	for (var i = 0; i < 100; i++) {
		clearInterval(i);
	}
}
var homeworkIsAlerted = 0;
function dectHomework() {
	homeworkIsAlerted = -1;
	if (homeworkIsAlerted < 5) {
		homeworkTick();
		homeworkTimer = setInterval(homeworkTick, 60000);
	}
}

//---------------interactions

function SendAlive() {
	sendToBackgroud({
		action: "Alive"
	});
}

function goTohomeWork() {
	logtoBackgroundPage("going to homework");
	$("center")
		.eq(2)
		.children()
		.eq(0)
		.click();
}

function ReloadWaitingForInject() {
	$(".item.current").click();
}

function logtoBackgroundPage(str, noforegroundlog) {
	noforegroundlog = arguments[1] ? noforegroundlog : false;
	if (!noforegroundlog) {
		log(str);
	}
	sendToBackgroud({
		action: "Log",
		message: str
	});
}

function homeworkTick() {
	if (document.getElementById("assignmentInfo").innerText.length > 10) {
		sendToBackgroud({
			action: "Homework"
		});
		goTohomeWork();
		clearInterval(homeworkTimer);
	}
}

function sendToBackgroud(data) {
	data.UserId = userid;
	data.UserName = username;
	data.lessonType = "Wxxx";
	chrome.runtime.sendMessage(data);
}

function autoComplete() {
	ClearAllTimers();
	deleteFlashDiv();
	initLogArea();
	logtoBackgroundPage("starting");
	getStrs();
	dectHomework();
	postAll();
	changeNavi();
	// var aliveSenderTimer=setInterval(SendAlive,30000);
}

//----------------------test-functions---------------

function test1() {}
function test2() {
	ClearAllTimers();
}

$(document).ready(function() {
	if ("undefined" == typeof urlStr) {
		console.log("starting");
		autoComplete();
	} else {
		console.log("already started");
	}
});
