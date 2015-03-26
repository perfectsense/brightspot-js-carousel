(function(globals, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery', 'slick' ], factory);
    } else {
        globals.bsp_carousel = factory(globals.jQuery, globals.jQuery.fn.slick);
    }

})(this, function($) {
	var bsp_carousel = {};

	(function() {
		bsp_carousel.themes = {
			'carousel-dots': {
				dots: true
			},
			'carousel-horizontal-thumbnails': {
				lazyLoad: 'progressive',
				slidesToShow: 4,
				slidesToScroll: 4
			}
		};

		bsp_carousel.init = function($el, options) {
			var self = Object.create(this);
			self.$el = $el;

			/** @deprecated don't pass onLoad, just bind to carousel:init event */
			if (typeof options == 'object' && typeof options.onLoad == 'function') {
				self.bind('carousel:init', options.onLoad);
			}

			self.addClasses(options);
			self.addEvents();
			options = self.mergeOptions(options);
			$el.slick(options);
			$el.data('bsp_carousel', self);
			return self;
		};

		bsp_carousel.mergeOptions = function(options) {
			var merged = {};
			if (typeof options != 'object') {
				options = merged;
			}
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
			return this._slickMethod('slickCurrentSlide');
		};
		bsp_carousel.goTo = function(i) {
			this._slickMethod('slickGoTo', i);
		};
		bsp_carousel.next = function() {
			this._slickMethod('slickNext');
		};
		bsp_carousel.prev = function() {
			this._slickMethod('slickPrev');
		};
		bsp_carousel.pause = function() {
			this._slickMethod('slickPause');
		};
		bsp_carousel.play = function() {
			this._slickMethod('slickPlay');
		};
		bsp_carousel.add = function(ele, index, addBefore) {
			this._slickMethod('slickAdd', ele, index, addBefore);
		};
		bsp_carousel.remove = function(index, removeBefore) {
			this._slickMethod('slickRemove', index, removeBefore);
		};
		bsp_carousel.filter = function(selectorOrFunction) {
			this._slickMethod('slickFilter', selectorOrFunction);
		};
		bsp_carousel.unfilter = function(i) {
			this._slickMethod('slickUnfilter', i);
		};
		bsp_carousel.getOption = function(option) {
			return this._slickMethod('slickGetOption', option);
		};
		bsp_carousel.setOption = function(option, value) {
			this._slickMethod('slickSetOption', option, value);
		};
		bsp_carousel.destroy = function() {
			this._slickMethod('unslick');
		};

		/** extra helper methods */
        bsp_carousel.slideCount = function() {
            return this._slickMethod('getSlick').slideCount;
        };

        /** private methods */

        /**
         * slick methods are not available yet during events called on page load,
         * so created this abstraction to fail gracefully for now
         */
        bsp_carousel._slickMethod = function() {
            if (this._slickMethodsAvailable()) {
                return this.$el.slick.apply(this.$el, arguments);
            } else {
                if (arguments[0] == 'getSlick') {
                    return {
                        slideCount: 0
                    };
                }
            }
        };
        bsp_carousel._slickMethodsAvailable = function() {
            if (this._slickMethodsFound) {
                return true;
            } else {
                try {
                    this.$el.slick('getSlick');
                    this._slickMethodsFound = true;
                    return true;
                } catch(e) {}
            }
        };
	})();

	return bsp_carousel;
});