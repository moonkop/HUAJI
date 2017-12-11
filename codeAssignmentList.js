

$(document).ready(
    function () {
        log("codeAssignmentList.js Loaded");
        var allover = true;
        var obj = $(".linkBtn");
        $(obj).each(function () {
            if ($(this).text() == "进入作业") {
                var str = $(this).attr("href");
                if (str.indexOf("manageAssignment") != -1) {
                    allover = false;
                    window.location.href = str;
                    return false;
                }
            }
        });
        if (allover == true) {
            log("Homework All Over back to Main Page");
            window.location.href = "/student";
        }
    }
)