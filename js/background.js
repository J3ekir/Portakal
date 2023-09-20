chrome.runtime.onInstalled.addListener(async () => {

});

chrome.runtime.onStartup.addListener(async () => {

});

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        switch (request.type) {
            case "injectCSS":
                await injectCSS(sender.tab.id, request.CSS);
                break;
            default:
                break;
        }
    }
);

async function injectCSS(tabId, CSS) {
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        origin: "AUTHOR",
        css: CSS
    });
}


/****************************************************************************************/
// keepAlive
// https://stackoverflow.com/a/66618269/13630257
// "Persistent" service worker while a connectable tab is present
// "host_permissions": ["<all_urls>"],
// const onUpdate = (tabId, info, tab) => /^https?:/.test(info.url) && findTab([tab]);
// findTab();
// chrome.runtime.onConnect.addListener(port => {
//     if (port.name === "keepAlive") {
//         setTimeout(() => port.disconnect(), 250e3);
//         port.onDisconnect.addListener(() => findTab());
//     }
// });
// async function findTab(tabs) {
//     if (chrome.runtime.lastError) { } // tab was closed before setTimeout ran
//     for (const { id: tabId } of tabs || await chrome.tabs.query({ url: "*://*/*" })) {
//         try {
//             await chrome.scripting.executeScript({ target: { tabId }, func: connect });
//             chrome.tabs.onUpdated.removeListener(onUpdate);
//             return;
//         } catch (e) { }
//     }
//     chrome.tabs.onUpdated.addListener(onUpdate);
// }
// function connect() {
//     chrome.runtime.connect({ name: "keepAlive" })
//         .onDisconnect.addListener(connect);
// }
/****************************************************************************************/
