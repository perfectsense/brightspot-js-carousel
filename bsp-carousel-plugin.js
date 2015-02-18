(function(globals, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery','bsp-utils','bsp-carousel-util'], factory);

    } else {
        factory(globals.jQuery, globals.bsp_utils, globals.bsp_carousel_util, globals);
    }

})(this, function($, bsp_utils, bsp_carousel_util, globals) {

	var module = {
		init: function($el, options) {
			bsp_carousel_util.init($el, options);
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