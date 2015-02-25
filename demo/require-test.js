require.config({
	paths: {
		'bsp-carousel': '../dist/bsp-carousel',
		'bsp-carousel-plugin': '../dist/bsp-carousel-plugin',
		'bsp-utils': '../bower_components/bsp-utils/bsp-utils',
		'jquery': '../bower_components/jquery/dist/jquery'
	}
});

require(['jquery', 'bsp-carousel', 'bsp-carousel-plugin'], function($, carousel) {
	$(function() {
		carousel.init($('#demo2'), { themeConfig: { infinite: false } });
	});
});