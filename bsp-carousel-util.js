(function(globals, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery', 'slick' ], factory);

    } else {
        globals.bsp_carousel_util = factory(globals.jQuery, globals.jQuery.fn.slick);
    }

})(this, function($) {
	var bsp_carousel_util = {};

	(function() {
		bsp_carousel_util.init = function($el, options) {
			this.$el = $el;
			this.addEvents();
			$el.slick(options);
			$el.data('bsp_carousel_util', this);
		};

		/** bind events to element */
		bsp_carousel_util.bind = function(event, callback) {
			this.$el.on(event, callback);
		};

		/** trigger events, always pass self as first arg of callback followed by other args */
		bsp_carousel_util.trigger = function() {
			var args = $.makeArray(arguments);
			var event = args.shift();
			args.unshift(event, this);
			this.$el.trigger.apply(this.$el, args);
		};

		/** slick event abstractions */
		bsp_carousel_util.addEvents = function() {
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
		bsp_carousel_util.currentSlide = function() {
			return this.$el.slick('slickCurrentSlide');
		};
		bsp_carousel_util.goTo = function(i) {
			this.$el.slick('slickGoTo', i);
		};
		bsp_carousel_util.next = function() {
			this.$el.slick('slickNext');
		};
		bsp_carousel_util.prev = function() {
			this.$el.slick('slickPrev');
		};
		bsp_carousel_util.pause = function() {
			this.$el.slick('slickPause');
		};
		bsp_carousel_util.play = function() {
			this.$el.slick('slickPlay');
		};
		bsp_carousel_util.add = function(ele, index, addBefore) {
			this.$el.slick('slickAdd', ele, index, addBefore);
		};
		bsp_carousel_util.remove = function(index, removeBefore) {
			this.$el.slick('slickRemove', index, removeBefore);
		};
		bsp_carousel_util.filter = function(selectorOrFunction) {
			this.$el.slick('slickFilter', selectorOrFunction);
		};
		bsp_carousel_util.unfilter = function(i) {
			this.$el.slick('slickUnfilter', i);
		};
		bsp_carousel_util.getOption = function(option) {
			return this.$el.slick('slickGetOption', option);
		};
		bsp_carousel_util.setOption = function(option) {
			this.$el.slick('slickSetOption', option);
		};
		bsp_carousel_util.destroy = function() {
			this.$el.slick('unslick');
		};
	})();

	return bsp_carousel_util;
});