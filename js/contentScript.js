const regexes = [
    {
        regex: /^https:\/\/normalsozluk\.com\/b\//,
        func: entry,
    }
];


checkURL();
observe();



function checkURL() {
    for (const { regex, func } of regexes) {
        if (regex.test(location.href)) {
            func();
        }
    }
}

function entry() {
    // başlık içi arama yer tutucu yazılarını değiştir
    qs(`[name="q"]`).placeholder = "başlıkta ara";

    // tuşlar alanındaki boşlukları kaldır
    dom.cl.remove("#container-list-header-buttons", "clearfix");
    dom.cl.remove("#container-list-header-buttons > form", "form-inline");

    // "sayfa sonu" tuşundaki metni kaldır
    dom.remove(".entryscrollbottom span");  // ??? neden undefined olsun

    // başlık kategorisini başlığın altına taşı
    var category = qs("#entry-heading-category");
    category.parentElement.insertBefore(category, category.parentElement.children[1]);


    // sayfa tuşları varsa
    var group = qs("#entriesheadingcontainer .dropdown-pagination > .btn-group");

    if (group && group.children.length != 5) {
        // ilk/son sayfa tuşlarını ekle
        var bodyColor = getComputedStyle(document.body).color;
        var pageList = qs(group, ".dropdown-menu");
        var leftArrow = dom.clone(group.firstElementChild);
        var rightArrow = dom.clone(group.firstElementChild);
        leftArrow.firstElementChild.className = "fa fa-angle-double-left";
        rightArrow.firstElementChild.className = "fa fa-angle-double-right";
        leftArrow.href = pageList.firstElementChild.href;
        rightArrow.href = pageList.lastElementChild.href;

        if (group.firstElementChild.href.length === 0) {
            leftArrow.style.color = bodyColor;
        }
        if (group.lastElementChild.href.length === 0) {
            rightArrow.style.color = bodyColor;
        }

        group.prepend(leftArrow);
        group.append(rightArrow);
    }
}

async function observe() {
    const targetNode = qs("#ajaxloading");
    const config = { attributes: true, attributeFilter: ["style"] };
    const callback = async (mutationList, observer) => {
        if (targetNode.style.display === "none") {
            checkURL();
        }
    };
    const observer = new MutationObserver(callback);
    if (targetNode) {
        observer.observe(targetNode, config);
    }
    //observer.disconnect();
}



dom.cl.remove("#container-list-header-buttons", "clearfix");

var header = qs("#container-list-header-buttons");
dom.cl.remove(header, "clearfix");

