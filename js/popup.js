chrome.storage.local.get([
    "font-family",
    "logo",
]).then(settings => {
    qs("#font-family").value = settings["font-family"].replace(/^(other|.*)(.*)/, "$1");
    qs("#font-family-custom>input").value = settings["font-family"].replace(/^(other|.*)(.*)/, "$2");
    qs("#logo").value = settings["logo"];
});

qs("#font-family").addEventListener("change", event => {
    if (event.currentTarget.value === "other") {
        qs("#font-family-custom>button").click();
    }
    else {
        chrome.storage.local.set({ "font-family": event.currentTarget.value });
    }
});

qs("#font-family-custom>input").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.currentTarget.nextElementSibling.click();
    }
});

qs("#font-family-custom>button").addEventListener("click", event => {
    if (event.currentTarget.previousElementSibling.value) {
        chrome.storage.local.set({ "font-family": `other${ event.currentTarget.previousElementSibling.value }` });
    }
});

qs("#logo").addEventListener("change", event => {
    chrome.storage.local.set({ "logo": event.currentTarget.value });
});
