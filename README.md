Srcset Polyfill
===============

An image srcset polyfill that provides fallback behaviour for browsers that do not support the srcset attribute.

Supports the current syntax as defined below.   

http://www.whatwg.org/specs/web-apps/current-work/multipage/embedded-content-1.html#attr-img-srcset

http://lists.whatwg.org/pipermail/whatwg-whatwg.org/2012-May/035746.html

Markup
======

``` html
<img src="mobile.jpg" 
     srcset="mobile.jpg 480w, mobile-hd.jpg 480w 2x, tablet.jpg 768w, desktop.jpg 979w" alt="srcset example" />
```

Support
==========
Browser support is IE8+ and all other modern browsers.

Licence
==========
Licenced under the [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) licence.