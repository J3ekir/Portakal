// console.log(Object.keys(window));

// setTimeout(function () {
//     $(document).off("mouseup");

//     $(document).mouseup((function (e) {
//         $(".right-drop-menu").each((function () {
//             $(this).is(e.target) || 0 !== $(this).has(e.target).length || $(this).hide("slide", {
//                 direction: "up"
//             }, 5000);
//         }
//         ));
//     }
//     ));
// }, 1000);


function waitForVariables() {
    return new Promise(resolve => {
        if (typeof $ !== "undefined") {
            resolve();
        } else {
            setTimeout(() => waitForVariables(resolve), 100);
        }
    });
}

waitForVariables().then(function () {
    $(document).off("mouseup");

    $(document).mouseup((function (e) {
        $(".right-drop-menu").each((function () {
            $(this).is(e.target) || 0 !== $(this).has(e.target).length || $(this).hide("slide", {
                direction: "up"
            }, 5000);
        }
        ));
    }
    ));
});
