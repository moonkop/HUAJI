var reloadTimeOut = 10000;
var videoLength;
var urlStr;
var dataStr;
var sec;
var TimerArea;

var countInterval;
var homeworkTimer;
var episode;
var episodeNum;
var lessonName;
function getStrs() {
	var regxUrl = RegExp("/student.*Time", "g");
	var regxData = RegExp("teachingTaskId.*=", "g");
	var regxTime = /\d+(?=&playTime)/;
	var regEpisode = /\d+/;
	var userstr = document.getElementsByClassName("bottom")[0].innerText;
	var Script = document.getElementsByClassName("content_bg")[0].children[2]
		.innerText;
	episode = regEpisode.exec($("font").html());
	episodeNum = regEpisode.exec($(".nav_info").html());
	lessonName = $(".homeIcon span").html();
	urlStr = regxUrl.exec(Script)[0];
	dataStr = regxData.exec(Script)[0];
	videoLength = Number(regxTime.exec(dataStr));
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
			"  " +
			episode +
			"/" +
			episodeNum +
			"\n<br>" +
			lessonName +
			"\n<br>skipping finished on " +
			mydate.getHours() +
			":" +
			mydate.getMinutes() +
			":" +
			mydate.getSeconds() +
			"\n<br> Completing on " +
			newdate.getHours() +
			":" +
			newdate.getMinutes() +
			":" +
			newdate.getSeconds() +
			"\n<br>Length=" +
			videoLength
		);
		sec -= FirstPostTime;
		return;
	}
	if (PostFinished == 1) {
		PostFinished = 0;
		postOneData(currentPostTime);
	}
}
var FirstPostTime = 0;
function postOneData(PostTime) {
	$.ajax({
		url: urlStr,
		type: "POST",
		data: dataStr + PostTime,
		success: function (result) {
			if (result == "ok") {
				currentPostTime += 200;
				log("Post " + PostTime + " OK");
				PostFinished = 1;
				if (FirstPostTime == 0) {
					FirstPostTime = sec;
				}
			} else {
				console.dir(result);
			}
		},
		error: function () {
			log("Post " + PostTime + " Error");
			PostFinished = 1;
		}
	});
}

function deleteFlashDiv() {
	$("#player-container_wrapper").html("");
}
function InitTimerArea() {
	TimerArea = document.getElementById("nav");
	TimerArea.innerHTML = "";
	sec = 0;
	countInterval = setInterval(count, 1000);
}
function count() {
	sec++;
	TimerArea.innerText = sec + "" + "/" + videoLength;
	if (sec >= videoLength + 20 && (sec - videoLength + 20) % 60 == 0) {
		getfinish();
	}
}

function getfinish() {
	logtoBackgroundPage("try finishing");

	$.ajax({
		async: false,
		type: "POST",
		url: urlStr,
		data: dataStr + videoLength,
		success: function (result) {
			if (result == "complete") {
				log("lessonIsCompelete");
				SendNotification("第" + episode + "集 视频结束 正在前往下一集");
				ReloadWaitingForInject();
			} else {
				log("finishing failed " + result);
				SendNotification("第" + episode + "集 结束失败 正在尝试刷新", "pss");
				ReloadWaitingForInject();
			}
		}
	});
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

function SendStatus() {
	sendToBackgroudFromWxxxVideo({
		action: "Status",
		currentTime: sec,
		episode: episode
	});
}

function goTohomeWork() {
	logtoBackgroundPage("going to homework");
	SendNotification("正在前往作业");
	$("center")
		.eq(2)
		.children()
		.eq(0)
		.click();
	clearInterval(PostTimer);
}

function ReloadWaitingForInject() {
	$(".item.current").click();
	setTimeout(() => {
		window.location.reload();
	}, 60000);
}

function logtoBackgroundPage(str, noforegroundlog) {
	noforegroundlog = arguments[1] ? noforegroundlog : false;
	if (!noforegroundlog) {
		log(str);
	}
	sendToBackgroudFromWxxxVideo({
		action: "Log",
		message: str
	});
}

function homeworkTick() {
	if (document.getElementById("assignmentInfo").innerText.length > 10) {
		goTohomeWork();
		clearInterval(homeworkTimer);
	}
}

function sendToBackgroudFromWxxxVideo(data) {
	sendToBackgroud(data, "WxxxVideo");
}

function Start() {
	deleteFlashDiv();
	log("codeWxxx.js Loaded");
	getStrs();
	dectHomework();
	postAll();
	InitTimerArea();
	detectOverWatch();
	SendNotification("第" + episode + "集 已开始");
	// var aliveSenderTimer=setInterval(SendAlive,30000);
}

//----------------------test-functions---------------

function test1() { }
function test2() {
	ClearAllTimers();
}

$(document).ready(function () {
	log("codeWxxx.js Loaded");
	if ("undefined" == typeof urlStr) {
		Start();
	} else {
		console.log("already started");
	}
});
function detectOverWatch() {
	try {
		if (episode == 1 && $("param[name=flashvars]").attr("value").split("&")[8].split("=")[1] == "true") {
			SubjectOver();
		}
	} catch (error) {

	}

}
function SubjectOver() {
	SendNotification("已完成  " + lessonName + "  所有视频");
	goTohomeWorkList();
}
function goTohomeWorkList() {
	clearInterval(PostTimer);
	$(".assignmentIcon").parent().click();
}