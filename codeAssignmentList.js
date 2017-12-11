

$(document).ready(
    function () {
        log("codeAssignmentList.js Loaded");
        if (is502 == true) {
            log("detected 502 Aborting");
            return;
        }
        var allover = 1;
        var obj = $(".linkBtn");
        $(obj).each(function () {
            if ($(this).text() == "进入作业") {
                allover = 2;
                var str = $(this).attr("href");
                if (str.indexOf("manageAssignment") != -1) {
                    allover = 0;
                    window.location.href = str;
                    return 0;
                }
            }
        });
        switch (allover) {
            case 0:
                log("Working On Assignment");
                break;
            case 1:
                log("Assignments All Over back to Main Page");
                SendNotification("作业全部完成正在回到课程主页", "xk", true);
                goToCourseHomePage();
                break;
            case 2:
                log("No Assignment Available");
                break;
        }
    }
)