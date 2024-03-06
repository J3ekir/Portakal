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
    adjustPageTitle();
    adjustSearchPlaceholders();
    adjustEntrySearchPlaceholder();
    moveTitleCategory();

    addPortakalNav();
    addPortakalNavCSS();

    addUnpublishedEntriesNav();
    addUnpublishedEntriesNavCSS();

    //changeGlobalFont();

    addProfilePicture();
    addPageButtons();
}

/**
 * belge başlığını küçült
 */
function adjustPageTitle() {
    document.title = document.title.toLowerCase();
}

/**
 * genel arama yer tutucu yazını değiştir
 */
function adjustSearchPlaceholders() {
    const titleSearch = qs("#titlesearch");
    if (titleSearch) {
        titleSearch.placeholder = "sözlükte ara";
    }
}

/**
 * başlık içi arama yer tutucu yazılarını değiştir
 */
function adjustEntrySearchPlaceholder() {
    const entrySearch = qs("[name='q']");
    if (entrySearch) {
        entrySearch.placeholder = "başlıkta ara";
    }
}

/**
 * başlık kategorisini başlığın altına taşı
 */
function moveTitleCategory() {
    const category = qs("#entry-heading-category");
    category?.parentElement.insertBefore(category, category.parentElement.children[1]);
}

function changeGlobalFont() {
    const fontLoader = function (param) {
        const link = document.createElement("link");
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
    var portakalNav = qs("#portakal-nav");
    if (/^https:\/\/normalsozluk\.com\/(?:|feed|myfeed|portakal)$/.test(location.href)) {
        dom.cl.add(portakalNav, "portakal-nav-visible");
    }
    else {
        dom.cl.remove(portakalNav, "portakal-nav-visible");
    }

    dom.cl.remove(".portakal-navitem.portakal-navitem-active", "portakal-navitem-active");
    dom.cl.add(`.portakal-navitem[href="${ location.href }"]`, "portakal-navitem-active");

    // Tüm sayfayı yeniden yüklemeyi gerektirmeyen bağlantılara 
    // gerekli sınıfı ekle (sol çerçeveyi değiştiren sayfalar hariç)
    if (!/^https:\/\/normalsozluk\.com\/(admin|modlog|stats)/.test(location.href)) {
        dom.cl.add(`
            .toplogo a,
            .bkz:not(.bkz-external),
            .entryauthor,
            .entry > h2 > a,
            .entry > h3 > a,
            #notificationpreviewcontainer .bkz,
            .profile-tabs .btn:not(.btn-primary):not(.btn-warning):not(.btn-info),
            .profile-nickname a,
            .has-side-ad-:has(#profile-top) > h2.text-primary > a,
            #entriesheadingcontainer > header > h1 > a,
            #frame_cockpit > a:nth-child(-n+6)
            `,
            "loadcenter"
        );
        var cockpitCenterLoaders = qsa("#frame_cockpit > a:nth-child(-n+6)");
        dom.cl.add(cockpitCenterLoaders, "frame-toggler");
        dom.attr(cockpitCenterLoaders, "onclick", "if (!window.__cfRLUnblockHandlers) return false; $('#frame_cockpit').fadeOut(100, 'swing')");
    }
}

function addPortakalNav() {
    if (qs("#portakal-nav")) {
        return;
    }

    const nav = dom.ce("nav");
    nav.id = "portakal-nav";

    const baseNavButton = dom.ce("a");
    dom.cl.add(baseNavButton, "portakal-navitem loadcenter");

    const mainPage = dom.clone(baseNavButton);
    dom.attr(mainPage, "href", "https://normalsozluk.com/");
    dom.attr(mainPage, "title", "tüm zamanların beğenilen tanımları");
    dom.text(mainPage, "keşfet");

    const feedPage = dom.clone(baseNavButton);
    dom.attr(feedPage, "href", "https://normalsozluk.com/feed");
    dom.attr(feedPage, "title", "en son girilen tanımlar");
    dom.text(feedPage, "akış");

    const myFeedPage = dom.clone(baseNavButton);
    dom.attr(myFeedPage, "href", "https://normalsozluk.com/myfeed");
    dom.attr(myFeedPage, "title", "bildirimi açık başlıklara girilen ve takip ettiğiniz yazarlar tarafından girilen tanımlar");
    dom.text(myFeedPage, "takip");

    const portakalPage = dom.clone(baseNavButton);
    dom.attr(portakalPage, "href", "https://normalsozluk.com/portakal");
    dom.attr(portakalPage, "title", "dünün en beğenilen tanımları");
    dom.text(portakalPage, "portakal");

    nav.append(mainPage, feedPage, myFeedPage, portakalPage);

    qs("#centerframe").parentElement.prepend(nav);
}

function addUnpublishedEntriesNavCSS() {
    var unpublishedEntriesNav = qs("#unpublishedentries-nav");
    if (/^https:\/\/normalsozluk\.com\/ben\/tanimlar\/(draft|morning|deleted|removed|republishing)$/.test(location.href)) {
        dom.cl.add(unpublishedEntriesNav, "unpublishedentries-nav-visible");
    }
    else {
        dom.cl.remove(unpublishedEntriesNav, "unpublishedentries-nav-visible");
    }

    dom.cl.remove(".unpublishedentries-navitem.unpublishedentries-navitem-active", "unpublishedentries-navitem-active");
    dom.cl.add(`.unpublishedentries-navitem[href="${ location.href }"]`, "unpublishedentries-navitem-active");
}

function addUnpublishedEntriesNav() {
    if (qs("#unpublishedentries-nav")) {
        return;
    }

    const nav = dom.ce("nav");
    nav.id = "unpublishedentries-nav";

    const baseNavButton = dom.ce("a");
    dom.cl.add(baseNavButton, "unpublishedentries-navitem loadcenter");

    const draftPage = dom.clone(baseNavButton);
    dom.attr(draftPage, "href", "https://normalsozluk.com/ben/tanimlar/draft");
    dom.attr(draftPage, "title", "sonradan yayınlamak istediğiniz tanımlar");
    dom.text(draftPage, "taslak");

    const morningPage = dom.clone(baseNavButton);
    dom.attr(morningPage, "href", "https://normalsozluk.com/ben/tanimlar/morning");
    dom.attr(morningPage, "title", "sabahleyin kendiliğinden gönderilecek tanımlar");
    dom.text(morningPage, "sabaha kalan");

    const deletedPage = dom.clone(baseNavButton);
    dom.attr(deletedPage, "href", "https://normalsozluk.com/ben/tanimlar/deleted");
    dom.attr(deletedPage, "title", "kendi sildiğiniz tanımlar");
    dom.text(deletedPage, "sildiğim");

    const removedPage = dom.clone(baseNavButton);
    dom.attr(removedPage, "href", "https://normalsozluk.com/ben/tanimlar/removed");
    dom.attr(removedPage, "title", "yönetim tarafından kaldırılan tanımlar");
    dom.text(removedPage, "silinen");

    const republishingPage = dom.clone(baseNavButton);
    dom.attr(republishingPage, "href", "https://normalsozluk.com/ben/tanimlar/republishing");
    dom.attr(republishingPage, "title", "yönetim tarafından kaldırılan, sizin yeniden düzenlediğiniz tanımlar");
    dom.text(republishingPage, "onay bekleyen");

    nav.append(draftPage, morningPage, deletedPage, removedPage, republishingPage);

    qs("#centerframe").parentElement.prepend(nav);
}

/**
 * profil resmini ekle
 */
function addProfilePicture() {
    // giriş yapmışsa ve profil resmi yoksa ekle
    if (!qs(".button_signup, #cockpitProfilePicture")) {
        dom.remove("[data-target='#frame_cockpit']>:is(i,span)");

        const profilePicture = dom.ce("img");
        profilePicture.id = "cockpitProfilePicture";
        qs("[data-target='#frame_cockpit']").append(profilePicture);

        chrome.storage.local.get("profilePictureURL").then(settings => {
            qs("#cockpitProfilePicture").src = settings.profilePictureURL || "https://normalsozluk.com/images/no_avatarfb.jpg";

            fetchProfilePictureURL().then(profilePictureURL => {
                if (profilePictureURL !== settings.profilePictureURL) {
                    chrome.storage.local.set({
                        profilePictureURL,
                    });

                    return;
                }
            });
        });
    }

    // profil resmi değişmişse kaydet ve değiştir
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

async function fetchProfilePictureURL() {
    const profileButton = await waitForElementToExist("#frame_cockpit>:first-child");
    const response = await fetch(profileButton.href);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const profilePictureURL = doc.querySelector(".profile-picture>img").src.replace(/_l\.jpeg$/, "_s.jpeg");

    return profilePictureURL;
}

/**
 * ilk/son sayfa tuşlarını ekle
 */
function addPageButtons() {
    waitForElementToExist("#entriesheadingcontainer .btn-group:has([role='group']+.btn>.fa-angle-right)").then(group => {
        if (group.children.length === 5) {
            return;
        }

        const firstPageButton = dom.ce("a");
        dom.cl.add(firstPageButton, "btn btn-sm btn-secondary loadcenter");
        const leftArrowIcon = dom.ce("i");
        dom.cl.add(leftArrowIcon, "fa fa-angle-double-left");
        firstPageButton.append(leftArrowIcon);

        const lastPageButton = dom.ce("a");
        dom.cl.add(lastPageButton, "btn btn-sm btn-secondary loadcenter");
        const rightArrowIcon = dom.ce("i");
        dom.cl.add(rightArrowIcon, "fa fa-angle-double-right");
        lastPageButton.append(rightArrowIcon);

        const pageList = qs(group, ".dropdown-menu");

        if (group.firstElementChild.href) {
            firstPageButton.href = pageList.firstElementChild.href;
        }
        if (group.lastElementChild.href) {
            lastPageButton.href = pageList.lastElementChild.href;
        }

        group.prepend(firstPageButton);
        group.append(lastPageButton);
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
