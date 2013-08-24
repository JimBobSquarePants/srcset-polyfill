/*!
 * An image srcset polyfill that provides fallback behaviour for browsers
 * that do not support the srcset attribute.
 *
 * Copyright 2013 James South
 *
 * Twitter: http://twitter.com/james_m_south
 * Github: https://github.com/JimBobSquarePants/srcset-polyfill
 *
 * Supports the current syntax as defined below.   
 *
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/embedded-content-1.html#attr-img-srcset
 * http://lists.whatwg.org/pipermail/whatwg-whatwg.org/2012-May/035746.html
 */

(function (w, d) {

    "use strict";

    // A little feature detection first
    var srcsetSupported = "srcset" in document.createElement("img");

    if (srcsetSupported) {
        // No need to process anything further.
        return;
    }

    // Used for housing viewport information.
    var Viewport = function () {
        /// <summary>Provides the height, width, and pixel ratio of the current viewport.</summary>

        this.width = w.innerWidth || d.documentElement.clientWidth;
        this.height = w.innerHeight || d.documentElement.clientHeight;

        // Detect retina display
        // http: //www.quirksmode.org/blog/archives/2012/06/devicepixelrati.html
        // http://stackoverflow.com/questions/16383503/window-devicepixelratio-does-not-work-in-ie-10-mobile
        this.pixelRatio = (w.devicePixelRatio || Math.round(w.screen.availWidth / this.width) || 1.0);
    };

    var SrcSet = function (viewport) {
        /// <summary>
        /// Provides methods to parse an image srcset attribute to return the correct
        /// src for the given viewport.
        /// </summary>
        /// <param name="viewport" type="Viewport">
        /// The object containing information about the current viewpoint.
        /// </param>
        this.viewport = viewport;
        this.maxWidth = Infinity;
        this.maxHeight = Infinity;
        this.maxPixelRatio = 1.0;
        this.candidates = [];
    };

    SrcSet.prototype = {
        constructor: SrcSet,
        parseImage: function (img) {
            /// <summary>Parses the image to produce a list of source candidates.</summary>
            /// <param name="img" type="HTML">The element to prduce the list of source candidates for.</param>
            /// <returns type="SrcSet">The object for chaining.</returns>

            // Regexes for matching queries.
            var rSrc = /[^\s]+/,
                rHeight = /(\d+)h/,
                rWidth = /(\d+)w/,
                rRatio = /(\d+((\.\d+)?))x/;

            // Parse the srcset from the image element.
            var srcset = img.getAttribute("srcset"),
                candidates = this.candidates;

            if (srcset) {

                var i,
                    sources = srcset.split(","),
                    length = sources.length;

                // Loop through the srcset attributes and build a candidate.
                for (i = 0; i < length; i += 1) {

                    var src = sources[i].match(rSrc)[0],
                        height = rHeight.test(sources[i]) ? parseInt(sources[i].match(rHeight)[1], 10) : Infinity,
                        width = rWidth.test(sources[i]) ? parseInt(sources[i].match(rWidth)[1], 10) : Infinity,
                        pixelRatio = rRatio.test(sources[i]) ? parseFloat(sources[i].match(rRatio)[1]) : 1.0;

                    candidates.push({ src: src, height: height, width: width, pixelRatio: pixelRatio });
                }
            }

            // Return for chaining.
            return this;
        },
        getBestCandidate: function () {
            /// <summary>
            /// Get the best src candidate as per the steps outlined here.
            /// http://www.whatwg.org/specs/web-apps/current-work/multipage/embedded-content-1.html#processing-the-image-candidates
            /// </summary>

            var images = this.candidates,
                width = this.viewport.width,
                height = this.viewport.height,
                pixelRatio = this.viewport.pixelRatio,
                getBestCandidate = function (criteria) {
                    var i,
                        length = images.length,
                        best = images[0];

                    // Loop through and replace the best candidate who matches
                    // the given criteria.
                    for (i = 0; i < length; i += 1) {

                        if (criteria(images[i], best)) {

                            best = images[i];
                        }
                    }

                    return best;
                },
                removeCandidate = function (criteria) {

                    var i,
                        length = images.length;

                    // Loop through and remove any candidates who match the given criteria.
                    // Loop in reverse.
                    for (i = length - 1; i >= 0; i -= 1) {

                        if (criteria(images[i])) {

                            images.splice(i, 1);
                        }
                    }
                };

            // If there are any entries in candidates that have an associated width that is less than max width, 
            // then remove them, unless that would remove all the entries, in which case remove only the entries 
            // whose associated width is less than the greatest such width.
            var largestWidth = getBestCandidate(function (a, b) { return a.width > b.width; });
            removeCandidate(function (a) { return a.width < width; });

            // If no candidates are left, keep the one with largest width.
            if (images.length === 0) {
                images = [largestWidth];
            }

            // If there are any entries in candidates that have an associated height that is less than max height, 
            // then remove them, unless that would remove all the entries, in which case remove only the entries 
            // whose associated height is less than the greatest such height.
            var largestHeight = getBestCandidate(function (a, b) { return a.height > b.height; });
            removeCandidate(function (a) { return a.height < height; });

            // If no candidates are left, keep the one with largest height.
            if (images.length === 0) {
                images = [largestHeight];
            }

            // If there are any entries in candidates that have an associated pixel density that is less than a user-agent-defined
            // value giving the nominal pixel density of the display, then remove them, unless that would remove all the entries, 
            // in which case remove only the entries whose associated pixel density is less than the greatest such pixel density.
            var largestPixelRatio = getBestCandidate(function (a, b) { return a.pixelRatio > b.pixelRatio; });
            removeCandidate(function (a) { return a.pixelRatio < pixelRatio; });

            // If no candidates are left, keep the one with largest pixel ratio.
            if (images.length === 0) {
                images = [largestPixelRatio];
            }

            // Remove all the entries in candidates that have an associated width 
            // that is greater than the smallest such width.
            var smallestWidth = getBestCandidate(function (a, b) { return a.width < b.width; });
            removeCandidate(function (a) { return a.width > smallestWidth.width; });

            // Remove all the entries in candidates that have an associated height
            // that is greater than the smallest such height.
            var smallestHeight = getBestCandidate(function (a, b) { return a.height < b.height; });
            removeCandidate(function (a) { return a.height > smallestHeight.height; });

            // Remove all the entries in candidates that have an associated pixel density 
            // that is greater than the smallest such pixel density.
            var smallestPixelRatio = getBestCandidate(function (a, b) { return a.pixelRatio < b.pixelRatio; });
            removeCandidate(function (a) { return a.pixelRatio > smallestPixelRatio.pixelRatio; });

            // Return the best image.
            return images[0];
        }
    };

    var setSources = function () {
        /// <summary>Loops through the images in the current page and sets the correct source.</summary>

        // Get the current viewport information.
        var viewport = new Viewport();

        // Fetch all images on the page.
        var i,
            images = document.querySelectorAll("img"),
            length = images.length;

        // Loop through, calculate and set the correct source.
        for (i = 0; i < length; i += 1) {

            var srcSet = new SrcSet(viewport),
                image = images[i],
                candidate = srcSet.parseImage(image).getBestCandidate();

            if (candidate) {

                image.src = candidate.src;
            }
        }
    };

    // Run on resize and domready (w.load as a fallback)
    if (w.addEventListener) {

        w.addEventListener("resize", setSources, false);

        w.addEventListener("DOMContentLoaded", function () {

            setSources();

            // Run once only
            w.removeEventListener("load", setSources, false);
        }, false);

        w.addEventListener("load", setSources, false);

    } else if (w.attachEvent) {

        // Only attach onload as IE8 isn't responsive aware anyway.
        w.attachEvent("onload", setSources);
    }

}(window, document));