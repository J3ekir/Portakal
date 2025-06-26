const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type !== "DOMNodeInserted") {
        return originalAddEventListener.call(this, type, listener, options);
    }

    new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches("#form_entry_add")) {
                    initInputEntryBody();
                }
            }
        }
    }).observe(document, { childList: true, subtree: true });
};

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
        $(document).mouseup(function (event) {
            $(".right-drop-menu").each(function () {
                if (!$(this).is(event.target) && $(this).has(event.target).length === 0) {
                    $(this).slideUp("fast", "easeOutCubic").animate({ opacity: 0 }, { queue: false, duration: 'fast' });
                }
            });
        });
    });
}

function adjustMenuAnims() {
    removeJQueryEventListener("click", ".frame-toggler").then(() => {
        $(document).on("click", ".frame-toggler", function (event) {
            event.preventDefault();
            const target = $(this).data("target");
            if ($(target).css("display") === "block") {
                $(target)
                    .slideUp("fast", "easeOutCubic")
                    .animate({ opacity: 0 }, { queue: false, duration: "fast" });
                return;
            }
            $(target)
                .css("opacity", 0)
                .slideDown("fast", "easeOutCubic")
                .animate({ opacity: 1 }, { queue: false, duration: "fast" });

            if (target === "#frame_onlineauthors") {
                notifyOnline();
            }
            if (target === "#frame_notifications" && $("#notificationpreviewcontainer").html() === "") {
                $("#notificationpreviewcontainer").html(
                    '<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'
                );
                updateNotifications(true);
            }
            if (target === "#frame_chatpreview" && $("#chatpreviewcontainer").html() === "") {
                $("#chatpreviewcontainer").html(
                    '<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'
                );
                updateMessages();
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
            const entryBar = $("div.entrybar").last();
            const scrollPosition = entryBar ? entryBar.position().top - 420 : $(document).height();
            $("html, body").animate({
                scrollTop: scrollPosition
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
    $(elem).click(function () {
        if (!window.__cfRLUnblockHandlers) {
            return false;
        }
        $('#hamburger-menu').fadeOut(100, 'swing');
    });
}

function overridePushHistory() {
    overrideRenderCenter();
    overrideLoadCenter();

    window.pushHistory = function (url, selector, html, title, centerframeJQueryObject, centerframeTitle) {
        if (html.length / 1024 > 630) { return; }
        const wrapper = centerframeJQueryObject || $("<div>" + html + "</div>");
        const titleElement = centerframeTitle || wrapper.find(".xhr-mt").first();
        const descElement = wrapper.find(".xhr-mdesc").first();
        const canonicalElement = wrapper.find(".xhr-cnn").first();
        let description = "";
        let canonicalHref = "";
        const lowerTitle = title?.toLowerCase() || titleElement?.html()?.toLowerCase();
        if (descElement?.length) {
            description = descElement.html();
            $("meta[name='description']").attr("content", description);
        }
        if (canonicalElement?.length) {
            canonicalHref = canonicalElement.html();
            $('link[rel="canonical"]').attr("href", canonicalHref);
        }
        const historyState = {
            path: url,
            selector: selector,
            html: html,
            title: lowerTitle,
            desc: description
        };
        if (typeof window.history.pushState === "function") {
            if (window.history.state?.path === url) {
                window.history.state.html = html;
                return;
            }
            window.history.pushState(historyState, url, url);
        }
        else {
            window.location.hash = "#!" + url;
        }
        if (typeof gtag === "function" && window.location.pathname !== "" && window.location.pathname !== "/") {
            const analyticsData = {
                page_title: lowerTitle,
                page_location: window.location.href,
                page_path: url
            };
            gtag("event", "page_view", analyticsData);
        }
        updateTitle(lowerTitle);
    };
}

function overrideRenderCenter() {
    window.renderCenter = function (html, url, title, centerframeJQueryObject, centerframeTitle) {
        $("#centerframe").html(html);
        if (isMobile()) {
            collapseLeftFrame();
        }
        window.scrollTo(0, 0);
        pushHistory(url, "#centerframe", html, title, centerframeJQueryObject, centerframeTitle);
        stickPanels();
        processEntry();
        if (typeof AUTHOR_ID !== "undefined") {
            initInputEntryBody();
        }
        hideLoader();
    };
}

function overrideLoadCenter() {
    window.loadCenter = function (url) {
        if (url === "" || url === undefined) { return; }
        if (
            typeof pageLeaveCheck !== "function" ||
            pageLeaveCheck() ||
            confirm("bu sayfaya girdiğiniz fakat göndermediğiniz içerikler var. \nsayfadan ayrılırsanız bu içerikler kaybolacaktır. \n\nilerlemek istiyor musunuz?")
        ) {
            showLoader();
            $.ajax({
                method: "GET",
                url,
                cache: false,
                async: true,
                success(html) {
                    const centerframeJQueryObject = $("<div>" + html + "</div>");
                    const centerframeTitle = centerframeJQueryObject.find(".xhr-mt").first();
                    if (centerframeTitle && centerframeTitle.length === 1) {
                        renderCenter(html, url, undefined, centerframeJQueryObject, centerframeTitle);
                    }
                    else {
                        fetchTitle(url).then(title => {
                            renderCenter(html, url, title, centerframeJQueryObject, centerframeTitle);
                        });
                    }
                },
                error(response, status) {
                    if (response.status < 500) {
                        renderCenter(response.responseText, url);
                    }
                    else {
                        alert("istediğiniz içerik yüklenemedi. \nbir süre sonra yeniden deneyin.");
                    }
                    hideLoader();
                }
            });
        }
    };
}

function adjustLoadingIndicator() {
    Object.defineProperty(window, "showLoader", {
        value() {
            document.querySelector("#centerframe").style.opacity = "0.7";
            document.querySelector("#leftframe").style.opacity = "0.7";
        },
        writable: false,
        configurable: false,
    });

    Object.defineProperty(window, "hideLoader", {
        value() {
            document.querySelector("#centerframe").style.opacity = "1";
            document.querySelector("#leftframe").style.opacity = "1";
        },
        writable: false,
        configurable: false,
    });
}

function waitForVariable(variable) {
    return new Promise(resolve => {
        const id = setInterval(() => {
            if (window[variable] !== undefined) {
                resolve();
                clearInterval(id);
            }
        }, 50);
    });
}

function waitForElement(selector) {
    return new Promise(resolve => {
        const elem = document.querySelector(selector);
        if (elem) { return resolve(elem); }
        new MutationObserver((_, observer) => {
            const elem = document.querySelector(selector);
            if (elem) {
                observer.disconnect();
                resolve(elem);
            }
        }).observe(document, { childList: true, subtree: true });
    });
}

function removeJQueryEventListener(event, selector) {
    return new Promise(resolve => {
        const id = setInterval(() => {
            const events = $._data(document, "events")[event];

            if (events?.some(event => event.selector === selector)) {
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
