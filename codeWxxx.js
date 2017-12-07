if ("undefined" == typeof (urlStr)) {
    console.log("starting");
    autoComplete();
}
else {
    console.log("already started");
}



var videoLength;
var urlStr;
var dataStr;
var username;
var userid;
var sec;
var TimerArea;
var statusBar;
var countInterval;
var homeworkTimer;


function log(str) {
    statusBar.innerHTML += str + '<br>';
}


function getStrs() {

    logtoBackgroundPage("getting strs");
    var regxUrl = RegExp("/student.*Time", "g");
    var regxData = RegExp("teachingTaskId.*=", "g");
    var regxTime = /\d+(?=&playTime)/;
    var regxId = /\d+(?=\s+姓名)/;
    var regxName = /[\u4e00-\u9fa5]+(?=\s+【)/;
    var userstr = document.getElementsByClassName("bottom")[0].innerText;
    var Script = document.getElementsByClassName("content_bg")[0].children[2].innerText;
    username = regxName.exec(userstr)[0];
    userid = regxId.exec(userstr)[0];
    urlStr = (regxUrl.exec(Script))[0];
    dataStr = (regxData.exec(Script))[0];
    videoLength = Number(regxTime.exec(dataStr));
    logtoBackgroundPage("dataStr=" + dataStr);
    logtoBackgroundPage("urlStr=" + urlStr);
}


function init() {
    logtoBackgroundPage("getting strs");

    var regxUrl = RegExp("/student.*Time", "g");
    var regxData = RegExp("isOpen.*=", "g");

    var regxTime = /\d + (?=& playTime)/
    var regxId = /\d + (?= \s + 姓名)/;
    var regxName = /[\u4e00 - \u9fa5] + (?= \s + 【)/;
    var userstr = $(".welcome").children().eq(2).html();
    var Script = $(".content_bg_1").children().eq(3).html();

    try {
        urlStr = (regxUrl.exec(Script))[0];
        dataStr = (regxData.exec(Script))[0];
    } catch (error) {
        logtoBackgroundPage("Critical error: DataStr or UrlStr undefined" + error.message + " Reloading");
        RequestReload();
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



function getToEnd() {
    log("skipping to end");
    var counts = videoLength / 200;
    for (var i = 1; i < counts; i++) {
        postData(i * 200);
    }
    var mydate = new Date();
    var ts = mydate.getTime();
    var newdate = new Date();
    newdate.setTime(ts + 1000 * (videoLength + 20));
    logtoBackgroundPage("skipping finished on " + mydate.getHours() + ":" + mydate.getMinutes() + ":" + mydate.getSeconds() + "   Completing on " + newdate.getHours() + ":" + newdate.getMinutes() + ":" + newdate.getSeconds());

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

        logtoBackgroundPage("skipping finished on " + mydate.getHours() + ":" + mydate.getMinutes() + ":" + mydate.getSeconds() + "   Completing on " + newdate.getHours() + ":" + newdate.getMinutes() + ":" + newdate.getSeconds());

        return;
    }
    if (PostFinished == 1) {
        PostFinished = 0;
        postOneData(currentPostTime);

    }
}
function postOneData(PostTime) {
    $.ajax
        ({
            url: urlStr,
            type: "POST",
            data: dataStr + PostTime,
            success: function (result) {
                if (result == "ok") {
                    currentPostTime += 200;
                    console.log("result ok" + PostTime);
                    PostFinished = 1;
                }
            },
            error: function () {
                console.log("result error " + PostTime);
                PostFinished = 1;
            }
        });
}

function postData(x) {

    var time = x;
    $.ajax
        ({
            async: false,
            url: urlStr,
            type: "POST",
            data: dataStr + time,
            success: function (result) {
                if (result == "ok") {

                    console.log("result ok" + time);
                }
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

    $.ajax
        ({
            async: false,
            type: "POST",
            url: urlStr,
            data: dataStr + videoLength, //此处改为视频时间
            success:
                function (result) {
                    if (result == "complete") {
                        log("lessonIsCompelete");
                        RequestReload();
                    }
                    else {
                        log("finishing failed");
                        RequestReload();
                    }
                },
        });
}


var homeworkIsAlerted = 0;
function dectHomework() {
    if (homeworkIsAlerted < 5) {
        homeworkTick();
        homeworkTimer = setInterval(homeworkTick, 60000);
        homeworkIsAlerted++;
    }
}



//---------------interactions

function SendAlive() {
    sendToBackgroud({
        action: "Alive",
    });
}

function RequestReload() {
    sendToBackgroud({
        action: "RequestReload",
    });

}

function logtoBackgroundPage(str, noforegroundlog) {
    noforegroundlog = arguments[1] ? noforegroundlog : false;
    if (!noforegroundlog) {
        statusBar.innerHTML += str + '<br>';
    }
    sendToBackgroud({
        action: "Log",
        message: str
    });
}

function homeworkTick() {
    if (document.getElementById("assignmentInfo").innerText.length > 10) {
        sendToBackgroud({
            action: "Homework",
        });
    }
}

function sendToBackgroud(data) {
    data.UserId = userid;
    data.UserName = username;
    data.lessonType = "Szjy";
    chrome.runtime.sendMessage(data);
}


function autoComplete() {
    deleteFlashDiv();
    statusBar = document.getElementsByClassName("top")[0];
    logtoBackgroundPage("starting");
    // 停止计时器
    clearInterval(4); //停止系统自带上传进度计时器
    clearInterval(1); 				//停止焦点状态检测计时器
    clearInterval(3); 		//停止时间记录计时器
    getStrs();
    dectHomework();
    postAll();
    changeNavi();
    // var aliveSenderTimer=setInterval(SendAlive,30000);
}






















