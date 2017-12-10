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
    myTimerArray.push(detect502Timer);
});
function reloadIf502() {
    if (detect502()) {
        setTimeout(() => {
            window.location.href = "";
        }, 3000);
    }
}