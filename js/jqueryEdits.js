waitForVariables().then(function () {
    adjustMenuAnims();
});

function adjustMenuAnims() {
    $(document).off("click", ".frame-toggler");

    $(document).on("click", ".frame-toggler", (function (e) {
        e.preventDefault();
        var t = $(this).data("target");
        if ("block" !== $(t).css("display")) {
            var i = isMobile() ? "down" : "up";
            $(t).show("slide", {
                direction: i
            }, 2000),
                "#frame_onlineauthors" === t && notifyOnline(),
                "#frame_notifications" === t && "" === $("#notificationpreviewcontainer").html() && ($("#notificationpreviewcontainer").html('<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'),
                    updateNotifications(!0)),
                "#frame_chatpreview" === t && "" === $("#chatpreviewcontainer").html() && ($("#chatpreviewcontainer").html('<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'),
                    updateMessages());
        } else {
            var o = isMobile() ? "up" : "down";
            $(t).hide("slide", {
                direction: o
            }, 2000);
        }
    }
    ));

    $(document).off("mouseup");

    $(document).on("click", ".frame-toggler", (function (e) {
        e.preventDefault();
        var t = $(this).data("target");
        if ("block" !== $(t).css("display")) {
            var i = isMobile() ? "down" : "up";
            $(t).slideDown("fast", "easeOutCirc"),
                "#frame_onlineauthors" === t && notifyOnline(),
                "#frame_notifications" === t && "" === $("#notificationpreviewcontainer").html() && ($("#notificationpreviewcontainer").html('<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'),
                    updateNotifications(!0)),
                "#frame_chatpreview" === t && "" === $("#chatpreviewcontainer").html() && ($("#chatpreviewcontainer").html('<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'),
                    updateMessages());
        } else {
            var o = isMobile() ? "up" : "down";
            $(t).slideUp("fast", "easeInCirc");
        }
    }
    ));
}

function waitForVariables() {
    return new Promise(resolve => {
        if (typeof $ !== "undefined") {
            resolve();
        } else {
            setTimeout(() => waitForVariables(resolve), 100);
        }
    });
}
