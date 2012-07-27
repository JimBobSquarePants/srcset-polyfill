/*!
 *  A jQuery based image srcset polyfill that provides fallback behaviour for browsers
 *  that do not support the srcset attribute.
 *
 * Copyright 2012 James South
 *
 * Twitter: http://twitter.com/james_m_south
 * Github: https://github.com/JimBobSquarePants/srcset-polyfill
 *
 * Supports the current syntax as defined below.   
 *
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/embedded-content-1.html#attr-img-srcset
 * http://lists.whatwg.org/pipermail/whatwg-whatwg.org/2012-May/035746.html
 */

(function ($) {

    "use strict";

    // A little feature detection first
    var srcsetSupported = "srcset" in document.createElement("img");

    if (!srcsetSupported) {

        // Regexes for matching queries.
        var rSrc = /[^\s]+/,
            rHeight = /(\d+)h/,
            rWidth = /(\d+)w/,
            rRatio = /(\d+)x/;

        // Detect retina display
        // http: //www.quirksmode.org/blog/archives/2012/06/devicepixelrati.html
        var pixelRatio = (window.devicePixelRatio || 1);

        // Get the window
        var $window = $(window);

        // Cache the images as theres no point querying them twice.
        var imageList = [];

        // http://lodash.com/docs/#debounce
        var debounce = function (func, wait, immediate) {
            var args,
                result,
                thisArg,
                timeoutId;

            function delayed() {
                timeoutId = null;
                if (!immediate) {
                    func.apply(thisArg, args);
                }
            }

            return function () {
                var isImmediate = immediate && !timeoutId;
                    args = arguments;
                    thisArg = this;

                clearTimeout(timeoutId);
                timeoutId = setTimeout(delayed, wait);

                if (isImmediate) {
                    result = func.apply(thisArg, args);
                }
                return result;
            };
        };

        var getImageSrc = function ($image) {

            var i,
                imgWidth = 0,
                imgHeight = 0,
                imgSrc = null,
                imgSrcParts = $image.data("srcset"),
                len = imgSrcParts.length,
                width = $window.width(),
                height = $window.height();

            for (i = 0; i < len; i += 1) {

                // This is just a rough play on the algorithm.
                var newImgSrc = imgSrcParts[i].match(rSrc)[0],
                    newImgHeight = rHeight.test(imgSrcParts[i]) ? parseInt(imgSrcParts[i].match(rHeight)[1], 10) : 1,
                    newImgWidth = rWidth.test(imgSrcParts[i]) ? parseInt(imgSrcParts[i].match(rWidth)[1], 10) : 1,
                    newPixelRatio = rRatio.test(imgSrcParts[i]) ? parseInt(imgSrcParts[i].match(rRatio)[1], 10) : 1;

                if ((newImgWidth > imgWidth && width > newImgWidth && newImgHeight > imgHeight && height > newImgHeight && newPixelRatio === pixelRatio)) {

                    imgWidth = newImgWidth;
                    imgSrc = newImgSrc;
                }
            }

            // Return null  
            return imgSrc;
        };

        var setImageSrc = function (firstRun) {

            var setSrc = function () {

                // Set the data for recall.
                this.data("srcset", this.attr("srcset").split(","));

                var src = getImageSrc(this);

                if (src) {
                    this.attr("src", src);
                }

            };

            // Build the cached list whilst running.
            if (firstRun) {

                $("img[srcset]").each(function () {

                    var $this = $(this);

                    setSrc.call($this);

                    imageList.push($this);

                });

                return;
            }

            // Run from our cached list.
            $.each(imageList, function () {

                var $this = $(this);

                setSrc.call($this);

            });

        };

        // lay implimentation.
        var lazySetImageSrc = debounce(setImageSrc, 100);

        // Debounce run on resize.
        $window.resize(function () {
            lazySetImageSrc();
        });

        // First run on load.
        $window.load(function () {
            setImageSrc(true);
        });
    }

}(jQuery));