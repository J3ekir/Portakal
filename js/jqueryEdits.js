if (!/^https:\/\/normalsozluk\.com\/external/.test(location.href)) {
    waitForVariable("jQuery").then(() => {
        removeJQueryEventListener("mouseup").then(adjustMenuAnimsMouseup);
        removeJQueryEventListener("click", ".frame-toggler").then(adjustMenuAnims);
        removeJQueryEventListener("click", ".titleinfo").then(adjustTitleInfoAnims);
        removeJQueryEventListener("click", ".entryscrollbottom").then(adjustScrollToBottom);
    });
}

adjustLoadingIndicator();


function adjustMenuAnimsMouseup() {
    $(document).mouseup(function (e) {
        $(".right-drop-menu").each(function () {
            $(this).is(e.target) ||
                0 !== $(this).has(e.target).length ||
                $(this).slideUp("fast", "easeOutCubic").animate({ opacity: 0 }, { queue: false, duration: 'fast' });
        });
    });
}

function adjustMenuAnims() {
    $(document).on("click", ".frame-toggler", function (e) {
        e.preventDefault();
        var t = $(this).data("target");
        if ("block" !== $(t).css("display")) {
            $(t).css('opacity', 0).slideDown("fast", "easeOutCubic").animate({ opacity: 1 }, { queue: false, duration: 'fast' }),
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
            $(t).slideUp("fast", "easeOutCubic").animate({ opacity: 0 }, { queue: false, duration: 'fast' });
        }
    });
}

function adjustTitleInfoAnims() {
    // $(document).on("click", ".titleinfo", (function() {
    //     $("#titleinfobox").slideToggle("fast", "easeOutCubic")
    // }));
    $(document).on("click", ".titleinfo", (function () {
        $("#titleinfobox").animate({
            height: "toggle",
            opacity: "toggle",
            padding: "toggle"
        }, "fast");
    }));
}

function adjustScrollToBottom() {
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
    Object.defineProperty(window, "showLoader", {
        value: function () {
            document.querySelector("#centerframe").style.opacity = "0.7";
            document.querySelector("#leftframe").style.opacity = "0.7";
        },
        writable: false,
        configurable: false,
    });

    Object.defineProperty(window, "hideLoader", {
        value: function () {
            document.querySelector("#centerframe").style.opacity = "1";
            document.querySelector("#leftframe").style.opacity = "1";
        },
        writable: false,
        configurable: false,
    });
}

async function waitForVariable(variable) {
    return new Promise(resolve => {
        const id = setInterval(() => {
            if (window[variable] !== undefined) {
                resolve();
                clearInterval(id);
            }
        }, 50);
    });
}

async function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        new MutationObserver((_, observer) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                return resolve(document.querySelector(selector));
            }
        })
            .observe(document, { childList: true, subtree: true });
    });
}

async function removeJQueryEventListener(event, selector) {
    return new Promise(resolve => {
        const id = setInterval(() => {
            const events = $._data(document, "events")[event];

            if (events && events.filter(event => event.selector === selector).length === 1) {
                $(document).off(event, selector);
                resolve();
                clearInterval(id);
            }
        }, 50);
    });
}
