function detect502() {
    try {
        var res = $("center")
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
    reloadIf502();
    detect502Timer = setInterval(function () {
        reloadIf502();
    }, 10000);
});
function reloadIf502() {
    if (detect502()) {
        setTimeout(() => {
            window.location.href = "";
        }, 3000);
    }
}