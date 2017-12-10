function detect502() {
    var res;
    try {
        res = $("center")
            .eq(0)
            .text()
            .startsWith("50");
    } catch (error) {
        return false;
    }
    return res;
}
var detect502Timer;
$(document).ready(function () {
    ClearAllTimers();
    reloadIf502();
    detect502Timer = setInterval(function () {
        reloadIf502();
    }, 10000);
    //myTimerArray.push(detect502Timer);
});
function reloadIf502() {
    if (detect502()) {
        setTimeout(() => {
            window.location.href = "";
        }, 3000);
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