if (!/^https:\/\/normalsozluk\.com\/external/.test(location.href)) {
    waitForVariable("jQuery").then(() => {
        adjustMenuAnimsMouseup();
        adjustMenuAnims();
        adjustTitleInfoAnims();
        adjustScrollToBottom();
        adjustHistoryState();
        adjustHamburgerToOnlineAnimation();
        overridePushHistory();
    });
}

adjustLoadingIndicator();


function adjustMenuAnimsMouseup() {
    removeJQueryEventListener("mouseup").then(() => {
        $(document).mouseup(function (e) {
            $(".right-drop-menu").each(function () {
                $(this).is(e.target) ||
                    0 !== $(this).has(e.target).length ||
                    $(this).slideUp("fast", "easeOutCubic").animate({ opacity: 0 }, { queue: false, duration: 'fast' });
            });
        });
    });
}

function adjustMenuAnims() {
    removeJQueryEventListener("click", ".frame-toggler").then(() => {
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
    });
}

function adjustTitleInfoAnims() {
    removeJQueryEventListener("click", ".titleinfo").then(() => {
        $(document).on("click", ".titleinfo", function () {
            $("#titleinfobox").animate({
                height: "toggle",
                opacity: "toggle",
                padding: "toggle"
            }, "fast");
        });
    });
}

function adjustScrollToBottom() {
    removeJQueryEventListener("click", ".entryscrollbottom").then(() => {
        $(document).on("click", ".entryscrollbottom", function () {
            var e = $("div.entrybar").last()
                , t = e ? e.position().top - 420 : $(document).height();
            $("html, body").animate({
                scrollTop: t
            }, 300);
        });
    });
}

function adjustHistoryState(centerframe) {
    waitForElement("#centerframe").then(elem => {
        if (!window.history.state) {
            window.pushHistory(window.location.href, "#centerframe", elem.innerHTML);
        }
    });
}

function adjustHamburgerToOnlineAnimation() {
    const elem = document.querySelector("#hamburger-menu .frame-toggler");
    elem.onclick = null;
    $(elem).click(function (e) {
        if (!window.__cfRLUnblockHandlers)
            return false;
        $('#hamburger-menu').fadeOut(100, 'swing');
    });
}


function overridePushHistory() {
    overrideRenderCenter();
    overrideLoadCenter();


    window.pushHistory = function (e, t, o, title) {
        if (!(o.length / 1024 > 630)) {
            var a = ""
                , r = ""
                , s = $("<div>" + o + "</div>")
                , c = s.find(".xhr-mt").first()
                , d = s.find(".xhr-mdesc").first()
                , l = s.find(".xhr-cnn").first();
            a = void 0 !== c && 1 === c.length ? c.html() : title && title.toLowerCase(),
                void 0 !== d && 1 === d.length && (r = d.html(),
                    $("meta[name='description']").attr("content", r)),
                void 0 !== l && 1 === l.length && $('link[rel="canonical"]').attr("href", l.html());
            var u = {
                path: e,
                selector: t,
                html: o,
                title: a,
                desc: r
            };
            if ("function" == typeof window.history.pushState) {
                if (window.history.state && window.history.state.path === e)
                    return void (window.history.state.html = o);
                window.history.pushState(u, e, e);
            } else
                window.location.hash = "#!" + e;
            if ("function" == typeof gtag && "" !== window.location.pathname && "/" !== window.location.pathname) {
                var h = {
                    page_title: a,
                    page_location: window.location.href,
                    page_path: e
                };
                gtag("event", "page_view", h);
            }
            updateTitle(a);
        }
    };
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

async function fetchTitle(url) {
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/<title>(.*?)<\/title>/);
    return match ? match[1] : window.windowTitle;
}

function overrideRenderCenter() {
    window.renderCenter = function (e, t, title) {
        $("#centerframe").html(e),
            isMobile() && collapseLeftFrame(),
            window.scrollTo(0, 0),
            pushHistory(t, "#centerframe", e, title),
            stickPanels(),
            processEntry(),
            "undefined" != typeof AUTHOR_ID && initInputEntryBody(),
            hideLoader();
    };
}

function overrideLoadCenter() {
    window.loadCenter = function (e) {
        "" !== e && void 0 !== e && ("function" != typeof pageLeaveCheck || pageLeaveCheck() || confirm("bu sayfaya girdiğiniz fakat göndermediğiniz içerikler var. \nsayfadan ayrılırsanız bu içerikler kaybolacaktır. \n\nilerlemek istiyor musunuz?")) && (showLoader(),
            $.ajax({
                method: "GET",
                url: e,
                cache: !1,
                async: !0,
                success: function (t) {
                    var s = $("<div>" + t + "</div>");
                    var c = s.find(".xhr-mt").first();

                    if (c !== undefined && c.length === 1) {
                        renderCenter(t, e);
                    }
                    else {
                        fetchTitle(e).then(title => {
                            renderCenter(t, e, title);
                        });
                    }
                },
                error: function (t, i) {
                    t.status < 500 ? renderCenter(t.responseText, e) : alert("istediğiniz içerik yüklenemedi. \nbir süre sonra yeniden deneyin."),
                        hideLoader();
                }
            }));
    };
}
