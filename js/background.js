chrome.runtime.onInstalled.addListener(async () => {

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

chrome.action.onClicked.addListener((tab) => {
    if (tab.url === "chrome://newtab/") {
        chrome.tabs.update({ url: "https://normalsozluk.com/" });
    }
    else {
        chrome.tabs.create({ url: "https://normalsozluk.com/" });
    }
});

function injectCSS(tabId) {
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        origin: "AUTHOR",
        files: ["css/style.css"],
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
