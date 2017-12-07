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

// var finishUrl;
// var finishDataStr;




function getfinish() {
    logtoBackgroundPage("try finishing");

    $.ajax({
        async: false,
        type: "POST",
        url: urlStr,
        data: dataStr + videoLength, //此处改为视频时间
        success: function(result) {
            /* 	if (result == "ok")
             {
             lastSaveTime = time;
             console.log("result ok"+ti0me);
             } */
            if (result == "complete") {
                log("lessonIsCompelete");
                RequestReload();
            } else {
                log("finishing failed");
                RequestReload();
            }
        },
    });
}

var PostInterval = 120;

function getToEnd() {
    log("skipping to end");
    var counts = videoLength / PostInterval;
    for (var i = 1; i < counts; i++) {
        postData(i * PostInterval);
    }
    var mydate = new Date();
    var ts = mydate.getTime();
    var newdate = new Date();
    newdate.setTime(ts + 1000 * (videoLength + 20));
    logtoBackgroundPage("skipping finished on " + mydate.getHours() + ":" + mydate.getMinutes() + ":" + mydate.getSeconds() + "   Completing on " + newdate.getHours() + ":" + newdate.getMinutes() + ":" + newdate.getSeconds());

}

function postData(time) {

    $.ajax({
        async: false,
        type: "POST",
        url: urlStr,
        data: dataStr + time,
        success: function(result) {
            console.log("time=" + time + "result:" + result);
            if (result == "complete") {
                RequestReload();
            }
        }
    });
}


function init() {
    logtoBackgroundPage("getting strs");
    var regxUrl = RegExp("/student.*Time", "g");
    var regxData = RegExp("isOpen.*=", "g");
    var regxTime = /\d+(?=&playTime)/
    var regxId = /\d+(?=\s+姓名)/;
    var regxName = /[\u4e00-\u9fa5]+(?=\s+【)/;
    var userstr = $(".welcome").children().eq(2).html();
    var Script = $(".content_bg_1").children().eq(3).html();
    //username = regxName.exec(userstr)[0]; 
    // userid = regxId.exec(userstr)[0]; 

    urlStr = (regxUrl.exec(Script))[0];
    dataStr = (regxData.exec(Script))[0];
    videoLength = Number(regxTime.exec(dataStr));
    logtoBackgroundPage("dataStr=" + dataStr);
    logtoBackgroundPage("urlStr=" + urlStr);
    countInterval = setInterval(count, 1000);
    sec = 0;
}

function initDisplayArea() {
    document.getElementsByClassName("logo")[0].innerHTML = "";
    statusBar = document.getElementsByClassName("logo")[0];
    document.getElementsByClassName("left_content")[0].innerHTML = "";
    TimerArea = document.getElementsByClassName("left_content")[0];
}

function count() {
    sec++;
    TimerArea.innerText = sec + "" + "/" + videoLength;
    if (sec > videoLength + 20 && sec % 10 == 0) {
        getfinish();
    }
}


function dectHomework() {
    homeworkTimer = setInterval(homeworkTick, 20000);
}

function log(str) {
    statusBar.innerHTML += str + '<br>';
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

function RequestReload() {
    sendToBackgroud({
        action: "RequestReload",
    });

}

function SendAlive() {
    sendToBackgroud({
        action: "Alive",
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



function Run() {
    initDisplayArea();
    logtoBackgroundPage("starting");

    // 停止计时器
    clearInterval(4); //停止系统自带上传进度计时器
    clearInterval(1); //停止焦点状态检测计时器
    clearInterval(3); //停止时间记录计时器
    init();
    getToEnd();
    // var aliveSenderTimer=setInterval(SendAlive,30000);
}



if ("undefined" == typeof(urlStr)) {
    console.log("starting");
    Run();
} else {
    console.log("already started");
}