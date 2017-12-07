var tabid;
var dectLoadFinishedTimer;
var defaultLessonType = "";

function Inject(id, lessonType) {
    chrome.tabs.executeScript(id, { file: "jquery-1.3.2.min.js" });
    switch (lessonType) {
        case "Wxxx":
            chrome.tabs.executeScript(id, { file: "codeWxxx.js" });
            break;
        case "Szjy":
            chrome.tabs.executeScript(id, { file: "codeSzjy.js" });
            break;
    }
}

function ReloadCurrentTab() {
    // chrome.tabs.getCurrent(function (tab) {
    //     ReloadTab(tab);
    // });
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var tagtab = tabs[0];
        console.log(tagtab)
        ReloadTab(tagtab);
    });
}

function ReloadTab(tagTab) {
    if (tagTab != null) {
        chrome.tabs.executeScript(tagTab.id, { code: "window.location.reload();" });

    } else {
        chrome.tabs.executeScript(null, { code: "window.location.reload();" });
    }

    if (tagTab == null) {
        setTimeout(function () {
            dectLoadFinishedTimer = setInterval(dectLoaded(null, defaultLessonType), 1000);
        }, 10000);
    } else {
        setTimeout(function () {
            dectLoadFinishedTimer = setInterval(dectLoaded(tagTab, defaultLessonType), 1000);
        }, 10000);
    }

}

function deleteFlashDiv() {
    chrome.tabs.executeScript(null, { code: '$("#player-container_wrapper").html("");' });
}

function getFinish() {
    chrome.tabs.executeScript(null, { code: "getfinish();" });
}

function log(str) {
    console.log(str);
}

chrome.runtime.onMessage.addListener(
    function (msg, sender) {
        tabid = sender.tab.id;
        var time = new Date();
        var timestr = "[" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "]";

        switch (msg.action) {
            case "Homework":
                var opt = {
                    type: "basic",
                    title: "写作业！",
                    message: msg.UserId + "   " + msg.UserName,
                    iconUrl: "hj.png",
                    requireInteraction: true
                }
                sendNotification(opt);
                break;

            case "Log":
                log("tabId=" + tabid + timestr + "  " + msg.UserId + "  " + msg.UserName + "   " + msg.message);
                break;

            case "RequestReload":
                log("tabId=" + tabid + "  " + msg.UserId + "  " + msg.UserName + "   " + "tryReloading");
                chrome.tabs.executeScript(tabid, { code: "window.location.reload();" });
                defaultLessonType = msg.lessonType;

                setTimeout(function () {
                    tabUrl[sender.tab.id] = sender.tab.url;
                    dectLoadFinishedTimer = setInterval(dectLoaded(sender.tab, msg.lessonType), 1000);
                }, 10000);
                break;

            case "Alive":
                break;
        }
    });

var tabUrl = Array();


function dectLoaded(tab, lessonType) {
    if (tab.status == "complete") {
        console.log(tab);
        clearInterval(dectLoadFinishedTimer);
        Inject(tab.id, lessonType);
    }
}

function startNewWxxx() {
    Inject(null, "Wxxx");
}

function startNewSzjy() {
    Inject(null, "Szjy");
}

function testNoti() {
    var opt = {
        type: "basic",
        title: "写作业！",
        message: "",
        iconUrl: "hj.png",
        requireInteraction: true
    }
    chrome.notifications.create(null, opt);
}

function sendNotification(opt) {
    chrome.notifications.create(null, opt);
}