chrome.storage.local.get([
    "font-family",
    "logo",
]).then(settings => {
    qs("#font-family").value = settings["font-family"];
    qs("#logo").value = settings["logo"];
});
