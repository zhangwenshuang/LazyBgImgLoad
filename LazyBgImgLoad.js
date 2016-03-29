/* LazyBgImgLoad.js (c) 张文双
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * expects a list of:  
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">`
 */

! function(window) {
    var $q = function(q, res) {
            if (document.querySelectorAll) {
                res = document.querySelectorAll(q);
            } else {
                var d = document,
                    a = d.styleSheets[0] || d.createStyleSheet();
                a.addRule(q, 'f:b');
                for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++)
                    l[b].currentStyle.f && c.push(l[b]);

                a.removeRule(0);
                res = c;
            }
            return res;
        },
        addEventListener = function(evt, fn) {
            window.addEventListener ? this.addEventListener(evt, fn, false) : (window.attachEvent) ? this.attachEvent('on' + evt, fn) : this['on' + evt] = fn;
        },
        _has = function(obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        };

    /**
     *   图片懒加载
     */
    function loadImage(el, fn) {
        var img = new Image(),
            src = el.getAttribute('data-src');
        img.onload = function() {
            if (!!el.parent)
                el.parent.replaceChild(img, el)
            else
                el.src = src;

            fn ? fn() : null;
        }
        img.src = src;
    }

    /**
     *   背景图片懒加载
     */
    function loadBgImage(el, fn) {
        var src = el.getAttribute('data-src');
        el.style.backgroundImage = "url('" + src + "')";
    }

    /**
     *   判断是否在可视区域
     */
    function elementInViewport(el) {
        var rect = el.getBoundingClientRect()
        return (
            rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        )
    }

    /**
     *   对外接口
     */
    function LazyBgImgLoad(params) {
        params = params || {};
        this.params = params;
        var eles = params.eles || "img.lazy",
            eleType = params.type || "img"
        var els = [],
            query = $q(eles),
            processScroll = function() {
                // 图片滚动事件
                for (var i = 0; i < els.length; i++) {
                    if (elementInViewport(els[i])) {
                        loadImage(els[i], function() {
                            els.splice(i, i);
                        });
                    }
                };
            },
            processBgScroll = function() {
                // 非图片滚动事件
                for (var i = 0; i < els.length; i++) {
                    if (elementInViewport(els[i])) {
                        loadBgImage(els[i], function() {
                            els.splice(i, i);
                        });
                    }
                };
            };

        // Array.prototype.slice.call is not callable under our lovely IE8 
        for (var i = 0; i < query.length; i++) {
            els.push(query[i]);
        };
        if (eleType === "img") {
            processScroll();
            addEventListener('scroll', processScroll);
        } else {
            processBgScroll();
            addEventListener('scroll', processBgScroll);
        }
    }
    LazyBgImgLoad.prototype = {
        refresh: function() {
            var params = this.params,
                eles = params.eles || "img.lazy",
                eleType = params.type || "img"
            var els = [],
                query = $q(eles),
                processScroll = function() {
                    // 图片滚动事件
                    for (var i = 0; i < els.length; i++) {
                        if (elementInViewport(els[i])) {
                            loadImage(els[i], function() {
                                els.splice(i, i);
                            });
                        }
                    };
                },
                processBgScroll = function() {
                    // 非图片滚动事件
                    for (var i = 0; i < els.length; i++) {
                        if (elementInViewport(els[i])) {
                            loadBgImage(els[i], function() {
                                els.splice(i, i);
                            });
                        }
                    };
                };

            // Array.prototype.slice.call is not callable under our lovely IE8 
            for (var i = 0; i < query.length; i++) {
                els.push(query[i]);
            };
            
            if (eleType === "img") {
                processScroll();
                addEventListener('scroll', processScroll);
            } else {
                processBgScroll();
                addEventListener('scroll', processBgScroll);
            }
        }
    };
    window.LazyBgImgLoad = LazyBgImgLoad;
}(this);
