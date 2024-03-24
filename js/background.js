chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.local.get().then(settings => {
        chrome.storage.local.set({
            "profilePictureURL": settings["profilePictureURL"] || "https://normalsozluk.com/images/no_avatarfb.jpg",
            "font-family": settings["font-family"] || "Source Sans Pro",
        });
    });
});

chrome.runtime.onStartup.addListener(async () => {

});

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
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

/****************************************************************************************/
// keepAlive
// https://stackoverflow.com/a/66618269/13630257
// "Persistent" service worker while a connectable tab is present
// "host_permissions": ["<all_urls>"],
const onUpdate = (tabId, info, tab) => /^https?:/.test(info.url) && findTab([tab]);
findTab();
chrome.runtime.onConnect.addListener(port => {
    if (port.name === "keepAlive") {
        setTimeout(() => port.disconnect(), 250e3);
        port.onDisconnect.addListener(() => findTab());
    }
});
async function findTab(tabs) {
    if (chrome.runtime.lastError) { } // tab was closed before setTimeout ran
    for (const { id: tabId } of tabs || await chrome.tabs.query({ url: "*://*/*" })) {
        try {
            await chrome.scripting.executeScript({ target: { tabId }, func: connect });
            chrome.tabs.onUpdated.removeListener(onUpdate);
            return;
        } catch (e) { }
    }
    chrome.tabs.onUpdated.addListener(onUpdate);
}
/****************************************************************************************/
