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
            if (options.nav != 'disable' && options.stage != 'disable') {
                options.nav.themeConfig.asNavFor = '.' + stageClass;
            }
            if (options.stage != 'disable') {
                bsp_carousel.init($stage, options.stage);
            }
            if (options.nav != 'disable') {
                bsp_carousel.init($nav, options.nav);
            }
		}
	};

	var thePlugin = {
        '_defaultOptions': {
            nav: {
                themeConfig: {
                    centerMode: true,
                    focusOnSelect: true,
                    slidesToShow: 3,
                    slidesToScroll: 1
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

    return bsp_utils.plugin(false, 'bsp', 'carousel-thumbnav', thePlugin);

});