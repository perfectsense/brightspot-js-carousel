(function(globals, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery','bsp-utils','bsp-carousel'], factory);

    } else {
        factory(globals.jQuery, globals.bsp_utils, globals.bsp_carousel, globals);
    }

})(this, function($, bsp_utils, bsp_carousel, globals) {

	var module = {
		init: function($el, options) {
            var randomId = (new Date()).getTime() + '-' + Math.ceil(Math.random()*100000);
            var stageClass = 'bsp-carousel-stage-' + randomId;
			var $nav = $el.find('.bsp-carousel-nav');
            var $stage = $el.find('.bsp-carousel-stage');
            $stage.addClass(stageClass);
            options.nav.themeConfig.asNavFor = '.' + stageClass;
            bsp_carousel.init($stage, options.stage);
            bsp_carousel.init($nav, options.nav);
		}
	};

	var thePlugin = {
        '_defaultOptions': {
            nav: {
                themeConfig: {
                    focusOnSelect: true,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: bsp_carousel.breakpoints.lg,
                            settings: {
                                slidesToShow: 4
                            }
                        },
                        {
                            breakpoint: bsp_carousel.breakpoints.md,
                            settings: {
                                slidesToShow: 4
                            }
                        },
                        {
                            breakpoint: bsp_carousel.breakpoints.sm,
                            settings: {
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: bsp_carousel.breakpoints.xs,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: bsp_carousel.breakpoints.xxs,
                            settings: {
                                slidesToShow: 2
                            }
                        }
                    ]
                }
            },
            stage: {
                themeConfig: {
                    arrows: false
                }
            }
        },
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(module);
            moduleInstance.init($(item), options);
        }
    };

    return bsp_utils.plugin(false, 'bsp', 'carousel-thumbnav-plugin', thePlugin);

});