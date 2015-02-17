(function(globals, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery','bsp-utils','slick'], factory);

    } else {
        factory(globals.jQuery, globals.bsp_utils, globals.jQuery.fn.slick, globals);
    }

})(this, function($, bsp_utils, slick, globals) {

	var module = {
		init: function($el, options) {
			this.$el = $el;
			this.options = options;
			$el.slick(options);
		}
	};

	var thePlugin = {
		// we could override slick defaults here
        '_defaultOptions': {
            
        },
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(module);
            moduleInstance.init($(item), options);
        }
    };

    return bsp_utils.plugin(false, 'bsp', 'carousel', thePlugin);

});