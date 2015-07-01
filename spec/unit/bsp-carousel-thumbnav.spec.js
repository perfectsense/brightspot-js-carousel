import $ from 'jquery';
import bsp_carousel_thumbnav from '../../src/js/bsp-carousel-thumbnav';

describe('bsp-carousel-thumbnav utility', () => {
	
	var defaults = {
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
    };

    /** @todo should probably have class names be configurable option */
    var classNav = 'bsp-carousel-nav';
    var classStage = 'bsp-carousel-stage';
    var selectorNav = '.' + classNav;
    var selectorStage = '.' + classStage;

    var fixture = 
    	`<div>
    		<div class="${classStage}"></div>
    		<div class="${classNav}"></div>
    	</div>`;

    describe('config specs', () => {
    	it('should have expected defaults', () => {
    		expect(bsp_carousel_thumbnav.defaults).toEqual(defaults);
    	});
    });

    describe('init specs', () => {
    	var $el;
    	var $nav;
    	var $stage;
    	var carousel;

    	beforeEach(() => {
    		$el = $(fixture);
    		$nav = $el.find(selectorNav);
    		$stage = $el.find(selectorStage);
    		carousel = Object.create(bsp_carousel_thumbnav);
    	});

    	it('should save $nav and $stage to the object', () => {
    		carousel.init($el);
    		expect(carousel.$nav).toEqual($nav);
    		expect(carousel.$stage).toEqual($stage);
    	});

    	it('should set options to defaults if no options object passed', () => {
    		/** buildCarousels adds other options, so skip these for this test */
    		spyOn(carousel, 'buildCarousels');
    		spyOn(carousel, 'addEvents');
    		
    		carousel.init($el);
    		expect(carousel.options).toEqual(defaults);
    	});

    	it('should extend options with overrides if options object passed', () => {    		
    		carousel.init($el, {
    			stage: {
    				themeConfig: {
    					arrows: true
    				}
    			}
    		});
    		expect(carousel.options.stage.themeConfig.arrows).toBe(true);
    	});

    	it('should call expected methods', () => {
    		spyOn(carousel, 'buildCarousels');
    		spyOn(carousel, 'addEvents');
    		spyOn(carousel, 'setInstanceId');
    		carousel.init($el);
    		expect(carousel.addEvents).toHaveBeenCalled();
    		expect(carousel.buildCarousels).toHaveBeenCalled();
    		expect(carousel.setInstanceId).toHaveBeenCalled();
    	});
    });

	describe('setInstanceId specs', () => {
		var carousel;

		beforeEach(() => {
			carousel = Object.create(bsp_carousel_thumbnav);
		});

		it('should set instance id to the expected value', () => {
			spyOn(window, 'Date').and.returnValue({
				getTime: () => { return 1; }
			});
			spyOn(Math, 'random').and.returnValue(0.111111);
			carousel.setInstanceId();
			expect(carousel.instanceId).toBe('1-11112');
		});
	});
});

