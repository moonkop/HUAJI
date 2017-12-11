var examReplyId; //这三个变量每套作业中一样，不同作业中不一样
var examId;
var teachingTaskId;
var reloadTimeOut = 5000;
var examStudentExerciseId; //这两个变量每个题目都不一样 可在list中获取
var exerciseId;
var saveAnswerURL;
var DXanswerMap = ["A", "B", "C", "D"];
var PDanswerMap = ["A", "B"];
var DUOanswerMap = [
	["A", "B"],
	["A", "C"],
	["A", "D"],
	["B", "C"],
	["B", "D"],
	["C", "D"],
	["A", "E"],
	["B", "E"],
	["C", "E"],
	["D", "E"],
	["A", "B", "C"],
	["A", "B", "D"],
	["A", "C", "D"],
	["B", "C", "D"],
	["A", "B", "E"],
	["A", "C", "E"],
	["A", "D", "E"],
	["B", "C", "E"],
	["B", "D", "E"],
	["C", "D", "E"],
	["A", "B", "C", "D"],
	["A", "B", "C", "E"],
	["A", "B", "D", "E"],
	["A", "C", "D", "E"],
	["B", "C", "D", "E"],
	["A", "B", "C", "D", "E"],
	["A"],
	["B"],
	["C"],
	["D"],
	["E"]
];
var AnswerTypeMap = {
	"1": "DX",
	"2": "PD",
	"4": "DUO",
	"100": "SKIP"
};
function doAssignments() {
	getParams();
	SendNotification("正在完成作业");
	$.each(examStudentExerciseSerialList, function (index, value) {
		log("working on No." + (index + 1));
		tryAnswers(value.exerciseId, value.examStudentExerciseId);
	});
	SendNotification("作业已完成");
	handExam();
	setTimeout(() => {
		GoBack();
	}, reloadTimeOut);
}

function handExam() {
	getParams();
	tryPost(
		{
			type: "POST",
			async: false,
			url:
				"/student/exam/manageExam.do?method=handExam&examReplyId=" +
				examReplyId +
				"&examId=" +
				examId +
				"&taskStudentId=",
			data: {},
			dataType: "json"
		},
		function (result) {
			log("handExam" + result);
		},
		function (result) {
			log("handExamFailed");
		}
	);
}

function tryCurrentAnswers() {
	getParams();
	tryAnswers(exerciseId, examStudentExerciseId);
}

function tryAnswers(exerciseId1, examStudentExerciseId1) {
	var answerMap;
	var saveAnswerFun;

	switch (AnswerTypeMap[getAnswerType(exerciseId1, examStudentExerciseId1)]) {
		case "DX":
			answerMap = DXanswerMap;
			saveAnswerFun = saveDXAnswer;
			log("DAN XUAN");
			break;
		case "PD":
			answerMap = PDanswerMap;
			saveAnswerFun = savePDAnswer;
			log("PAN DUAN");

			break;
		case "DUO":
			answerMap = DUOanswerMap;
			saveAnswerFun = saveDUOAnswer;
			log("DUO XUAN");
			break;
		case "SKIP":
			log("---------  Already correct skipping  ---------------------");

			return;
		default:
			log("Error Type");
			SendNotification("作业出错 重试中", "pss");
			refresh();
			break;
	}

	$.each(answerMap, function (index, value) {
		var basicData = {
			examReplyId: examReplyId,
			examId: examId,
			teachingTaskId: teachingTaskId,
			examStudentExerciseId: examStudentExerciseId1,
			exerciseId: exerciseId1
		};
		saveAnswerFun(value, basicData);
		log("tryAnswers " + value);
		var IsCorrect = getAnswerInfo(exerciseId1, examStudentExerciseId1);
		if (IsCorrect == true) {
			log("---------  Answer is " + value + "---------------------");
			return false;
		}
	});
}

function getParams() {
	examReplyId = $("#examReplyId").val();
	examStudentExerciseId = $("#examStudentExerciseId").val();
	exerciseId = $("#exerciseId").val();
	examId = $("#examId").val();
	teachingTaskId = $("#teachingTaskId").val();
	saveAnswerURL = $("#saveAnswerForm").attr("action");
}

function saveDXAnswer(AnswerOption, basicData) {
	basicData["DXanswer"] = AnswerOption;
	postAnswer(basicData);
}
function savePDAnswer(AnswerOption, basicData) {
	basicData["PDanswer"] = AnswerOption;
	postAnswer(basicData);
}
var DUOPostMap = {
	A: "DuoXanswerA",
	B: "DuoXanswerB",
	C: "DuoXanswerC",
	D: "DuoXanswerD",
	E: "DuoXanswerE"
};
function saveDUOAnswer(AnswerOption, basicData) {
	basicData["duoxAnswer"] = "";
	$.each(AnswerOption, function (index, value) {
		basicData[DUOPostMap[value]] = true;
		if (value == "A") {
			basicData["duoxAnswer"] += value;
		} else {
			basicData["duoxAnswer"] += "," + value;
		}
	});
	postAnswer(basicData);
}

function postAnswer(data) {
	getParams();
	tryPost({
		type: "POST",
		async: false,
		url: saveAnswerURL,
		data: data
	});
}

function tryPost(postContent, onsucceed, onerror) {
	var failtime = 0;
	var PostSucceed = false;
	postContent["error"] = function (result) {
		log("Post failed");
		failtime++;
		PostSucceed = false;
		if (onerror != undefined) {
			onerror(result);
		}
	};
	postContent["success"] = function (result) {
		if (onsucceed != undefined) {
			onsucceed(result);
		}
		PostSucceed = true;
	};
	while (PostSucceed == false && failtime < 100) {
		$.ajax(postContent);
	}
	if (failtime > 100) {
		SendNotification("服务器炸了作业不能做", "pss");
		throw "Server Is Unavailable";
	}
}

function getCurrentAnswerInfo() {
	getParams();
	return getAnswerInfo(exerciseId, examStudentExerciseId);
}

function getAnswerInfo(exerciseId1, examStudentExerciseId1) {
	var IsCorrect = false;

	tryPost(
		{
			url:
				"/student/exam/manageExam.do?method=getExerciseInfo&examReplyId=" +
				examReplyId +
				"&exerciseId=" +
				exerciseId1 +
				"&examStudentExerciseId=" +
				examStudentExerciseId1, //后台处理程序
			dataType: "json", //接受数据格式
			async: false
		},
		function (result) {
			IsCorrect = result.examAnswer.correctFlag;
		}
	);
	return IsCorrect;
}

function getAnswerType(exerciseId1, examStudentExerciseId1) {
	var type;
	tryPost(
		{
			url:
				"/student/exam/manageExam.do?method=getExerciseInfo&examReplyId=" +
				examReplyId +
				"&exerciseId=" +
				exerciseId1 +
				"&examStudentExerciseId=" +
				examStudentExerciseId1, //后台处理程序
			dataType: "json", //接受数据格式
			async: false
		},
		function (result) {
			if (result.examAnswer.correctFlag == true) {
				type = 100;
			} else {
				type = result.type;
			}
		}
	);
	return type;
}

function GoBack() {
	sendToBackgroud({
		action: "WaitInject",
		script: "codeWxxx.js"
	});

	var str = document.referrer;
	if (str.indexOf("manageVideo") != -1) {
		$(".icon.videoIcon")
			.parent()
			.click();
	} else {
		window.location.href = document.referrer;
	}
}
function sendToBackgroud(data) {
	data.pageName = "Assignment";
	chrome.runtime.sendMessage(data);
}

function inject() {
	var script = document.createElement("script");
	script.innerHTML = 'window.postMessage(examStudentExerciseSerialList, "*");';
	document.body.appendChild(script);
}
function refresh() {
	window.location.reload();
}
function Start() {
	setTimeout(() => {
		doAssignments();
	}, 3000);
}

$(document).ready(function () {
	log("codeAssignment.js Loaded");
	window.addEventListener(
		"message",
		function (event) {
			// We only accept messages from ourselves
			if (event.source != window) return;
			examStudentExerciseSerialList = event.data;
			if (examReplyId != "") {
				Start();
			} else {
				log("already started");
			}
		},
		false
	);
	inject();
});