chrome.runtime.sendMessage({
    type: "injectCSS",
    CSS: `  .clearfix.my-2:has(.dropdown-pagination) {
                display: none !important;
            }
            #container-list-header-buttons > * {
                margin-bottom:0px !important;
            }
            #entry-heading-category > * {
                padding:0px !important;
            }
            #topbarmenu {
                box-shadow:none !important;
            }
            #container-list-header-buttons {
                border-bottom:none !important;
            }
            #footer > .clearfix {
                display:none;
            }
            #footer {
                background-color:#00000000!important;
            }
            #entriesheadingcontainer {
                padding-bottom: 8px !important;
                position: sticky !important;
                top: 64px !important;
                z-index: 1 !important;
                background-color: ${window.getComputedStyle(document.body).backgroundColor};
                box-shadow: 0 -10px ${window.getComputedStyle(document.body).backgroundColor};
            }`
});


func();
observe();


function func() {
    // title lower case
    document.title = document.title.toLowerCase();


    // category taşıma
    var id = document.querySelector("#entriesheadingcontainer");
    var category = id.querySelector("#entry-heading-category");
    var secondChild = id.children[1];
    id.insertBefore(category, secondChild);


    // ilk/son sayfa
    var leftArrowIClass = "fa fa-angle-double-left";
    var rightArrowIClass = "fa fa-angle-double-right";
    var arrowClass = "btn btn-sm btn-secondary loadcenter";

    // var group = document.querySelector("#entriesheadingcontainer > header > div > div > div");
    var group = document.querySelector("#entriesheadingcontainer .dropdown-pagination > .btn-group");

    if (group === null) {
        return;
    }

    var list = group.children[1].lastElementChild;
    var firstLink = list.firstElementChild.href;
    var lastLink = list.lastElementChild.href;
    var leftSingleArrow = group.children[0];
    var rightSingleArrow = group.children[2];

    // arialar?
    var leftArrow = document.createElement("a");
    leftArrow.className = arrowClass;
    leftArrow.href = firstLink;
    var leftArrowI = document.createElement("i");
    leftArrowI.className = leftArrowIClass;
    leftArrow.append(leftArrowI);

    var rightArrow = document.createElement("a");
    rightArrow.className = arrowClass;
    rightArrow.href = lastLink;
    var rightArrowI = document.createElement("i");
    rightArrowI.className = rightArrowIClass;
    rightArrow.append(rightArrowI);

    if (leftSingleArrow.href.length === 0) {
        leftArrow.style.color = window.getComputedStyle(document.body).color;
        leftArrowI.style.color = leftArrow.style.color;
    }
    else if (rightSingleArrow.href.length === 0) {
        rightArrow.style.color = window.getComputedStyle(document.body).color;
        rightArrowI.style.color = rightArrow.style.color;
    }

    group.prepend(leftArrow);
    group.append(rightArrow);
}


async function observe() {
    const targetNode = document.querySelector("#ajaxloading");
    const config = { attributes: true, childList: true, subtree: true };
    const callback = async (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (targetNode.style.display === "none") {
                func();
                break;
            }
        }
    };
    const observer = new MutationObserver(callback);
    if (targetNode) {
        observer.observe(targetNode, config);
    }
    //observer.disconnect();
}
