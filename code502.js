function detect502() {

    return false;
}

$(document).ready(function () {
    if (detect502) {
        setTimeout(() => {
            window.location.href = "";
        }, 3000);
    }
});
