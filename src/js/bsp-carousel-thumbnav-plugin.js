import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_carousel_thumbnav from 'bsp-carousel-thumbnav';

export default bsp_utils.plugin(false, 'bsp', 'carousel-thumbnav', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_carousel_thumbnav);
        moduleInstance.init($(item), options);
    }
});