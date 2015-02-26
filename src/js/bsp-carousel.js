(function(globals, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery', 'slick' ], factory);
    } else {
        globals.bsp_carousel = factory(globals.jQuery, globals.jQuery.fn.slick);
    }

})(this, function($) {
	var bsp_carousel = {};

	(function() {
		bsp_carousel.breakpoints = {
			lg: 1024,
			md: 900,
			sm: 768,
			xsm: 400,
			xxsm: 320
		};

		bsp_carousel.themes = {
			'carousel-dots': {
				dots: true
			},
			'carousel-horizontal-thumbnails': {
				slidesToShow: 4,
				slidesToScroll: 4,
				responsive: [
					{
						breakpoint: bsp_carousel.breakpoints.lg,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 4
						}
					},
					{
						breakpoint: bsp_carousel.breakpoints.md,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 4
						}
					},
					{
						breakpoint: bsp_carousel.breakpoints.sm,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3
						}
					},
					{
						breakpoint: bsp_carousel.breakpoints.xsm,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: bsp_carousel.breakpoints.xxsm,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					}
				]
			},
			'carousel-horizontal-thumbnail-navigation': {
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
						breakpoint: bsp_carousel.breakpoints.xsm,
						settings: {
							slidesToShow: 2
						}
					},
					{
						breakpoint: bsp_carousel.breakpoints.xxsm,
						settings: {
							slidesToShow: 2
						}
					}
				]
			}
		};

		bsp_carousel.init = function($el, options) {
			this.$el = $el;
			this.addClasses(options);
			this.addEvents();
			options = this.mergeOptions(options);
			$el.slick(options);
			$el.data('bsp_carousel', this);
		};

		bsp_carousel.mergeOptions = function(options) {
			var merged = {};
			if (options.theme) {
				merged = this.themes[options.theme];
			}
			if (options.themeConfig) {
				merged = $.extend({}, merged, options.themeConfig);
			}
			return merged;
		};

		bsp_carousel.addClasses = function(options) {
			this.$el.addClass('bsp-carousel');
			if (typeof options != 'undefined' && options.theme) {
				this.$el.addClass(options.theme);
			}
		};

		/** bind events to element */
		bsp_carousel.bind = function(event, callback) {
			this.$el.on(event, callback);
		};

		/** trigger events, always pass self as first arg of callback followed by other args */
		bsp_carousel.trigger = function() {
			var args = $.makeArray(arguments);
			var event = args.shift();
			args.unshift(event, this);
			this.$el.trigger.apply(this.$el, args);
		};

		/** slick event abstractions */
		bsp_carousel.addEvents = function() {
			var self = this;
			this.bind('afterChange', function(slick, currentSlide) {
				self.trigger('carousel:afterChange', currentSlide);
			});
			this.bind('beforeChange', function(slick, currentSlide, nextSlide) {
				self.trigger('carousel:beforeChange', currentSlide, nextSlide);
			});
			this.bind('edge', function(slick, direction) {
				self.trigger('carousel:edge', direction);
			});
			this.bind('init', function() {
				self.trigger('carousel:init');
			});
			this.bind('reinit', function() {
				self.$el.trigger('carousel:reinit');
			});
			this.bind('setPosition', function() {
				self.$el.trigger('carousel:setPosition');
			});
			this.bind('swipe', function(slick, direction) {
				self.$el.trigger('carousel:swipe', direction);
			});
		};

		/** slick method abstractions */
		bsp_carousel.currentSlide = function() {
			return this.$el.slick('slickCurrentSlide');
		};
		bsp_carousel.goTo = function(i) {
			this.$el.slick('slickGoTo', i);
		};
		bsp_carousel.next = function() {
			this.$el.slick('slickNext');
		};
		bsp_carousel.prev = function() {
			this.$el.slick('slickPrev');
		};
		bsp_carousel.pause = function() {
			this.$el.slick('slickPause');
		};
		bsp_carousel.play = function() {
			this.$el.slick('slickPlay');
		};
		bsp_carousel.add = function(ele, index, addBefore) {
			this.$el.slick('slickAdd', ele, index, addBefore);
		};
		bsp_carousel.remove = function(index, removeBefore) {
			this.$el.slick('slickRemove', index, removeBefore);
		};
		bsp_carousel.filter = function(selectorOrFunction) {
			this.$el.slick('slickFilter', selectorOrFunction);
		};
		bsp_carousel.unfilter = function(i) {
			this.$el.slick('slickUnfilter', i);
		};
		bsp_carousel.getOption = function(option) {
			return this.$el.slick('slickGetOption', option);
		};
		bsp_carousel.setOption = function(option) {
			this.$el.slick('slickSetOption', option);
		};
		bsp_carousel.destroy = function() {
			this.$el.slick('unslick');
		};
	})();

	return bsp_carousel;
});