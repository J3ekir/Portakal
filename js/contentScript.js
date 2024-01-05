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

    if (!qs("#portakal-nav")) {
        addPortakalNav();
    }

    addPortakalNavCSS();

    // ilk/son sayfa tuşlarını ekle
    addPageButtons();
}

function addPortakalNavCSS() {
    if (/^https:\/\/normalsozluk\.com\/(?:|feed|myfeed|portakal)$/.test(location.href)) {
        chrome.runtime.sendMessage({
            type: "insertCSSString",
            CSS: "#portakal-nav{display:flex!important;}",
        });
    }
    else {
        chrome.runtime.sendMessage({
            type: "insertCSSString",
            CSS: "#portakal-nav{display:none!important;}",
        });
    }

    if (/^https:\/\/normalsozluk\.com\/portakal$/.test(location.href)) {
        chrome.runtime.sendMessage({
            type: "insertCSSString",
            CSS: "#entriesheadingcontainer{display:none!important;}",
        });
    }
    else {
        chrome.runtime.sendMessage({
            type: "insertCSSString",
            CSS: "#entriesheadingcontainer{display:block!important;}",
        });
    }

    dom.cl.remove(".portakal-navitem.portakal-navitem-active", "portakal-navitem-active");
    qsa(".portakal-navitem").forEach(elem => {
        if (elem.href === location.href) {
            dom.cl.add(elem, "portakal-navitem-active");
        }
    });
}

function addPortakalNav() {
    var parent = qs("#centerframe").parentElement;

    var nav = dom.ce("nav");
    nav.id = "portakal-nav";

    var baseNavButton = dom.ce("a");
    dom.cl.add(baseNavButton, "portakal-navitem loadcenter");

    var mainPage = dom.clone(baseNavButton);
    dom.attr(mainPage, "href", "https://normalsozluk.com/");
    dom.attr(mainPage, "title", "tüm zamanların beğenilen tanımları");
    dom.text(mainPage, "keşfet");

    var feedPage = dom.clone(baseNavButton);
    dom.attr(feedPage, "href", "https://normalsozluk.com/feed");
    dom.attr(feedPage, "title", "en son girilen tanımlar");
    dom.text(feedPage, "akış");

    var myFeedPage = dom.clone(baseNavButton);
    dom.attr(myFeedPage, "href", "https://normalsozluk.com/myfeed");
    dom.attr(myFeedPage, "title", "bildirimi açık başlıklara girilen ve takip ettiğiniz yazarlar tarafından girilen tanımlar");
    dom.text(myFeedPage, "takip");

    var portakalPage = dom.clone(baseNavButton);
    dom.attr(portakalPage, "href", "https://normalsozluk.com/portakal");
    dom.attr(portakalPage, "title", "dünün en beğenilen tanımları");
    dom.text(portakalPage, "portakal");

    nav.append(mainPage, feedPage, myFeedPage, portakalPage);

    parent.prepend(nav);
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
