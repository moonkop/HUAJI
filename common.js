var username;
var userid;
function getUserInfo() {
    var regxName = /[\u4e00-\u9fa5]+(?=\s+【)/;
    var regxId = /\d+(?=\s+姓名)/;
    try {
        var userstr = document.getElementsByClassName("bottom")[0].innerText;
        username = regxName.exec(userstr)[0];
        userid = regxId.exec(userstr)[0];
        log("当前用户：" + username + "   当前学号" + userid);
    } catch (error) {
        log("cant get user name and id");
    }
}

function ClearAllTimers() {
    // clearInterval(4); //停止系统自带上传进度计时器
    // clearInterval(1); 				//停止焦点状态检测计时器
    // clearInterval(3); 		//停止时间记录计时器

    for (var i = 0; i < 100; i++) {
        clearInterval(i);
    }
}

function sendToBackgroud(data, pageName) {
    data.UserId = userid;
    data.UserName = username;
    data.pageName = pageName;
    try {
        chrome.runtime.sendMessage(data);
    } catch (error) {
        console.log("cant connect to background");
        console.dir(error);
    }
}

function SendNotification(note) {
    sendToBackgroud({
        action: "Notification",
        Notification: note
    }, "note");
}


var LogArea;
function log(str) {
    LogArea.innerHTML += str + "<br>";
    console.log(str);
}

function log_Clear() {
    LogArea.innerHTML = "";
}

function initLogArea() {
    var str =
        '<div id="mask" style="background: rgba(255,255,255,0.7);float: left;z-index: 2;position: absolute;">	<div id="log-body" style="min-width: 100px;width: auto;min-height: 0;height: auto;border: 1px solid #DDDDDD;opacity: 2;"></div>	</div>';
    $("body").prepend(str);
    LogArea = document.getElementById("log-body");
}

$(document).ready(function () {
    initLogArea();
    log("common.js 加载完毕");
    getUserInfo();
    ClearAllTimers();
});