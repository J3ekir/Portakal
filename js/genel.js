//belge başlığını küçült
document.title = document.title.toLowerCase();

waitForElementToExist("#titlesearch").then(elem => {
    elem.placeholder = "sözlükte ara";
});

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        new MutationObserver((_, observer) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                return resolve(document.querySelector(selector));
            }
        })
            .observe(document, { childList: true, subtree: true });
    });
}
