chrome.storage.local.get("fontFamily").then(settings => {
    changeFontFamily(settings.fontFamily)
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

chrome.storage.onChanged.addListener(changes => {
    Object.entries(changes).forEach(([key, { oldValue, newValue }]) => {
        switch (key) {
            case "fontFamily":
                changeFontFamily(newValue);
                break;
        }
    });
});

function changeFontFamily(newFontFamily) {
    const [, fontFamily, fontFamilyCustom] = newFontFamily.match(/^(other|.*)(.*)$/);
    qs("#font-family").value = fontFamily;
    qs("#font-family-custom>input").value = fontFamilyCustom;
}
