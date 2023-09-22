chrome.runtime.sendMessage({
  type: "injectCSS",
  CSS: `
      /* Tanim */
      .entrytext > .img > img {
        border-radius: 8px !important;
      }

      
      /* Baslik */
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
			#container-list-header-buttons > * {
        margin-bottom: 0px !important;
      }
      #entry-heading-category > * {
        padding:0px !important;
      }
      #container-list-header-buttons {
        border-bottom:none !important;
      }

      /* Baslik - Sayfa Değiştirici */
      .clearfix.my-2:has(.dropdown-pagination) {
        display: none !important;
      }
			.dropdown-item > .fa {
				display: inline-flex !important;
				min-width: 20px !important;
				justify-content: center !important;
        align-items: center !important;
			}
      .dropdown-menu-pagination {
				max-height: 80vh!important;
			}


      // Genel Header
      #topbarmenu {
        box-shadow:none !important;
      }
      #button_searchtitle {
				width: 42px !important;
			}
			#titleAdvancedSearch {
				width: 32px !important;
			}

      /* Genel Header - Duser Menuler */
			.right-drop-menu {
				box-shadow: 0 0 8px 0 #00000022 !important;
				transition: box-shadow 2s ease-out;
			}
      #frame_cockpit > .dropdown-item > .fa {
        background-color: #77777744;
        border-radius: 50%;
        height: 24px;
        width: 24px;
        margin-right: 4px !important;
      }
      .dropdown-pagination > .btn-group > .btn-sm {
				display: flex;
				align-items: center !important;
				justify-content: center !important;
			}
			.dropdown-pagination > .btn-group > .btn-sm > .fa {
				width: 8px !important;
			}

      /* Genel Header - Bildirimler Paneli */
      #frame_notifications {
        max-height: 560px !important;
      }
      #frame_notificationsheading {
        position: sticky;
        padding-top: 8px !important;
        top: 0;
        background: border-box ${window.getComputedStyle(document.body).backgroundColor} !important;
        z-index: 1;
        box-shadow: 0 3px 2px 0 ${window.getComputedStyle(document.body).backgroundColor};
      }

      /* Genel Header - Sag Tuslar */
      #topnav-right {
        display: flex !important;
        gap: 8px;
        padding-bottom: 4px !important;
      }
      #topnav-right > .nav-link {
        background-color: #77777722;
        border-radius: 4px;
        padding: 2px 12px !important;
        margin: 2px 0 !important;
        line-height: 2;
        transition: background-color 150ms ease-out, box-shadow 300ms linear, color 150ms ease-out;
        user-select: none;
      }
      #topnav-right > .nav-link:hover {
        background-color: #77777744;
        box-shadow: 0 0 1px 2px #00000011 !important;
        transition: background-color 150ms ease-out, box-shadow 300ms linear, color 150ms ease-out;
      }
      #topnav-right > .nav-link:active {
        background-color: #77777733;
        box-shadow: 0 0 1px 1px #00000022 !important;
        transition: background-color 50ms ease-out, box-shadow 50ms linear;
      }
      #topnav-right > .nav-link > .fa {
        margin-right: 4px;
      }


      /* Sayfa Ici Sohbet */
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
			.chatmessages {
				padding: 0 8px;
			}
			.messageseendate {
				top: 6px !important;
			}
      #chatpreviewcontainer {
        padding: 4px 4px 0 4px !important;
      }
    

      /* Footer */
      #footer > .clearfix {
        display: none;
      }
      #footer {
        background-color:#00000000!important;
      }


      /* Sol Cerceve */
      #leftframe > div:nth-child(4) > div.list-group > div.list-group-item.list-group-item-action.p-0.active {
        border-radius: 4px !important;
        background-color: #c14114aa !important;
        box-shadow: inset 0 0 0 1px #f95318 !important;
      }


      /* Profil */
      .profile-picture > img {
				object-fit: cover;
				width: 100px !important;
        box-shadow: 0 0 0 4px ${window.getComputedStyle(document.body).backgroundColor} !important;
			}
      .profile-badge > img {
				object-fit: cover;
				width: 100px !important;
        box-shadow: 0 0 0 4px ${window.getComputedStyle(document.body).backgroundColor} !important;
			}
      .cover-photo {
        border-radius: 16px;
      }
      .profile-badge-actions > .actionbutton {
        height: 32px !important;
        width: 32px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 4px ${window.getComputedStyle(document.body).backgroundColor} !important;
        background-color: #c8c8c8 !important;
      }
      .profile-photo-actions > .actionbutton {
        height: 32px !important;
        width: 32px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 4px ${window.getComputedStyle(document.body).backgroundColor} !important;
        background-color: #c8c8c8 !important;
      }
      .status-note {
        padding: 4px !important;
        background: 
      }
      .profile-actions {
        max-width: 768px;
        margin: auto;
      }


      /* Icerikli Baslik */
      .title-meta-container > .main-image > a > img {
        max-height: 256px !important;
        max-width: 162px !important;
        object-fit: cover !important;
        border-radius: 16px !important;
      }
      .title-meta-container > .main-image {
        width: auto !important;
      }
      .title-meta-container > .info {
        margin-left: 16px !important;
      }
      .info > .title-name {
        max-width: 40% !important;
      }
      .info > .tags {
        max-width: 40% !important;
      }

      /* Icerikli Baslik: Icerik Alani */
      header > .clear {
        padding-top: 8px !important;
      }
      #entriesheadingcontainer > .title-tabs {
        display: flex !important;
        flex-direction: column !important;
        position: absolute !important;
        width: 50% !important;
        max-height: 250px !important;
        height: 250px !important; 
        right: 0 !important;
        top: 16px !important;
        overflow: visible !important;
      }
      .tab-content > .tab-pane > .entry {
        max-height: 180px !important;
        overflow: none !important;
        display: inline-block !important;
        flex-direction: column !important;
        overflow-y: scroll !important;
      }
			`,
});



function func() {
  // şu anki sayfanın başlık olup olmadığını denetle
  if (window.location.href.indexOf("normalsozluk.com/b/") != -1) {
    document.getElementsByName("q")[0].placeholder = "başlıkta ara"; // başlık içi arama yer tutucu yazılarını değiştir

    // tuşlar alanındaki boşlukları kaldır
    document
      .getElementById("container-list-header-buttons").classList.remove("clearfix");
    document
      .getElementById("container-search-in-title").firstElementChild.classList.remove("form-inline");

    // "sayfa sonu" tuşundaki metni kaldır
	if (document.getElementsByClassName("entryscrollbottom")[0].children[1] !== undefined) {
    document.getElementsByClassName("entryscrollbottom")[0].removeChild(document.getElementsByClassName("entryscrollbottom")[0].children[1]);
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
    }
  }

  if (window.location.href.indexOf("normalsozluk.com/yazar/") != -1) {
  document.querySelector("#centerframe > div > hr").remove();
  document.querySelector("#centerframe > div > hr").remove();
  }

  document.title = document.title.toLowerCase(); //belge başlığını küçült
  document.getElementById("titlesearch").placeholder = "sözlükte ara"; //genel arama yer tutucu yazını değiştir
}

async function observe() {
  const targetNode = document.querySelector("#ajaxloading");
  const config = { attributes: true, childList: false, subtree: false };
  const callback = async (mutationList, observer) => {
    if (targetNode.style.display === "none") {
      func();
    }
  };
  const observer = new MutationObserver(callback);
  if (targetNode) {
    observer.observe(targetNode, config);
  }
  //observer.disconnect();
}

func();
observe();