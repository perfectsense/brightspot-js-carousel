import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import { bsp_carousel } from 'bsp-carousel';

export default bsp_utils.plugin(false, 'bsp', 'carousel', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_carousel);
        moduleInstance.init($(item), options);
    }
});