setTimeout(adjustMenuAnims, 2000);

function adjustMenuAnims() {
  $(document).off("mouseup");
  $(document).off("click", ".frame-toggler");
  $(document).on("click", ".frame-toggler", function (e) {
    e.preventDefault();
    var t = $(this).data("target");
    if ("block" !== $(t).css("display")) {
      $(t).slideDown("fast", "easeOutCirc"),
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
      $(t).slideUp("fast", "easeInCirc");
    }
  }),
    $(document).mouseup(function (e) {
      $(".right-drop-menu").each(function () {
        $(this).is(e.target) ||
          0 !== $(this).has(e.target).length ||
          $(this).slideUp("fast", "easeInCirc");
      });
    });
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
