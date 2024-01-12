observe("#centerframe", centerframe);

(function connect() {
    chrome.runtime.connect({ name: "keepAlive" })
        .onDisconnect.addListener(connect);
})();

chrome.storage.onChanged.addListener(changes => {
    Object.entries(changes).forEach(([key, { oldValue, newValue }]) => {
        switch (key) {
            case "profilePictureURL":
                qs("#cockpitProfilePicture").src = newValue;
        }
    });
});


function centerframe() {
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
    //changeGlobalFont();

    addProfilePicture();

    // ilk/son sayfa tuşlarını ekle
    addPageButtons();
}

function changeGlobalFont() {
    var fontLoader = function (param) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";

        document.head.appendChild(link);

        link.href = "https://fonts.googleapis.com/css?family=" + param.family;
    };

    fontLoader({
        family: "Source+Sans+3:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    });
}

function addPortakalNavCSS() {
    if (/^https:\/\/normalsozluk\.com\/(?:|feed|myfeed|portakal)$/.test(location.href)) {
        chrome.runtime.sendMessage({
            type: "insertCSSString",
            CSS: "#portakal-nav{height:48px!important;padding-top:2px!important;padding-bottom:6px!important;opacity:100;z-index:1;pointer-events:revert;}",
        });
    }
    else {
        chrome.runtime.sendMessage({
            type: "insertCSSString",
            CSS: "#portakal-nav{height:0!important;padding:0!important;opacity:0;z-index:0;pointer-events:none;}",
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

    // Tüm sayfayı yeniden yüklemeyi gerektirmeyen bağlantılara 
    // gerekli sınıfı ekle (sol çerçeveyi değiştiren sayfalar hariç)
    if (!/^https:\/\/normalsozluk\.com\/(admin|modlog|stats)$/.test(location.href)) {
        dom.cl.add(".toplogo a, .bkz, .entryauthor, .entry > h2 > a, .entry > h3 > a, #notificationpreviewcontainer .bkz", "loadcenter");
        dom.cl.remove(".bkz-external", "loadcenter");
    }
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

function addProfilePicture() {
    if (!qs("#cockpitProfilePicture")) {
        dom.remove("[data-target='#frame_cockpit']>:is(i,span)");

        const profilePicture = dom.ce("img");
        profilePicture.id = "cockpitProfilePicture";
        qs("[data-target='#frame_cockpit']").append(profilePicture);

        chrome.storage.local.get("profilePictureURL").then(settings => {
            qs("#cockpitProfilePicture").src = settings.profilePictureURL || "https://normalsozluk.com/images/no_avatarfb.jpg";
        });
    }

    if (qs(".profile-photo-actions")) {
        chrome.storage.local.get("profilePictureURL").then(settings => {
            const newprofilePictureURL = dom.attr(".profile-picture>img", "src").replace(/_l\.jpeg$/, "_s.jpeg");

            if (newprofilePictureURL !== settings.profilePictureURL) {
                chrome.storage.local.set({
                    profilePictureURL: newprofilePictureURL,
                });
            }
        });
    }
}

function addPageButtons() {
    waitForElementToExist("#entriesheadingcontainer .btn-group:has(.fa-angle-right)").then(group => {
        if (group.children.length === 5) {
            return;
        }

        const leftArrowButton = dom.ce("a");
        dom.cl.add(leftArrowButton, "btn btn-sm btn-secondary loadcenter");
        const leftArrowIcon = dom.ce("i");
        dom.cl.add(leftArrowIcon, "fa fa-angle-double-left");
        leftArrowButton.append(leftArrowIcon);

        const rightArrowButton = dom.ce("a");
        dom.cl.add(rightArrowButton, "btn btn-sm btn-secondary loadcenter");
        const rightArrowIcon = dom.ce("i");
        dom.cl.add(rightArrowIcon, "fa fa-angle-double-right");
        rightArrowButton.append(rightArrowIcon);

        const pageList = qs(group, ".dropdown-menu");

        if (group.firstElementChild.href) {
            leftArrowButton.href = pageList.firstElementChild.href;
        }
        if (group.lastElementChild.href) {
            rightArrowButton.href = pageList.lastElementChild.href;
        }

        group.prepend(leftArrowButton);
        group.append(rightArrowButton);
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

function observe(selector, func) {
    waitForElementToExist(selector).then(elem => {
        func();

        new MutationObserver(async (mutationList, observer) => {
            func();
        })
            .observe(elem, { childList: true });
    });
}
