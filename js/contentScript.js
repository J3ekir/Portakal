waitForElementToExist("#centerframe").then(elem => {
    func();
    observe();
});

(function connect() {
    chrome.runtime.connect({ name: 'keepAlive' })
        .onDisconnect.addListener(connect);
})();


function func() {
    //belge başlığını küçült
    document.title = document.title.toLowerCase();

    //genel arama yer tutucu yazını değiştir
    var titleSearch = qs("#titlesearch");
    if (titleSearch) {
        titleSearch.placeholder = "sözlükte ara";
    }

    // başlık içi arama yer tutucu yazılarını değiştir
    var entrySearch = qs("[name='q']");
    if (entrySearch) {
        entrySearch.placeholder = "başlıkta ara";
    }

    // başlık kategorisini başlığın altına taşı
    var category = qs("#entry-heading-category");
    if (category) {
        category.parentElement.insertBefore(category, category.parentElement.children[1]);
    }

    // ilk/son sayfa tuşlarını ekle
    addPageButtons();
}

function addPageButtons() {
    waitForElementToExist("#entriesheadingcontainer .dropdown-pagination > .btn-group > .btn:not(:first-child)").then(rightArrow => {
        var group = rightArrow.parentElement;

        if (!group || group.children.length === 5) {
            return;
        }

        var pageList = qs(group, ".dropdown-menu");

        group.innerHTML = `
            <a class="btn btn-sm btn-secondary loadcenter"><i class="fa fa-angle-double-left"></i></a>
            ${ group.innerHTML }
            <a class="btn btn-sm btn-secondary loadcenter"><i class="fa fa-angle-double-right"></i></a>
        `;

        if (group.children[1].href) {
            group.firstElementChild.href = pageList.firstElementChild.href;
        }
        if (group.children[3].href) {
            group.lastElementChild.href = pageList.lastElementChild.href;
        }
    });
}

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

function observe() {
    const targetNode = qs("#centerframe");
    new MutationObserver(async (mutationList, observer) => {
        func();
    })
        .observe(targetNode, { childList: true });
}
