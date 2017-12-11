var tabid;
var dectLoadFinishedTimer;

var iconMap = {
	hj: "icon.png",
	pss: "pss.png"
};

var defaultLessonType = "";
var settings = {
	ReloadTimeOut: 20000
};
function test2() {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		var tagtab = tabs[0];
		//	RecordTabStatus(tagtab.id);
		WaitingForInjection(tagtab.id, "codeWxxx.js");
	});
}
function doAssignments() {
	chrome.tabs.executeScript(null, { file: "codeAssignment.js" });
}

var RecordTabStatusTimer;
function RecordTabStatus(tabid) {
	RecordTabStatusTimer = setInterval(function () {
		getTabStatus(tabid);
	}, 100);
}

function getTabStatus(tabid) {
	chrome.tabs.get(tabid, function (tab) {
		console.log(tab.status);
	});
}

function InjectScript(id, script) {
	chrome.tabs.executeScript(id, { file: "jquery-1.3.2.min.js" });
	chrome.tabs.executeScript(id, { file: script });
}

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
		console.log(tagtab);
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
			dectLoadFinishedTimer = setInterval(function () {
				dectLoaded(null, defaultLessonType);
			}, 1000);
		}, 10000);
	} else {
		setTimeout(function () {
			dectLoadFinishedTimer = setInterval(function () {
				dectLoaded(tagTab.id, defaultLessonType);
			}, 1000);
		}, 10000);
	}
}

function deleteFlashDiv() {
	chrome.tabs.executeScript(null, {
		code: '$("#player-container_wrapper").html("");'
	});
}

function getFinish() {
	chrome.tabs.executeScript(null, { code: "getfinish();" });
}

function log(str) {
	console.log(str);
}
function UpdateStatus(msg, tab) { }

chrome.runtime.onMessage.addListener(function (msg, sender) {
	tabid = sender.tab.id;
	var time = new Date();
	var timestr =
		"[" +
		time.getHours() +
		":" +
		time.getMinutes() +
		":" +
		time.getSeconds() +
		"]";

	switch (msg.action) {
		case "Notification":
			popNotification({
				type: "basic",
				title: msg.UserId + "   " + msg.UserName,
				message: msg.Notification,
				iconUrl: iconMap[msg.icon],
				requireInteraction: msg.requireInteraction
			});
			break;

		case "Log":
			log(
				"tabId=" +
				tabid +
				timestr +
				"  " +
				msg.UserId +
				"  " +
				msg.UserName +
				"   " +
				msg.message
			);
			break;
		case "WaitInject":
			log(
				"tabId=" +
				tabid +
				"  " +
				msg.UserId +
				"  " +
				msg.UserName +
				"   WaitingInject" +
				"Timeout=" +
				settings.ReloadTimeOut +
				"    script=" +
				msg.script
			);
			WaitingForInjection(tabid, script, settings.ReloadTimeOut);
			break;
		case "Status":
			UpdateStatus(msg, sender);
			break;
	}
});

var tabUrl = Array();

function WaitingForInjection(tabid, script, timeout) {
	setTimeout(() => {
		var time = 1;
		var WaitingTimer = setInterval(function () {
			chrome.tabs.get(tabid, function (tab) {
				console.log("" + time++ + " " + tabid + tab.status);
				if (tab.status == "complete") {
					console.log(tab);
					clearInterval(WaitingTimer);
					InjectScript(tab.id, script);
				}
			});
		}, 1000);
	}, timeout);
}

function dectLoaded(tabid, lessonType) {
	chrome.tabs.get(tabid, function (tab) {
		console.log(tab.status);
		if (tab.status == "complete") {
			console.log(tab);
			clearInterval(dectLoadFinishedTimer);
			Inject(tab.id, lessonType);
		}
	});
}

function startNewWxxx() {
	defaultLessonType = "Wxxx";
	Inject(null, "Wxxx");
}

function startNewSzjy() {
	defaultLessonType = "Szjy";
	Inject(null, "Szjy");
}

function popNotification(opt) {
	chrome.notifications.create(null, opt);
}
