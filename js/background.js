chrome.runtime.onInstalled.addListener(() => {
    setDefaultSettings();
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

function setDefaultSettings() {
    const defaultSettings = {
        profilePictureUrl: "https://normalsozluk.com/images/no_avatarfb.jpg",
        fontFamily: "Source Sans Pro",
        spanContentToPage: false,
    };
    const defaultSettingsKeys = Object.keys(defaultSettings);

    chrome.storage.local.get(defaultSettingsKeys).then(settings => chrome.storage.local.set(Object.fromEntries(defaultSettingsKeys.map(key => [key, settings[key] ?? defaultSettings[key]]))));
}

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
