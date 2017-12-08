var examReplyId; //这三个变量每套作业中一样，不同作业中不一样
var examId;
var teachingTaskId;

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
	["A", "B", "C", "D", "E"],
	["A"],
	["B"],
	["C"],
	["D"],
	["E"],

]
var AnswerTypeMap = {
	"1": "DX",
	"2": "PD",
	"4": "DUO"
}
function doAssignments() {
	getParams();
	$.each(examStudentExerciseSerialList, function (index, value) {
		tryAnswers(value.exerciseId, value.examStudentExerciseId);
	});
	handExam();
	window.history.back();
}

function handExam() {
	getParams();
	var PostSucceed = false;
	while (PostSucceed == false) {
		$.ajax({
			type: "POST",
			async: false,
			url:
				"/student/exam/manageExam.do?method=handExam&examReplyId=" +
				examReplyId +
				"&examId=" +
				examId +
				"&taskStudentId=",
			data: {},
			success: function (result) {
				console.log("handExam" + result);
				PostSucceed = true;
			},
			error: function () {
				console.log("handExamFailed");
			},
			dataType: "json"
		});
	}
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
			console.log("DAN XUAN");
			break;
		case "PD":
			answerMap = PDanswerMap;
			saveAnswerFun = savePDAnswer;
			console.log("PAN DUAN");

			break;
		case "DUO":
			answerMap = DUOanswerMap;
			saveAnswerFun = saveDUOAnswer;
			console.log("DUO XUAN");

			break;
		default:
			throw "Error Type";
			break;
	}




	$.each(answerMap, function (index, value) {

		var basicData = {
			examReplyId: examReplyId,
			examId: examId,
			teachingTaskId: teachingTaskId,
			examStudentExerciseId: examStudentExerciseId1,
			exerciseId: exerciseId1,
		};
		saveAnswerFun(value, basicData);
		console.log("tryAnswers " + value);
		var IsCorrect = getAnswerInfo(exerciseId1, examStudentExerciseId1);
		if (IsCorrect == true) {
			console.log("Answer is " + value + "---------------------");
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
	basicData['DXanswer'] = AnswerOption;
	postAnswer(basicData);
}
function savePDAnswer(AnswerOption, basicData) {
	basicData['PDanswer'] = AnswerOption;
	postAnswer(basicData);
}
var DUOPostMap = {
	"A": "DuoXanswerA",
	"B": "DuoXanswerB",
	"C": "DuoXanswerC",
	"D": "DuoXanswerD",
	"E": "DuoXanswerE",
}
function saveDUOAnswer(AnswerOption, basicData) {
	$.each(AnswerOption, function (index, value) {
		basicData[DUOPostMap[value]] = true;
	});
	postAnswer(basicData);
}


function postAnswer(data) {
	getParams();
	var PostSucceed = false;
	while (PostSucceed == false) {
		$.ajax({
			type: "POST",
			async: false,
			url: saveAnswerURL,
			data: data,
			success: function (result) {
				PostSucceed = true;
			},
			error: function () {
				PostSucceed = true;
				console.log("saveAnswerFailed");
			},
			dataType: "json"
		});
	}

}


function getCurrentAnswerInfo() {
	getParams();
	return getAnswerInfo(exerciseId, examStudentExerciseId);
}

function getAnswerInfo(exerciseId1, examStudentExerciseId1) {
	var IsCorrect = false;

	$.ajax({
		url:
			"/student/exam/manageExam.do?method=getExerciseInfo&examReplyId=" +
			examReplyId +
			"&exerciseId=" +
			exerciseId1 +
			"&examStudentExerciseId=" +
			examStudentExerciseId1, //后台处理程序
		dataType: "json", //接受数据格式
		async: false,
		success: function (result) {
			IsCorrect = result.examAnswer.correctFlag;
		}
	});

	return IsCorrect;
}

function getAnswerType(exerciseId1, examStudentExerciseId1) {
	var type;
	$.ajax({
		url:
			"/student/exam/manageExam.do?method=getExerciseInfo&examReplyId=" +
			examReplyId +
			"&exerciseId=" +
			exerciseId1 +
			"&examStudentExerciseId=" +
			examStudentExerciseId1, //后台处理程序
		dataType: "json", //接受数据格式
		async: false,
		success: function (result) {
			type = result.type;
		}
	});

	return type;
}



function inject() {
	var script = document.createElement("script");
	script.innerHTML = 'window.postMessage(examStudentExerciseSerialList, "*");';
	document.body.appendChild(script);
}

window.addEventListener(
	"message",
	function (event) {
		// We only accept messages from ourselves
		if (event.source != window) return;
		examStudentExerciseSerialList = event.data;
		doAssignments();
	},
	false
);
inject();
