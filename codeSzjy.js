var videoLength;
var urlStr;
var dataStr;
var username;
var userid;
var TimerArea;
var statusBar;
var countInterval;
var homeworkTimer;

var episode;
var episodeNum;


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

var PostInterval = 60;
var PostTimer;
var currentPostTime = 0;
var PostFinished = 1;

function setUpPostTimer() {
    var mydate = new Date();
    var ts = mydate.getTime();
    var newdate = new Date();
    newdate.setTime(ts + 1000 * (videoLength + 20));
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
    PostTimer = setInterval(postTick, PostInterval * 1000);
}

function postTick() {
    if (currentPostTime > videoLength) {
        clearInterval(PostTimer);
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
                    currentPostTime += PostInterval;
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
    var regEpisode = /\d+/;

    urlStr = (regxUrl.exec(Script))[0];
    dataStr = (regxData.exec(Script))[0];
    episode = regEpisode.exec($("font").html());
    episodeNum = regEpisode.exec($(".nav_info").html());
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
    setEposideProgress(sec * 1.0 / videoLength);
}


function dectHomework() {
    homeworkTimer = setInterval(homeworkTick, 20000);
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
    ClearAllTimers();
    initDisplayArea();
    logtoBackgroundPage("starting");
    disableFlash();
    init();
    setUpPostTimer();
    setTotalProgress(episode * 1.0 / episodeNum);

}
$(document).ready(function () {
    if ("undefined" == typeof (urlStr)) {
        console.log("starting");
        Run();
    } else {
        console.log("already started");
    }
}
)

