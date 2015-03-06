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
			this.$nav = $el.find('.bsp-carousel-nav');
            this.$stage = $el.find('.bsp-carousel-stage');
            this.options = options;
            this.setInstanceId();
            this.buildCarousels();
            this.addEvents();
		},
        setInstanceId: function() {
            this.instanceId = (new Date()).getTime() + '-' + Math.ceil(Math.random()*100000);
        },
        buildCarousels: function() {
            var navClass;
            var stageClass;
            if (this.options.nav != 'disable' && this.options.stage != 'disable') {
                navClass = 'bsp-carousel-nav-' + this.instanceId;
                stageClass = 'bsp-carousel-stage-' + this.instanceId;
                this.$nav.addClass(navClass);
                this.$stage.addClass(stageClass);
                this.options.nav.themeConfig.asNavFor = '.' + stageClass;
                this.options.stage.themeConfig.asNavFor = '.' + navClass;
            }
            if (this.options.stage != 'disable') {
                this.stage = bsp_carousel.init(this.$stage, this.options.stage);
            }
            if (this.options.nav != 'disable') {
                this.nav = bsp_carousel.init(this.$nav, this.options.nav);
            }
            if (this.options.nav != 'disable' && this.options.stage != 'disable') {
                this.setCurrentThumbnail();
            }
        },
        addEvents: function() {
            var self = this;
            self.stage.bind('carousel:afterChange', function() {
                self.setCurrentThumbnail();
            });
        },
        setCurrentThumbnail: function() {
            var $navSlides = this.$nav.find('.slick-slide');
            var index = this.$stage.find('.slick-active').data('slick-index');
            $navSlides.removeClass('current');
            $navSlides.each(function(key, slide) {
                if ($(slide).data('slick-index') == index) {
                    $(slide).addClass('current');
                }
            });
        }
	};

	var thePlugin = {
        '_defaultOptions': {
            nav: {
                themeConfig: {
                    centerMode: true,
                    centerPadding: '0px',
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