chrome.runtime.sendMessage({
  type: "injectCSS",
  CSS: `  .clearfix.my-2:has(.dropdown-pagination) {
                display: none !important;
            }
			.dropdown-item > .fa {
				display: inline-flex; !important;
				min-width: 20px; !important;
				justify-content: center !important;
			}
			.right-drop-menu {
				box-shadow: 0 0 8px 0 #00000022 !important;
				transition: box-shadow: 2s ease-out;
			}
			.inpagechatframe, .inpagechatheader, .inpagechattoggle {
				border-radius: 8px 8px 0 0 !important;
			}
			.inpagechatframe {
				box-shadow: 0 0 8px 0 #00000022 !important;
				border-color: ${window.getComputedStyle(document.body).backgroundColor} !important;
			}
			.inpagechattoggle {
				display: flex;
				height: 32px;
				align-items: center;
				border-color: ${window.getComputedStyle(document.body).backgroundColor} !important;
			}
			.inpagechattogglenickname {
				padding-left: 4px;
			}
			.inpagechatinput {
				margin: 0 4px !important;
				border-radius: 4px !important;
				width: 95% !important;
			}
			.senderimage > a > img {
				width: 32px !important;
				height: 32px !important;
				object-fit: cover;
			}
			.profile-picture > img {
				object-fit: cover;
				width: 100px !important;
			}
			.chatmessages {
				padding: 0 8px;
			}
			.messageseendate {
				top: 6px !important;
			}
			.dropdown-pagination > .btn-group > .btn-sm {
				display: flex;
				align-items: center !important;
				justify-content: center !important;
			}
			.dropdown-pagination > .btn-group > .btn-sm > .fa {
				width: 8px !important;
			}
            #container-list-header-buttons > * {
                margin-bottom: 0px !important;
            }
            #entry-heading-category > * {
                padding:0px !important;
            }
			.dropdown-menu-pagination {
				max-height: 80vh!important;
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
                box-shadow: 0 -10px 0 ${window.getComputedStyle(document.body).backgroundColor}, 0 2px 2px ${window.getComputedStyle(document.body).backgroundColor};
            }
			#entriesheadingcontainer > header {
				margin-bottom: 0!important;
				margin-top: 0!important;
			}
			/* #entriesheadingcontainer > header > h1 {
				margin-bottom: 0!important;
				margin-top: 0!important;
				padding-bottom: 8px;
			} */
			#entriesheadingcontainer > input::placeholder {
				content: "başlıkta ara"!important;
			}
			#button_searchinentries {
				padding: 8px 10px 10px 10px !important;
			}
			#container-list-header-buttons {
				justify-content: space-between !important;
			}
			#container-list-header-buttons > * {
				margin: 0 !important;
			}
			#button_searchtitle {
				width: 42px !important;
			}
			#titleAdvancedSearch {
				width: 32px !important;
			}
			`,
});

func();
observe();

function func() {
  // şu anki sayfanın başlık olup olmadığını denetle
  if (window.location.href.indexOf("normalsozluk.com/b/") != -1) {
    document.getElementsByName("q")[0].placeholder = "başlıkta ara"; // başlık içi arama yer tutucu yazılarını değiştir

    // tuşlar alanındaki boşlukları kaldır
    document
      .getElementById("container-list-header-buttons")
      .classList.remove("clearfix");
    document
      .getElementById("container-search-in-title")
      .firstElementChild.classList.remove("form-inline");

    // "sayfa sonu" tuşundaki metni kaldır
	if (document.getElementsByClassName("entryscrollbottom")[0].children[1] !== undefined) {
    document
      .getElementsByClassName("entryscrollbottom")[0]
      .removeChild(
        document.getElementsByClassName("entryscrollbottom")[0].children[1]
      );
	}
    // başlık kategorisini başlığın altına taşı
    var id = document.querySelector("#entriesheadingcontainer");
    var category = id.querySelector("#entry-heading-category");
    var secondChild = id.children[1];
    id.insertBefore(category, secondChild);

    if (document.getElementsByClassName("dropdown-pagination").length > 1) {
      var group = document.querySelector(
        "#entriesheadingcontainer .dropdown-pagination > .btn-group"
      );

      // ilk/son sayfa tuşlarını ekle
      var leftArrowIClass = "fa fa-angle-double-left";
      var rightArrowIClass = "fa fa-angle-double-right";
      var arrowClass = "btn btn-sm btn-secondary loadcenter";

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
      } else if (rightSingleArrow.href.length === 0) {
        rightArrow.style.color = window.getComputedStyle(document.body).color;
        rightArrowI.style.color = rightArrow.style.color;
      }

      group.prepend(leftArrow);
      group.append(rightArrow);
	  
	  if (group === null) {
		return;
	  }
    }
  }

  document.title = document.title.toLowerCase(); //belge başlığını küçült
  document.getElementById("titlesearch").placeholder = "sözlükte ara"; //genel arama yer tutucu yazını değiştir

  
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
