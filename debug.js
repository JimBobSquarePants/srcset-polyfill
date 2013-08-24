(function (w, d) {

    // Detect retina display
    // http: //www.quirksmode.org/blog/archives/2012/06/devicepixelrati.html
    // http://stackoverflow.com/questions/16383503/window-devicepixelratio-does-not-work-in-ie-10-mobile
    var pixelRatio = (w.devicePixelRatio || (w.screen.availWidth / (w.innerWidth || d.documentElement.clientWidth)).toFixed(1) || 1.0),
        debug = document.getElementById("debug");

    var getViewPortDetails = function () {

        var width = w.innerWidth || d.documentElement.clientWidth,
            height = w.innerHeight || d.documentElement.clientHeight;

        var markup = "width : " + width + "<br/>" +
                     "height : " + height + "<br/>" +
                     "pixel ratio : " + pixelRatio;

        debug.innerHTML = markup;

    };

    // Run on resize and domready (w.load as a fallback)
    if (w.addEventListener) {

        w.addEventListener("resize", getViewPortDetails, false);

        w.addEventListener("DOMContentLoaded", function () {

            getViewPortDetails();

            // Run once only
            w.removeEventListener("load", getViewPortDetails, false);
        }, false);

        w.addEventListener("load", getViewPortDetails, false);

    } else if (w.attachEvent) {
        // Only attach onload as IE8 isn't responsive aware anyway.
        w.attachEvent("onload", getViewPortDetails);
    }

}(window, document))