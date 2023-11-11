waitForElementToExist(".entryscrollbottom span").then(elem => {
    func();
    observe();
});



function func() {
    // başlık içi arama yer tutucu yazılarını değiştir
    qs('[name="q"]').placeholder = "başlıkta ara";

    // başlık kategorisini başlığın altına taşı
    var category = qs("#entry-heading-category");
    category.parentElement.insertBefore(category, category.parentElement.children[1]);

    // ilk/son sayfa tuşlarını ekle
    addPageButtons();
}

function addPageButtons() {
    waitForElementToExist("#entriesheadingcontainer .dropdown-pagination > .btn-group").then(group => {
        if (group.children.length != 5) {
            var bodyColor = getComputedStyle(document.body).color;
            var pageList = qs(group, ".dropdown-menu");


            // var leftArrow = dom.ce("a");
            // var rightArrow = dom.ce("a");
            // leftArrow.outerHTML = '<a class="btn btn-sm btn-secondary loadcenter" href="null"><i class="fa fa-angle-double-left"></i></a>';
            // rightArrow.outerHTML = '<a class="btn btn-sm btn-secondary loadcenter" href="null"><i class="fa fa-angle-double-right"></i></a>';

            // leftArrow.href = group.firstElementChild.href ?? undefined;




            var leftArrow = dom.clone(group.firstElementChild);
            var rightArrow = dom.clone(group.firstElementChild);
            leftArrow.firstElementChild.className = "fa fa-angle-double-left";
            rightArrow.firstElementChild.className = "fa fa-angle-double-right";

            // leftArrow.href = group.firstElementChild.href
            //     ? pageList.firstElementChild.href
            //     : undefined;
            // rightArrow.href = group.lastElementChild.href
            //     ? pageList.lastElementChild.href
            //     : undefined;

            group.firstElementChild.href ? leftArrow.href = pageList.firstElementChild.href : null;
            group.lastElementChild.href ? rightArrow.href = pageList.lastElementChild.href : null;






            // leftArrow.href = pageList.firstElementChild.href;
            // rightArrow.href = pageList.lastElementChild.href;

            // if (group.firstElementChild.href.length === 0) {
            //     leftArrow.style.color = bodyColor;
            // }
            // if (group.lastElementChild.href.length === 0) {
            //     rightArrow.style.color = bodyColor;
            // }

            group.prepend(leftArrow);
            group.append(rightArrow);
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

async function observe() {
    var i = 0;

    const targetNode = qs("#ajaxloading");
    const config = { attributes: true, attributeFilter: ["style"] };
    const callback = async (mutationList, observer) => {
        if (targetNode.style.display === "none") {
            console.log(`ajax gitti: ${ i }`);
            i += 1;
            var elma = qs("#entriesheadingcontainer .dropdown-pagination > .btn-group");
            if (elma) {
                console.log(`${ elma.children.length }`);
            }
            

            func();
        }
    };
    const observer = new MutationObserver(callback);
    if (targetNode) {
        observer.observe(targetNode, config);
    }
    //observer.disconnect();
}
