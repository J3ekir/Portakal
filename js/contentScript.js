const loadcenterSelectors = `
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
`;

const centerframeFunctions = [
    adjustPageTitle,
    adjustSearchPlaceholders,
    adjustEntrySearchPlaceholder,
    moveTitleCategory,

    addPortakalNav,
    addPortakalNavCSS,

    addUnpublishedEntriesNav,
    addUnpublishedEntriesNavCSS,

    addProfilePicture,
    addPageButtons,
];

changeGlobalFont();

observe("#centerframe", () =>
    centerframeFunctions.forEach(func => func())
);

(function connect() {
    chrome.runtime.connect({ name: "keepAlive" })
        .onDisconnect.addListener(connect);
})();

chrome.storage.onChanged.addListener(changes => {
    Object.entries(changes).forEach(([key, { oldValue, newValue }]) => {
        switch (key) {
            case "profilePictureURL":
                qs("#cockpitProfilePicture").src = newValue;
                break;
            case "fontFamily":
                changeGlobalFont();
                break;
        }
    });
});


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
    const excludedFonts = [
        "Source Sans Pro",
        "Segoe UI",
        "other"
    ];

    chrome.storage.local.get("fontFamily").then(settings => {
        const fontName = settings["fontFamily"];

        chrome.runtime.sendMessage({
            type: "insertCSSString",
            CSS: `body{font-family:"${ fontName.replace(/^(other)(.*)/, "$2") }"!important;}`,
        });

        if (excludedFonts.some(elem => fontName.startsWith(elem))) { return; }

        waitForElement("head").then(elem => {
            if (qs(`style[data-font-name="${ fontName }"]`)) { return; }

            const link = dom.ce("link");
            link.rel = "preload";
            link.as = "font";
            link.type = "font/woff2";
            link.crossOrigin = "anonymous";
            link.href = chrome.runtime.getURL(`fonts/${ fontName }/${ fontName }-latin.woff2`);

            const linkExt = dom.clone(link);
            linkExt.href = chrome.runtime.getURL(`fonts/${ fontName }/${ fontName }-latin-ext.woff2`);

            const customFont = dom.ce("style");
            customFont.dataset.fontName = fontName;
            customFont.textContent = customFontCSS(fontName);

            elem.append(
                link,
                linkExt,
                customFont,
            );
        });
    });
}

function addPortakalNavCSS() {
    dom.cl.toggle("#portakal-nav", "portakal-nav-visible", /^https:\/\/normalsozluk\.com\/(?:|feed|myfeed|portakal)$/.test(location.href));
    dom.cl.remove(".portakal-navitem.portakal-navitem-active", "portakal-navitem-active");
    dom.cl.add(`.portakal-navitem[href="${ location.href }"]`, "portakal-navitem-active");

    // Tüm sayfayı yeniden yüklemeyi gerektirmeyen bağlantılara 
    // gerekli sınıfı ekle (sol çerçeveyi değiştiren sayfalar hariç)
    if (!/^https:\/\/normalsozluk\.com\/(admin|modlog|stats)/.test(location.href)) {
        dom.cl.add(loadcenterSelectors, "loadcenter");
        const cockpitCenterLoaders = qsa("#frame_cockpit > a:nth-child(-n+6)");
        dom.cl.add(cockpitCenterLoaders, "frame-toggler");
        dom.attr(cockpitCenterLoaders, "onclick", "if (!window.__cfRLUnblockHandlers) return false; $('#frame_cockpit').fadeOut(100, 'swing')");
    }
}

function addPortakalNav() {
    if (qs("#portakal-nav")) { return; }

    const nav = dom.ce("nav");
    nav.id = "portakal-nav";

    const baseNavButton = dom.ce("a");
    dom.cl.add(baseNavButton, "portakal-navitem loadcenter");

    const linkData = [
        { href: "", title: "tüm zamanların beğenilen tanımları", text: "keşfet" },
        { href: "feed", title: "en son girilen tanımlar", text: "akış" },
        { href: "myfeed", title: "bildirimi açık başlıklara girilen ve takip ettiğiniz yazarlar tarafından girilen tanımlar", text: "takip" },
        { href: "portakal", title: "dünün en beğenilen tanımları", text: "portakal" },
    ];

    linkData.forEach(elem => {
        const navButton = dom.clone(baseNavButton);
        dom.attr(navButton, "href", `https://normalsozluk.com/${ elem.href }`);
        dom.attr(navButton, "title", elem.title);
        dom.text(navButton, elem.text);
        nav.append(navButton);
    });

    qs("#centerframe").parentElement.prepend(nav);
}

function addUnpublishedEntriesNavCSS() {
    dom.cl.toggle("#unpublishedentries-nav", "unpublishedentries-nav-visible", /^https:\/\/normalsozluk\.com\/ben\/tanimlar\/(draft|morning|deleted|removed|republishing)$/.test(location.href));
    dom.cl.remove(".unpublishedentries-navitem.unpublishedentries-navitem-active", "unpublishedentries-navitem-active");
    dom.cl.add(`.unpublishedentries-navitem[href="${ location.href }"]`, "unpublishedentries-navitem-active");
}

function addUnpublishedEntriesNav() {
    if (qs("#unpublishedentries-nav")) { return; }

    const nav = dom.ce("nav");
    nav.id = "unpublishedentries-nav";

    const baseNavButton = dom.ce("a");
    dom.cl.add(baseNavButton, "unpublishedentries-navitem loadcenter");

    const linkData = [
        { href: "draft", title: "sonradan yayınlamak istediğiniz tanımlar", text: "taslak" },
        { href: "morning", title: "sabahleyin kendiliğinden gönderilecek tanımlar", text: "sabaha kalan" },
        { href: "deleted", title: "kendi sildiğiniz tanımlar", text: "sildiğim" },
        { href: "removed", title: "yönetim tarafından kaldırılan tanımlar", text: "silinen" },
        { href: "republishing", title: "yönetim tarafından kaldırılan, sizin yeniden düzenlediğiniz tanımlar", text: "onay bekleyen" },
    ];

    linkData.forEach(elem => {
        const navButton = dom.clone(baseNavButton);
        dom.attr(navButton, "href", `https://normalsozluk.com/ben/tanimlar/${ elem.href }`);
        dom.attr(navButton, "title", elem.title);
        dom.text(navButton, elem.text);
        nav.append(navButton);
    });

    qs("#centerframe").parentElement.prepend(nav);
}

/**
 * profil resmini ekle
 */
function addProfilePicture() {
    // giriş yapmışsa ve profil resmi yoksa ekle
    if (qs(".button_signup, #cockpitProfilePicture")) { return; }

    const profilePicture = dom.ce("img");
    profilePicture.id = "cockpitProfilePicture";
    qs("[data-target='#frame_cockpit']").append(profilePicture);

    const defaultProfilePictureUrl = "https://normalsozluk.com/images/no_avatarfb.jpg";
    chrome.storage.local.get("profilePictureURL").then(settings => {
        qs("#cockpitProfilePicture").src = settings.profilePictureURL || defaultProfilePictureUrl;

        fetchProfilePictureURL().then(profilePictureURL => {
            if (profilePictureURL !== settings.profilePictureURL) {
                chrome.storage.local.set({ profilePictureURL });
            }
        });
    });
}

async function fetchProfilePictureURL() {
    const profileButton = await waitForElement("#frame_cockpit>:first-child");
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
    waitForElement("#entriesheadingcontainer .btn-group:has([role='group']+.btn>.fa-angle-right)").then(group => {
        if (group.children.length === 5) { return; }

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

const customFontCSS = fontName => `
    @font-face {
        font-family: "${ fontName }";
        src: url("${ chrome.runtime.getURL(`fonts/${ fontName }/${ fontName }-latin.woff2`) }") format("woff2");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
        font-family: "${ fontName }";
        src: url("${ chrome.runtime.getURL(`fonts/${ fontName }/${ fontName }-latin-ext.woff2`) }") format("woff2");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
        unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
`;

function waitForElement(selector) {
    return new Promise(resolve => {
        const elem = qs(selector);
        if (elem) { return resolve(elem); }
        new MutationObserver((_, observer) => {
            const elem = qs(selector);
            if (elem) {
                observer.disconnect();
                resolve(elem);
            }
        }).observe(document, { childList: true, subtree: true });
    });
}

function observe(selector, func) {
    waitForElement(selector).then(elem => {
        func();
        new MutationObserver(func).observe(elem, { childList: true });
    });
}
