chrome.storage.local.get([
    "font-family",
    "logo",
]).then(settings => {
    qs("#font-family").value = settings["font-family"];
    qs("#logo").value = settings["logo"];
});

qs("#font-family").addEventListener("change", event => {
    chrome.storage.local.set({ "font-family": event.target.value });
});

qs("#logo").addEventListener("change", event => {
    chrome.storage.local.set({ "logo": event.target.value });
});
