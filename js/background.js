chrome.runtime.onInstalled.addListener(() => {
    const defaultProfilePictureUrl = "https://normalsozluk.com/images/no_avatarfb.jpg";
    const defaultFontFamily = "Source Sans Pro";
    const defaultSpanContentToPage = false;

    chrome.storage.local.get().then(({
        profilePictureUrl,
        fontFamily,
        spanContentToPage,
    }) => {
        chrome.storage.local.set({
            profilePictureUrl: profilePictureUrl || defaultProfilePictureUrl,
            fontFamily: fontFamily || defaultFontFamily,
            spanContentToPage: spanContentToPage || defaultSpanContentToPage,
        });
    });
});

chrome.runtime.onStartup.addListener(() => {

});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case "injectCSS":
                injectCSS(sender.tab.id);
                break;
            case "insertCSSString":
                insertCSSString(sender.tab.id, request.CSS);
                break;
            case "removeCSSString":
                removeCSSString(sender.tab.id, request.CSS);
                break;
            case "fontFamily":
                fontFamily(sender.tab.id, request.oldValue, request.newValue);
                break;
        }
    }
);

function injectCSS(tabId) {
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        origin: "AUTHOR",
        files: ["css/style.min.css"],
    });
}

function insertCSSString(tabId, CSS) {
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        origin: "USER",
        css: CSS,
    });
}

function removeCSSString(tabId, CSS) {
    chrome.scripting.removeCSS({
        target: { tabId: tabId },
        origin: "USER",
        css: CSS,
    });
}

function fontFamily(tabId, oldValue, newValue) {
    if (oldValue) {
        chrome.scripting.removeCSS({
            target: { tabId },
            origin: "USER",
            css: `body{font-family:"${ oldValue.replace(/^(other)(.*)/, "$2") }"!important}`,
        });
    }
    chrome.scripting.insertCSS({
        target: { tabId },
        origin: "USER",
        css: `body{font-family:"${ newValue.replace(/^(other)(.*)/, "$2") }"!important}`,
    });
}
