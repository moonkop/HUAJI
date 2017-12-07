var timerRecord;
var currentAnswer;
var currentAnswerTemp;

function reUpload() {
	$("#J_attachment_reupload").hide();
	$("#J_attachment_upload").show();
}

function needSave() {
	if (currentExercise.type == 1) {
		var dxAnswer = $("input[name='DXanswer']:checked").val();
		if (dxAnswer && dxAnswer != currentExercise.examAnswer.answer1) {
			return true;
		}
	} else if (currentExercise.type == 4) {
		var duoxAnswer = "";
		if (document.getElementById("Duo_A").checked) {
			$("#Duo_A").val(true);
			duoxAnswer += ",A";
		}
		if (document.getElementById("Duo_B").checked) {
			$("#Duo_B").val(true);
			duoxAnswer += ",B";
		}
		if (document.getElementById("Duo_C").checked) {
			$("#Duo_C").val(true);
			duoxAnswer += ",C";
		}
		if (document.getElementById("Duo_D").checked) {
			$("#Duo_D").val(true);
			duoxAnswer += ",D";
		}
		if (document.getElementById("Duo_E").checked) {
			$("#Duo_E").val(true);
			duoxAnswer += ",E";
		}
		if (duoxAnswer != "" && duoxAnswer != currentExercise.examAnswer.answer1) {
			return true;
		}
	} else if (currentExercise.type == 2) {
		var pdAnswer = $("input[name='PDanswer']:checked").val();
		if (pdAnswer && pdAnswer != currentExercise.examAnswer.answer1) {
			return true;
		}
	} else if (currentExercise.type == 3) {
		var jdAnswer = editor1.sync().text();
		var hasSwfFile = document.getElementById("SwfFile");
		var jdSwfFile = null;
		if (hasSwfFile) {
			jdSwfFile = $.trim($("#SwfFile").val());
		}
		if ((jdAnswer && jdAnswer != currentAnswer) || jdSwfFile) {
			currentAnswerTemp = jdAnswer;
			return true;
		}
	}
	return false;
}

function previous() {
	clearInterval(timerRecord);
	if (needSave()) {
		jQuery("#saveAnswerForm").ajaxSubmit({
			dataType: "json",
			after: function(result) {
				switch (result.status) {
					case "fail": {
						alert("保存答案失败！");
						break;
					}
					case "rehand": {
						alert("作业已经提交！");
						break;
					}
					case "ok": {
						var hasSwfFile = document.getElementById("SwfFile");
						if (hasSwfFile) {
							$("#SwfFile").remove();
						}
						var hasSwfCanvas = document.getElementById("swfCanvas");
						if (hasSwfCanvas && currentExercise.type == 3) {
							$("#swfCanvas").hide();
							$("span[id^='fileInfo']").hide();
							$("#addFiles").show();
							$("#swfCanvas")
								.children()
								.find("tr")
								.hide();
							addSwfCount();
							createSwfComponent();
						}
						if (currentExerciseIndex > 0) {
							$(
								"#examStudentExerciseSerialBtn" + currentExerciseIndex
							).addClass("completeQuickChangeBtn");
							$("#examStudentExerciseSerialBtn" + currentExerciseIndex).attr(
								"complete",
								true
							);
							setCurrentExamStudentExerciseSerial(currentExerciseIndex - 1);
						} else if (currentExerciseIndex == 0) {
							alert("已经第一题");
						}
					}
				}
			}
		});
	} else {
		if (currentExerciseIndex > 0) {
			setCurrentExamStudentExerciseSerial(currentExerciseIndex - 1);
		} else if (currentExerciseIndex == 0) {
			alert("已经第一题");
		}
	}
}

function next() {
	clearInterval(timerRecord);
	if (needSave()) {
		jQuery("#saveAnswerForm").ajaxSubmit({
			dataType: "json",
			after: function(result) {
				switch (result.status) {
					case "fail": {
						alert("保存答案失败！");
						break;
					}
					case "rehand": {
						alert("作业已经提交！");
						break;
					}
					case "ok": {
						var hasSwfFile = document.getElementById("SwfFile");
						if (hasSwfFile) {
							$("#SwfFile").remove();
						}
						var hasSwfCanvas = document.getElementById("swfCanvas");
						if (hasSwfCanvas && currentExercise.type == 3) {
							$("#swfCanvas").hide();
							$("span[id^='fileInfo']").hide();
							$("#addFiles").show();
							$("#swfCanvas")
								.children()
								.find("tr")
								.hide();
							addSwfCount();
							createSwfComponent();
						}
						if (currentExerciseIndex < exerciseSize - 1) {
							$(
								"#examStudentExerciseSerialBtn" + currentExerciseIndex
							).addClass("completeQuickChangeBtn");
							$("#examStudentExerciseSerialBtn" + currentExerciseIndex).attr(
								"complete",
								true
							);
							setCurrentExamStudentExerciseSerial(currentExerciseIndex + 1);
						} else if (currentExerciseIndex + 1 == exerciseSize) {
							alert("已经是最后一题");
						}
					}
				}
			}
		});
	} else {
		if (currentExerciseIndex < exerciseSize - 1) {
			setCurrentExamStudentExerciseSerial(currentExerciseIndex + 1);
		} else if (currentExerciseIndex + 1 == exerciseSize) {
			alert("已经是最后一题");
		}
	}
}

function fastSwitch(index) {
	clearInterval(timerRecord);
	if (needSave()) {
		jQuery("#saveAnswerForm").ajaxSubmit({
			dataType: "json",
			after: function(result) {
				switch (result.status) {
					case "fail": {
						alert("保存答案失败！");
						break;
					}
					case "rehand": {
						alert("作业已经提交！");
						break;
					}
					case "ok": {
						var hasSwfFile = document.getElementById("SwfFile");
						if (hasSwfFile) {
							$("#SwfFile").remove();
						}
						var hasSwfCanvas = document.getElementById("swfCanvas");
						if (hasSwfCanvas && currentExercise.type == 3) {
							$("#swfCanvas").hide();
							$("span[id^='fileInfo']").hide();
							$("#addFiles").show();
							$("#swfCanvas")
								.children()
								.find("tr")
								.hide();
							addSwfCount();
							createSwfComponent();
						}
						$("#examStudentExerciseSerialBtn" + currentExerciseIndex).addClass(
							"completeQuickChangeBtn"
						);
						$("#examStudentExerciseSerialBtn" + currentExerciseIndex).attr(
							"complete",
							true
						);
						setCurrentExamStudentExerciseSerial(index);
					}
				}
			}
		});
	} else {
		setCurrentExamStudentExerciseSerial(index);
	}
}

function save(type) {
	if (currentExercise.type == 1) {
		if ($("input[name='DXanswer']:checked").val() == null) {
			alert("请选择答案！");
			return;
		}
	} else if (currentExercise.type == 4) {
		if (
			!document.getElementById("Duo_A").checked &&
			!document.getElementById("Duo_B").checked &&
			!document.getElementById("Duo_C").checked &&
			!document.getElementById("Duo_D").checked &&
			!(
				document.getElementById("Duo_E").checked &&
				currentExercise.optionsCount > 4
			)
		) {
			alert("请选择答案！");
			return false;
		}
	} else if (currentExercise.type == 2) {
		if ($("input[name='PDanswer']:checked").val() == null) {
			alert("请选择答案！");
			return false;
		}
	} else if (currentExercise.type == 3) {
		var hasSwfFile = document.getElementById("SwfFile");
		var jdSwfFile = null;
		if (hasSwfFile) {
			jdSwfFile = $.trim($("#SwfFile").val());
		}
		var jdAnswer = editor1.sync().text();
		if (
			type == "hand" &&
			jdAnswer == "" &&
			(jdSwfFile == null || jdSwfFile == "")
		) {
			alert("请按要求填写答案或上传附件！");
			return false;
		}
	}
	if (!needSave()) {
		if (type == "hand") {
			$("#saveWarning").html("保存成功。");
			$("#saveWarning").show();
			setTimeout("$('#saveWarning').hide();", 3000);
		}
		return;
	}
	jQuery("#saveAnswerForm").ajaxSubmit({
		dataType: "json",
		after: function(result) {
			switch (result.status) {
				case "fail": {
					if (type == "hand") {
						alert("保存答案失败，请手工备份答案后重试！");
					} else {
						$("#saveWarning").html("自动保存草稿失败，请注意手动保存。");
						$("#saveWarning").show();
					}
					break;
				}
				case "rehand": {
					alert("作业已经提交！");
					break;
				}
				case "ok": {
					var hasSwfFile = document.getElementById("SwfFile");
					if (hasSwfFile) {
						$("#SwfFile").remove();
						var hasSwfCanvas = document.getElementById("swfCanvas");
						if (hasSwfCanvas && currentExercise.type == 3) {
							$("#swfCanvas").hide();
							$("span[id^='fileInfo']").hide();
							$("#addFiles").show();
							$("#swfCanvas")
								.children()
								.find("tr")
								.hide();
							addSwfCount();
							createSwfComponent();
						}
						$("#J_attachment_upload").hide();
						$("#J_attachment_reupload").show();
						$("#J_attachment_file").attr(
							"href",
							"/download-attachment.do?1512668936030&method=examAnswer&id=" +
								currentExercise.examAnswer.id +
								"&teachingTaskId=" +
								10
						);
					}
					var str = "";
					if (type == "hand") {
						str = "保存成功。";
					} else {
						var date = new Date();
						var H = fillZero(date.getHours());
						var M = fillZero(date.getMinutes());
						var S = fillZero(date.getSeconds());
						str = "自动保存于 " + H + ":" + M + ":" + S;
					}
					$("#saveWarning").html(str);
					$("#saveWarning").show();
					setTimeout("$('#saveWarning').hide();", 3000);
					currentAnswer = currentAnswerTemp;
				}
			}
		}
	});
}

function fillZero(v) {
	if (v < 10) {
		v = "0" + v;
	}
	return v;
}

function handExam() {
	if (needSave()) {
		//提交保存当前题目
		var flag = false;
		jQuery("#saveAnswerForm").ajaxSubmit({
			async: false,
			dataType: "json",
			after: function(result) {
				switch (result.status) {
					case "fail": {
						alert("提交失败！");
						break;
					}
					case "ok": {
						flag = true;
						break;
					}
					case "rehand": {
						alert("作业已经提交，不能重复提交！");
						break;
					}
				}
			}
		});
		if (!flag) {
			return;
		}
	}

	var notFinishedExerciseCount = -1;
	$.ajax({
		url:
			"/student/exam/manageExam.do?1512668936030&method=getNotFinishedExerciseCount&examReplyId=91819&examId=1854", //后台处理程序
		type: "post", //数据发送方式
		dataType: "json", //接受数据格式
		async: false,
		success: function(result) {
			switch (result.status) {
				case "fail": {
					alert("提交失败！");
					break;
				}
				case "ok": {
					notFinishedExerciseCount = result.data.count;
					break;
				}
			}
		}
	});
	if (notFinishedExerciseCount == -1) {
		return;
	}
	var msg = "您确定要提交作业么？提交后将不能再进入作业?";
	if (notFinishedExerciseCount > 0) {
		msg =
			"当前还有 " +
			notFinishedExerciseCount +
			" 道题没完成，您确定要现在提交吗？交卷后将不可再次进入修改。";
	}

	if (confirm(msg)) {
		$.ajax({
			url:
				"/student/exam/manageExam.do?1512668936030&method=handExam&examReplyId=91819&examId=1854&taskStudentId=", //后台处理程序
			type: "post", //数据发送方式
			dataType: "json", //接受数据格式
			success: function(result) {
				if (false) {
					window.location.href =
						"/student/teachingTask/taskhomepage.do?1512668936030&teachingTaskId=10";
				} else {
					window.location.href =
						"/student/assignment/index.do?1512668936030&teachingTaskId=10";
				}
			}
		});
	}
}

var examStudentExerciseSerialList = eval([
	{
		complete: false,
		examStudentExerciseId: 316729,
		exerciseId: 6944,
		index: 0
	},
	{
		complete: false,
		examStudentExerciseId: 316730,
		exerciseId: 6943,
		index: 1
	},
	{
		complete: false,
		examStudentExerciseId: 316731,
		exerciseId: 6941,
		index: 2
	},
	{
		complete: false,
		examStudentExerciseId: 316732,
		exerciseId: 6945,
		index: 3
	},
	{ complete: false, examStudentExerciseId: 316733, exerciseId: 6942, index: 4 }
]);
var exerciseSize = examStudentExerciseSerialList.length;
var currentExamStudentExerciseSerial = examStudentExerciseSerialList[0];
var currentExercise;
var currentExerciseIndex = 0;
var preExerciseIndex = 0;
if (exerciseSize > 0) {
	setCurrentExamStudentExerciseSerial(currentExerciseIndex);
} else {
	alert("本作业没有包含任何试题！");
}
function setCurrentExamStudentExerciseSerial(index) {
	if (index < 0) {
		alert("已经是第一题");
		return;
	} else if (index == exerciseSize) {
		alert("已经是最后一题");
		return;
	}
	preExerciseIndex = currentExerciseIndex;
	$("#content").html("");
	$("#examStudentExerciseSerialBtn" + preExerciseIndex).removeClass(
		"currentQuickChangeBtn"
	);
	if (
		$("#examStudentExerciseSerialBtn" + preExerciseIndex).attr("complete") ==
		"true"
	) {
		$("#examStudentExerciseSerialBtn" + preExerciseIndex).addClass(
			"completeQuickChangeBtn"
		);
	}
	$("#examStudentExerciseSerialBtn" + index).removeClass(
		"completeQuickChangeBtn"
	);
	$("#examStudentExerciseSerialBtn" + index).addClass("currentQuickChangeBtn");
	currentExerciseIndex = index;
	currentExamStudentExerciseSerial = examStudentExerciseSerialList[index];
	$("#examStudentExerciseId").val(
		currentExamStudentExerciseSerial.examStudentExerciseId
	);
	$("#exerciseId").val(currentExamStudentExerciseSerial.exerciseId);
	$.ajax({
		url:
			"/student/exam/manageExam.do?1512668936030&method=getExerciseInfo&examReplyId=91819&exerciseId=" +
			currentExamStudentExerciseSerial.exerciseId +
			"&examStudentExerciseId=" +
			currentExamStudentExerciseSerial.examStudentExerciseId, //后台处理程序
		type: "post", //数据发送方式
		dataType: "json", //接受数据格式
		success: update_page //回传函数(这里是函数名)
	});
}

function update_page(json) {
	currentExercise = json;
	if (currentExercise.type == 1) {
		$("#D_Container").show();
		$("#Duo_Container").hide();
		$("#P_Container").hide();
		$("#J_Container").hide();
		$("#Exercise_Type").html("单选题");
		$("#D_title").html(currentExercise.title);
		$("#D_title_content").html(currentExercise.content);
		$("#D_A_Content").html(currentExercise.optionsA);
		$("#D_B_Content").html(currentExercise.optionsB);
		$("#D_C_Content").html(currentExercise.optionsC);
		$("#D_D_Content").html(currentExercise.optionsD);
		if (currentExercise.optionsCount > 4) {
			$("#dOptionsELi").show();
			$("#D_E_Content").html(currentExercise.optionsE);
		} else {
			$("#dOptionsELi").hide();
		}
		$("input[name='DXanswer']").removeAttr("checked");
		$(
			"input[name='DXanswer'][value=" + currentExercise.examAnswer.answer1 + "]"
		).attr("checked", true);
	} else if (currentExercise.type == 4) {
		$("#D_Container").hide();
		$("#Duo_Container").show();
		$("#P_Container").hide();
		$("#J_Container").hide();
		$("#Exercise_Type").html("多选题");
		$("#Duo_title").html(currentExercise.title);
		$("#Duo_title_content").html(currentExercise.content);
		$("#Duo_A_Content").html(currentExercise.optionsA);
		$("#Duo_B_Content").html(currentExercise.optionsB);
		$("#Duo_C_Content").html(currentExercise.optionsC);
		$("#Duo_D_Content").html(currentExercise.optionsD);
		if (currentExercise.optionsCount > 4) {
			$("#duoOptionsELi").show();
			$("#Duo_E_Content").html(currentExercise.optionsE);
		} else {
			$("#duoOptionsELi").hide();
		}
		$("input[type='checkbox']").removeAttr("checked");
		if (currentExercise.examAnswer.answer1.indexOf("A") >= 0) {
			$("#Duo_A").attr("checked", true);
		}
		if (currentExercise.examAnswer.answer1.indexOf("B") >= 0) {
			$("#Duo_B").attr("checked", true);
		}
		if (currentExercise.examAnswer.answer1.indexOf("C") >= 0) {
			$("#Duo_C").attr("checked", true);
		}
		if (currentExercise.examAnswer.answer1.indexOf("D") >= 0) {
			$("#Duo_D").attr("checked", true);
		}
		if (
			currentExercise.optionsCount > 4 &&
			currentExercise.examAnswer.answer1.indexOf("E") >= 0
		) {
			$("#Duo_E").attr("checked", true);
		}
	} else if (currentExercise.type == 2) {
		$("#D_Container").hide();
		$("#Duo_Container").hide();
		$("#P_Container").show();
		$("#J_Container").hide();
		$("#Exercise_Type").html("判断题");
		$("#P_title").html(currentExercise.title);
		$("#P_title_content").html(currentExercise.content);
		$("#P_A_Content").html(currentExercise.optionsA);
		$("#P_B_Content").html(currentExercise.optionsB);
		$("input[name='PDanswer']").removeAttr("checked");
		$(
			"input[name='PDanswer'][value=" + currentExercise.examAnswer.answer1 + "]"
		).attr("checked", true);
	} else if (currentExercise.type == 3) {
		$("#D_Container").hide();
		$("#Duo_Container").hide();
		$("#P_Container").hide();
		$("#J_Container").show();
		$("#Exercise_Type").html("简答题");
		$("#J_title").html(currentExercise.title);
		$("#J_title_content").html(currentExercise.content);
		editor1.html(currentExercise.examAnswer.answer2);
		if (currentExercise.examAnswer.attachment) {
			$("#J_attachment_upload").hide();
			$("#J_attachment_reupload").show();
			$("#J_attachment_file").attr(
				"href",
				"/download-attachment.do?1512668936030&method=examAnswer&id=" +
					currentExercise.examAnswer.id +
					"&teachingTaskId=10"
			);
		} else {
			$("#J_attachment_upload").show();
			$("#J_attachment_reupload").hide();
		}
		currentAnswer = currentExercise.examAnswer.answer2;

		timerRecord = setInterval("save('auto')", 120 * 1000);
	}
}
