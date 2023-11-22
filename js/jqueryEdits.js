setTimeout(initiateJQueryEdits, 1500);

function initiateJQueryEdits() {
  adjustMenuAnims();
  adjustScrollToBottom();
}

function adjustMenuAnims() {
  $(document).off("mouseup");
  $(document).off("click", ".frame-toggler");
  $(document).on("click", ".frame-toggler", function (e) {
    e.preventDefault();
    var t = $(this).data("target");
    if ("block" !== $(t).css("display")) {
      $(t).css('opacity', 0).slideDown("fast", "easeOutCirc").animate({ opacity: 1 },{ queue: false, duration: 'fast' }),
        "#frame_onlineauthors" === t && notifyOnline(),
        "#frame_notifications" === t &&
          "" === $("#notificationpreviewcontainer").html() &&
          ($("#notificationpreviewcontainer").html(
            '<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'
          ),
          updateNotifications(!0)),
        "#frame_chatpreview" === t &&
          "" === $("#chatpreviewcontainer").html() &&
          ($("#chatpreviewcontainer").html(
            '<div class="text-center my-2"><i class="fa fa-2x fa-spinner fa-spin"></i></div>'
          ),
          updateMessages());
    } else {
      $(t).slideUp("fast", "easeOutCirc").animate({ opacity: 0 },{ queue: false, duration: 'fast' });
    }
  }),
    $(document).mouseup(function (e) {
      $(".right-drop-menu").each(function () {
        $(this).is(e.target) ||
          0 !== $(this).has(e.target).length ||
          $(this).slideUp("fast", "easeOutCirc").animate({ opacity: 0 },{ queue: false, duration: 'fast' });
      });
    });
}

function adjustScrollToBottom() {
  $(document).off("click", ".entryscrollbottom");
  $(document).on("click", ".entryscrollbottom", (function() {
    var e = $("div.entrybar").last()
      , t = e ? e.position().top - 420 : $(document).height();
      $("html, body").animate({
        scrollTop: t
    }, 300)
}
))
}

function waitForVariables() {
  return new Promise((resolve) => {
    if (typeof $ !== "undefined") {
      resolve();
    } else {
      setTimeout(() => waitForVariables(resolve), 100);
    }
  });
}
