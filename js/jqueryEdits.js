waitForVariables().then(() => {
    initiateJQueryEdits();
});


function initiateJQueryEdits() {
    adjustMenuAnims();
    adjustScrollToBottom();
    adjustLoadingIndicator();
    adjustTitleInfoAnims();
}

function adjustMenuAnims() {
    $(document).off("mouseup");
    $(document).off("click", ".frame-toggler");
    $(document).on("click", ".frame-toggler", function (e) {
        e.preventDefault();
        var t = $(this).data("target");
        if ("block" !== $(t).css("display")) {
            $(t).css('opacity', 0).slideDown("fast", "easeOutCirc").animate({ opacity: 1 }, { queue: false, duration: 'fast' }),
                "#frame_onlineauthors" === t && notifyOnline(),
                "#frame_notifications" === t &&
                "" === $("#notificationpreviewcontainer").html() &&
                ($("#notificationpreviewcontainer").html(
                    '<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'
                ),
                    updateNotifications(!0)),
                "#frame_chatpreview" === t &&
                "" === $("#chatpreviewcontainer").html() &&
                ($("#chatpreviewcontainer").html(
                    '<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'
                ),
                    updateMessages());
        } else {
            $(t).slideUp("fast", "easeInOutCirc").animate({ opacity: 0 }, { queue: false, duration: 'fast' });
        }
    });
    $(document).mouseup(function (e) {
        $(".right-drop-menu").each(function () {
            $(this).is(e.target) ||
                0 !== $(this).has(e.target).length ||
                $(this).slideUp("fast", "easeInOutCirc").animate({ opacity: 0 }, { queue: false, duration: 'fast' });
        });
    });
}

function adjustTitleInfoAnims() {
    $(document).off("click", ".titleinfo");
    // $(document).on("click", ".titleinfo", (function() {
    //     $("#titleinfobox").slideToggle("fast", "easeOutCubic")
    // }));
    $(document).on("click", ".titleinfo", (function() {
        $("#titleinfobox").animate({
            height: "toggle",
            opacity: "toggle",
            padding: "toggle"
        }, "fast");
    }));
}

function adjustScrollToBottom() {
    $(document).off("click", ".entryscrollbottom");
    $(document).on("click", ".entryscrollbottom", (function () {
        var e = $("div.entrybar").last()
            , t = e ? e.position().top - 420 : $(document).height();
        $("html, body").animate({
            scrollTop: t
        }, 300);
    }
    ));
}

function adjustLoadingIndicator() {
    window.showLoader = function () {
        document.querySelector("#centerframe").style.opacity = "0.7";
        document.querySelector("#leftframe").style.opacity = "0.7";
    };
    window.hideLoader = function () {
        document.querySelector("#centerframe").style.opacity = "1";
        document.querySelector("#leftframe").style.opacity = "1";
    };
}

async function waitForVariables() {
    return new Promise(resolve => {
        const id = setInterval(() => {
            if (
                typeof jQuery !== "undefined" &&
                $._data(document, "events").click.filter(event => event.selector === ".frame-toggler").length === 1
            ) {
                resolve();
                clearInterval(id);
            }
        }, 50);
    });
}
