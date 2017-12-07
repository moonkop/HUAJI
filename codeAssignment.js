var examReplyId; //这三个变量每套作业中一样，不同作业中不一样
var examId;
var teachingTaskId;

var examStudentExerciseId; //这两个变量每个题目都不一样 可在list中获取
var exerciseId;

var saveAnswerURL;
var answerMap = ["A", "B", "C", "D"];

function doAssignments() {
	$.each(examStudentExerciseSerialList, function(index, value) {
		tryAnswers(value.exerciseId, value.examStudentExerciseId);
	});
	handExam();
	window.history.back();
}

function handExam() {
	getParams();
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
		success: function(result) {
			console.log("handExam" + result);
		},
		dataType: "json"
	});
}

function tryCurrentAnswers() {
	$.each(answerMap, function(index, value) {
		saveCurrentAnswer(value);
		console.log("tryAnswers" + value);
		var IsCorrect = getCurrentAnswerInfo();
		if (IsCorrect == true) {
			return false;
		}
	});
}

function tryAnswers(exerciseId1, examStudentExerciseId1) {
	$.each(answerMap, function(index, value) {
		saveAnswer(value, exerciseId1, examStudentExerciseId1);
		console.log("tryAnswers" + value);
		var IsCorrect = getAnswerInfo(exerciseId1, examStudentExerciseId1);
		if (IsCorrect == true) {
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
function saveCurrentAnswer(AnswerOption) {
	saveAnswer(AnswerOption, exerciseId, examStudentExerciseId);
}
function saveAnswer(AnswerOption, exerciseId1, examStudentExerciseId1) {
	getParams();
	$.ajax({
		type: "POST",
		async: false,
		url: saveAnswerURL,
		data: {
			examReplyId: examReplyId,
			examId: examId,
			teachingTaskId: teachingTaskId,

			examStudentExerciseId: examStudentExerciseId1,
			exerciseId: exerciseId1,

			DXanswer: AnswerOption
		},
		success: function(result) {
			console.log("saveAnswer" + result);
		},
		dataType: "json"
	});
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
		success: function(result) {
			IsCorrect = result.examAnswer.correctFlag;
		}
	});
	console.log("getAnswerInfo" + IsCorrect);

	return IsCorrect;
}
doAssignments();
