var documentBackgroundColor = this.getComputedStyle(document.body).backgroundColor;

chrome.runtime.sendMessage({
    type: "injectCSS",
    css: `
    
    #entriesheadingcontainer {
        background-color: ${documentBackgroundColor};
        box-shadow: 0 -10px 0 ${documentBackgroundColor}, 0 2px 2px ${documentBackgroundColor};
    }

    #frame_notificationsheading {
        background: border-box ${documentBackgroundColor} !important;
        box-shadow: 0 3px 2px 0 ${documentBackgroundColor};
    }

    .inpagechatframe,
    .inpagechattoggle {
        border-color: ${documentBackgroundColor} !important;
    }

    .profile-badge > img,
    .profile-picture > img,
    .profile-badge-actions > .actionbutton,
    .profile-photo-actions > .actionbutton {
        box-shadow: 0 0 0 4px ${documentBackgroundColor} !important;
    }
    `
});
