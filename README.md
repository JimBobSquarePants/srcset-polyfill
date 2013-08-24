Srcset Polyfill
===============

An image srcset polyfill that provides fallback behaviour for browsers that do not support the srcset attribute.

Supports the current syntax as defined below.   

http://www.whatwg.org/specs/web-apps/current-work/multipage/embedded-content-1.html#attr-img-srcset

http://lists.whatwg.org/pipermail/whatwg-whatwg.org/2012-May/035746.html

Markup
======

``` html
    <img src="assets/image-480px.jpg" srcset="assets/image-480px.jpg 480w, assets/image-480px-2x.jpg 480w 2x, assets/image-768px.jpg 768w, assets/image-979px.jpg 979w" alt="srcset example" />
```

Support
==========
Browser support is IE8+ and all other modern browsers.