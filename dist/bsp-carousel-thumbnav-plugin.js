(function(globals, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery','bsp-utils','bsp-carousel-thumbnav'], factory);

    } else {
        factory(globals.jQuery, globals.bsp_utils, globals.bsp_carousel_thumbnav, globals);
    }

})(this, function($, bsp_utils, bsp_carousel_thumbnav, globals) {

    var module = {
        init: function($el, options) {
            bsp_carousel_thumbnav.init($el, options);
        }
    };

	var thePlugin = {
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(module);
            moduleInstance.init($(item), options);
        }
    };

    return bsp_utils.plugin(false, 'bsp', 'carousel-thumbnav', thePlugin);

});