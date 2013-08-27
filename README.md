Srcset Polyfill
===============

An image `srcset` polyfill that provides fallback behaviour for browsers that do not support the srcset attribute.

Supports the current syntax as defined below.   

http://www.whatwg.org/specs/web-apps/current-work/multipage/embedded-content-1.html#attr-img-srcset

http://lists.whatwg.org/pipermail/whatwg-whatwg.org/2012-May/035746.html

Usage
=====

Just reference the script from your webpage and the script will automatically do th rest.

Markup
======

``` html
<img src="mobile.jpg" 
     srcset="mobile.jpg 480w, mobile-hd.jpg 480w 2x, tablet.jpg 768w, desktop.jpg 979w" 
     alt="srcset example" />
```

Support
==========
Browser support is IE8+ and all other modern browsers.

Caveats
==========
Using the polyfill will result in 2 requests per element if the image is to be changed. A possible workaround would be to use a base 64 encoded image as the default src. This however, will not gracefully fallback for browsers where JavaScript is turned off. It may also be an issue for SEO but this is unkown at this time.

``` html
<!--
26byte gif with no color palette.
http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever
-->
<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
     alt="no color palette 1x1 gif" />
```

This image could be hidden easily enough using CSS.

``` css
img[src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="] {
    visibility: hidden;
}
```

Using `about:blank` or an empty src `src=""` is invalid as they both violate section 4.8.1 of the HTML5 specification:

> The src attribute must be present, and must contain a valid non-empty URL potentially surrounded by spaces referencing a non-interactive, optionally animated, image resource that is neither paged nor scripted.

Discussion regarding this problem is encouraged.

Licence
==========
Licenced under the [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) licence.
