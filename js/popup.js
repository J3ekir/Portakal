chrome.storage.local.get([
    "fontFamily",
    "spanContentToPage",
]).then(({
    fontFamily,
    spanContentToPage,
}) => {
    changeFontFamily(fontFamily);
    qs("#span-content-to-page-checkbox").checked = spanContentToPage;
});

qs("#font-family").addEventListener("change", event => {
    const value = event.currentTarget.value;
    event.currentTarget.dataset.value = value;

    if (value === "other") {
        qs("#font-family-custom>button").click();
    }
    else {
        chrome.storage.local.set({ "fontFamily": value });
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

qs("#span-content-to-page-checkbox").addEventListener("change", event => {
    chrome.storage.local.set({ "spanContentToPage": event.currentTarget.checked });
});

chrome.storage.onChanged.addListener(changes => {
    Object.entries(changes).forEach(([key, { oldValue, newValue }]) => {
        switch (key) {
            case "fontFamily":
                if (oldValue === newValue) { return; }
                changeFontFamily(newValue);
                break;
            case "spanContentToPage":
                if (oldValue === newValue) { return; }
                qs("#span-content-to-page-checkbox").checked = newValue;
                break;
        }
    });
});

function changeFontFamily(newFontFamily) {
    const [, fontFamily, fontFamilyCustom] = newFontFamily.match(/^(other|.*)(.*)$/);
    qs("#font-family").value = fontFamily;
    qs("#font-family-custom>input").value = fontFamilyCustom;
}
