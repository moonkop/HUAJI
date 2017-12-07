var examReplyId;
var examStudentExerciseId;
var exerciseId;
var examId;
var teachingTaskId;
var saveAnswerURL;
var answerMap = ["A", "B", "C", "D"];

function doAssignments() {}

function tryAnswers() {
	$.each(answerMap, function(index, value) {
		saveAnswer(value);
		console.log("tryAnswers" + value);
		var IsCorrect = getCurrentAnswerInfo();
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
function saveAnswer(AnswerOption) {
	getParams();
	$.ajax({
		type: "POST",
		async: false,
		url: saveAnswerURL,
		data: {
			examReplyId: examReplyId,
			examStudentExerciseId: examStudentExerciseId,
			exerciseId: exerciseId,
			examId: examId,
			teachingTaskId: teachingTaskId,
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
	return getAnswerInfo(examReplyId, exerciseId, examStudentExerciseId);
}

function getAnswerInfo(examReplyId1, exerciseId1, examStudentExerciseId1) {
	var IsCorrect = false;

	$.ajax({
		url:
			"/student/exam/manageExam.do?method=getExerciseInfo&examReplyId=" +
			examReplyId1 +
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
