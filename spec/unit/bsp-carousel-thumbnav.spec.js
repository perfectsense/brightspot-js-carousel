import $ from 'jquery';
import bsp_carousel from '../../src/js/bsp-carousel';
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

    var fixture1 = 
    	`<div>
    		<div class="${classStage}">
    			<div class="slick-slide" data-slick-index="1">stage 1</div>
    			<div class="slick-slide" data-slick-index="2">stage 2</div>
    			<div class="slick-slide" data-slick-index="3">stage 3</div>
    		</div>
    		<div class="${classNav}">
    			<div class="slick-slide" data-slick-index="1">nav 1</div>
    			<div class="slick-slide" data-slick-index="2">nav 2</div>
    			<div class="slick-slide" data-slick-index="3">nav 3</div>
    		</div>
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
    		$el = $(fixture1);
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

	describe('addEvents specs', () => {
		var carousel;

		beforeEach(() => {
			carousel = Object.create(bsp_carousel_thumbnav);
		});

		it('should bind expected events', () => {
			var cb;
			spyOn(carousel, 'setCurrentThumbnail');
			carousel.stage = {
				bind: jasmine.createSpy().and.callFake((eventName, callback) => {
					cb = callback;
				})
			};
			carousel.addEvents();
			expect(carousel.stage.bind).toHaveBeenCalledWith('carousel:afterChange', jasmine.any(Function));
			cb();
			expect(carousel.setCurrentThumbnail).toHaveBeenCalled();
		});
	});

	describe('setCurrentThumbnail specs', () => {
		var $el;
    	var $nav;
    	var $stage;
    	var carousel;

    	beforeEach(() => {
    		$el = $(fixture1);
    		carousel = Object.create(bsp_carousel_thumbnav);
    		carousel.$nav = $el.find(selectorNav);
    		carousel.$stage = $el.find(selectorStage);
    	});

		it('should remove current from nav slide when stage index does not match, set current to matching index', () => {
			carousel.$stage.find('[data-slick-index=1]').addClass('slick-active');
			carousel.$nav.find('[data-slick-index=2]').addClass('current');
			carousel.setCurrentThumbnail();
			expect(carousel.$nav.find('[data-slick-index=1]').hasClass('current')).toBe(true);
			expect(carousel.$nav.find('[data-slick-index=2]').hasClass('current')).toBe(false);
		});
	});

	describe('buildCarousels specs', () => {
		var $el;
    	var $nav;
    	var $stage;
    	var carousel;

    	beforeEach(() => {
    		$el = $(fixture1);
    		carousel = Object.create(bsp_carousel_thumbnav);
    		carousel.$nav = $el.find(selectorNav);
    		carousel.$stage = $el.find(selectorStage);
    		carousel.instanceId = 'fake-id';
    		carousel.options = {
				nav: {
					themeConfig: {}
				},
				stage: {
					themeConfig: {}
				}
			};
    	});

		it('should add expected classes to nav and stage elements when options are empty', () => {
			carousel.buildCarousels();
			expect(carousel.$nav.hasClass('bsp-carousel-nav-fake-id')).toBe(true);
			expect(carousel.$stage.hasClass('bsp-carousel-stage-fake-id')).toBe(true);
		});

		it('should set asNavFor option to expected values when options are empty', () => {
			carousel.buildCarousels();
			expect(carousel.options.nav.themeConfig.asNavFor).toBe('.bsp-carousel-stage-fake-id');
			expect(carousel.options.stage.themeConfig.asNavFor).toBe('.bsp-carousel-nav-fake-id');
		});

		it('should not add classes if nav is set to disable', () => {
			carousel.options.nav = 'disable';
			carousel.buildCarousels();
			expect(carousel.$nav.hasClass('bsp-carousel-nav-fake-id')).toBe(false);
			expect(carousel.$stage.hasClass('bsp-carousel-stage-fake-id')).toBe(false);
		});

		it('should not set asNavFor if nav is set to disable', () => {
			carousel.options.nav = 'disable';
			carousel.buildCarousels();
			expect(carousel.options.stage.themeConfig.asNavFor).toBeUndefined();
		});

		it('should not add classes if stage is set to disable', () => {
			carousel.options.stage = 'disable';
			carousel.buildCarousels();
			expect(carousel.$nav.hasClass('bsp-carousel-nav-fake-id')).toBe(false);
			expect(carousel.$stage.hasClass('bsp-carousel-stage-fake-id')).toBe(false);
		});

		it('should not set asNavFor if stage is set to disable', () => {
			carousel.options.stage = 'disable';
			carousel.buildCarousels();
			expect(carousel.options.nav.themeConfig.asNavFor).toBeUndefined();
		});

		it('should not add classes if disableAsNavFor is set', () => {
			carousel.options.disableAsNavFor = true;
			carousel.buildCarousels();
			expect(carousel.$nav.hasClass('bsp-carousel-nav-fake-id')).toBe(false);
			expect(carousel.$stage.hasClass('bsp-carousel-stage-fake-id')).toBe(false);
		});

		it('should not set asNavFor if disableAsNavFor is set', () => {
			carousel.options.disableAsNavFor = true;
			carousel.buildCarousels();
			expect(carousel.options.nav.themeConfig.asNavFor).toBeUndefined();
			expect(carousel.options.stage.themeConfig.asNavFor).toBeUndefined();
		});

		it('should create the nav and stage objects if nav and stage are not set to disable', () => {
			spyOn(Object, 'create').and.callThrough();
			spyOn(bsp_carousel, 'init').and.callThrough();
			carousel.buildCarousels();
			expect(Object.create).toHaveBeenCalledWith(bsp_carousel);
			expect(Object.create.calls.count()).toBe(2);
			expect(bsp_carousel.init).toHaveBeenCalledWith(carousel.$stage, carousel.options.stage);
			expect(bsp_carousel.init).toHaveBeenCalledWith(carousel.$nav, carousel.options.nav);
		});

		it('should not create the nav object if nav is set to disable', () => {
			spyOn(bsp_carousel, 'init').and.callThrough();
			carousel.options.nav = 'disable';
			carousel.buildCarousels();
			expect(bsp_carousel.init).not.toHaveBeenCalledWith(carousel.$nav, carousel.options.nav);
		});

		it('should not create the stage object if stage is set to disable', () => {
			spyOn(bsp_carousel, 'init').and.callThrough();
			carousel.options.stage = 'disable';
			carousel.buildCarousels();
			expect(bsp_carousel.init).not.toHaveBeenCalledWith(carousel.$stage, carousel.options.stage);
		});

		it('should set thumbnail if stage and nav are not disabled', () => {
			spyOn(carousel, 'setCurrentThumbnail');
			carousel.buildCarousels();
			expect(carousel.setCurrentThumbnail).toHaveBeenCalled();
		});

		it('should not set thumbnail if nav is disabled', () => {
			carousel.options.nav = 'disable';
			spyOn(carousel, 'setCurrentThumbnail');
			carousel.buildCarousels();
			expect(carousel.setCurrentThumbnail).not.toHaveBeenCalled();
		});

		it('should not set thumbnail if stage is disabled', () => {
			carousel.options.stage = 'disable';
			spyOn(carousel, 'setCurrentThumbnail');
			carousel.buildCarousels();
			expect(carousel.setCurrentThumbnail).not.toHaveBeenCalled();
		});
	});
});

