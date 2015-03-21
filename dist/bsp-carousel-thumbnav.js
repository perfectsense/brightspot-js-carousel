(function(globals, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery', 'bsp-carousel' ], factory);
    } else {
        globals.bsp_carousel_thumbnav = factory(globals.jQuery, globals.bsp_carousel);
    }

})(this, function($, bsp_carousel, globals) {
    return {
    	defaults: {
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
		init: function($el, options) {
			var self = $.extend(true, {}, this);
			self.$nav = $el.find('.bsp-carousel-nav');
            self.$stage = $el.find('.bsp-carousel-stage');
            self.options = $.extend({}, self.defaults, options);
            self.setInstanceId();
            self.buildCarousels();
            self.addEvents();
            return self;
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

});