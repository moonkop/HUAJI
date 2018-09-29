var videoLength;
var urlStr;
var dataStr;
var username;
var userid;
var TimerArea;
var statusBar;
var countInterval;
var homeworkTimer;
function getfinish() {
    logtoBackgroundPage("try finishing");

    $.ajax({
        async: false,
        type: "POST",
        url: urlStr,
        data: dataStr + videoLength, //此处改为视频时间
        success: function (result) {

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
var PostTimer;
function postAll() {
    var mydate = new Date();
    var ts = mydate.getTime();
    var newdate = new Date();
    logtoBackgroundPage(
        "\n<br>started on " +
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

    postTick();
    PostTimer = setInterval(postTick, 60 * 1000);
}
var currentPostTime = 0;
var PostFinished = 1;
function postTick() {
    if (currentPostTime > videoLength) {
        clearInterval(PostTimer);
     
        newdate.setTime(ts + 1000 * (videoLength + 20));
        log_Clear();
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
            log("Post " + PostTime + " " + result);
            switch (result) {
                case "ok":
                    currentPostTime += 60;
                    PostFinished = 1;
                    break;
                case "complete":
                    window.location.reload();
                    break;
                case "invalid":
                    currentPostTime = 0;
                    PostFinished = 1;
                    break;
            }
            if (result == "ok") {

            } else {
                console.dir(result);
            }
        },
        error: function () {

            PostFinished = 0;
        }
    });
}


function init() {

    var regxUrl = RegExp("/student.*Time", "g");
    var regxData = RegExp("isOpen.*=", "g");
    var regxTime = /\d+(?=&playTime)/
    var Script = $(".content_bg_1").children().eq(3).html();
    urlStr = (regxUrl.exec(Script))[0];
    dataStr = (regxData.exec(Script))[0];
    videoLength = Number(regxTime.exec(dataStr));
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


function sendToBackgroud(data) {
    data.UserId = userid;
    data.UserName = username;
    data.lessonType = "Szjy";
    chrome.runtime.sendMessage(data);
}
function disableFlash() {
    $("#player-container").remove();
}


function Run() {

    log("codeWxxx.js Loaded");
    initDisplayArea();
    logtoBackgroundPage("starting");
    disableFlash();
    // 停止计时器
    disableTimers();
    init();
    postAll();

}

function disableTimers() {
    for (var i = 0; i < 100; i++) {
        clearInterval(i);
    }
}

if ("undefined" == typeof (urlStr)) {
    console.log("starting");
    Run();
} else {
    console.log("already started");
}