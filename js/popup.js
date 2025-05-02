chrome.storage.local.get("fontFamily").then(settings => {
    qs("#font-family").value = settings.fontFamily.replace(/^(other|.*)(.*)/, "$1");
    qs("#font-family-custom>input").value = settings.fontFamily.replace(/^(other|.*)(.*)/, "$2");
});

qs("#font-family").addEventListener("change", event => {
    if (event.currentTarget.value === "other") {
        qs("#font-family-custom>button").click();
    }
    else {
        chrome.storage.local.set({ "fontFamily": event.currentTarget.value });
    }
});

qs("#font-family-custom>input").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.currentTarget.nextElementSibling.click();
    }
});

qs("#font-family-custom>button").addEventListener("click", event => {
    if (event.currentTarget.previousElementSibling.value) {
        chrome.storage.local.set({ "fontFamily": `other${ event.currentTarget.previousElementSibling.value }` });
    }
});
