import $ from 'jquery';
import bsp_carousel from '../../src/js/bsp-carousel';

describe('bsp-carousel utility', () => {
	
	var themeConfig = {
		'carousel-dots': {
			dots: true
		},
		'carousel-horizontal-thumbnails': {
			lazyLoad: 'progressive',
			slidesToShow: 4,
			slidesToScroll: 4
		}
	};

	describe('configuration specs', () => {
		it('should have expected theme configuration', () => {
			expect( bsp_carousel.themes ).toEqual(themeConfig);	
		});
	});

	describe('init specs', () => {
		var $el;
		var carousel;

		beforeEach(() => {
			$el = $('<div></div>');
			carousel = Object.create(bsp_carousel);
		});

		it('should save the element passed as first arg to object', () => {
			carousel.init($el);
			expect( carousel.$el ).toBe($el);
		});

		it('should call the addClasses method with options as its arg', () => {
			var test = { test: 'test' };
			spyOn(carousel, 'addClasses').and.callThrough();
			carousel.init($el, test);
			expect(carousel.addClasses).toHaveBeenCalledWith(test);
		});

		it('should call the _createSlickMethodsAvailablePromise method', () => {
			spyOn(carousel, '_createSlickMethodsAvailablePromise').and.callThrough();
			carousel.init($el);
			expect(carousel._createSlickMethodsAvailablePromise).toHaveBeenCalled();
		});

		it('should call the mergeOptions method with options as its arg', () => {
			var test = { test: 'test' };
			spyOn(carousel, 'mergeOptions').and.callThrough();
			carousel.init($el, test);
			expect(carousel.mergeOptions).toHaveBeenCalledWith(test);
		});

		it('should call $el.slick method with options as its arg', () => {
			var test = { test: 'test' };
			spyOn($el, 'slick');
			carousel.init($el, { themeConfig: test });
			expect($el.slick).toHaveBeenCalledWith(test);
		});

		it('should expose the carousel object as a data attribute', () => {
			carousel.init($el);
			expect( $el.data('bsp_carousel') ).toBe(carousel);
		});

		it('should return itself to allow chaining', () => {
			expect( carousel.init($el) ).toBe(carousel);
		});
	});

	describe('mergeOptions specs', () => {
		var $el;
		var carousel;

		beforeEach(() => {
			$el = $('<div></div>');
			carousel = Object.create(bsp_carousel);
			carousel.$el = $el;
		});

		it('should return an empty object if options object is empty', () => {
			expect( carousel.mergeOptions({}) ).toEqual({});
		});

		it('should return an empty object if options arg is not object', () => {
			expect( carousel.mergeOptions('not an object') ).toEqual({});
		});

		it('should return preconfigured theme config when a theme is named and no overrides specified', () => {
			expect( carousel.mergeOptions({ theme: 'carousel-dots' }) ).toEqual(themeConfig['carousel-dots']);
		});

		it('should return preconfigured theme config and an override when a theme is named and override specified', () => {
			var overrideConfig = themeConfig['carousel-horizontal-thumbnails'];
			overrideConfig.slidesToShow = 2;
			overrideConfig.testVar = 'test';
			expect( carousel.mergeOptions({
				theme: 'carousel-horizontal-thumbnails',
				themeConfig: {
					slidesToShow: 2,
					testVar: 'test'
				}
			}) ).toEqual(overrideConfig);
		});
	});

	describe('addClasses specs', () => {
		var $el;
		var carousel;

		beforeEach(() => {
			$el = $('<div></div>');
			carousel = Object.create(bsp_carousel);
			carousel.$el = $el;
		});

		it('should add bsp-carousel class to element', () => {
			carousel.addClasses({});
			expect($el.hasClass('bsp-carousel')).toBe(true);
		});

		it('should add a theme class to the element if theme option specified as string', () => {
			carousel.addClasses({ theme: 'test-theme' });
			expect($el.hasClass('test-theme')).toBe(true);
		});

		it('should throw an error if carousel.$el is undefined', () => {
			carousel.$el = undefined;
			expect(() => {
				carousel.addClasses({});
			}).toThrow();
		});
	});

	describe('event specs', () => {
		var $el;
		var carousel;

		beforeEach(() => {
			$el = $('<div></div>');
			carousel = Object.create(bsp_carousel);
			carousel.$el = $el;
		});

		describe('bind', () => {
			it('should call jquery on', () => {
				var test = function() {};
				spyOn(carousel.$el, 'on');
				carousel.bind('test', test);
				expect(carousel.$el.on).toHaveBeenCalledWith('test', test);
			});
		});

		describe('trigger', () => {
			it('should interpret first arg as event name, add carousle object as first arg, pass remaining args to jquery trigger', () => {
				spyOn(carousel.$el, 'trigger');
				carousel.trigger('eventName', 'arg1', 'arg2');
				expect(carousel.$el.trigger).toHaveBeenCalledWith('eventName', [carousel, 'arg1', 'arg2']);
			});
		});

		describe('addEvents', () => {

			beforeEach(() => {
				var deferred = new $.Deferred();
				carousel._slickMethodsAvailablePromise = deferred.promise();
				spyOn(carousel, 'bind').and.callThrough();
				spyOn(carousel, 'trigger');
				deferred.resolve();
			});

			it('should bind events as expected', () => {
				carousel.addEvents();
				expect(carousel.bind).toHaveBeenCalledWith('afterChange', jasmine.any(Function));
				expect(carousel.bind).toHaveBeenCalledWith('beforeChange', jasmine.any(Function));
				expect(carousel.bind).toHaveBeenCalledWith('edge', jasmine.any(Function));
				expect(carousel.bind).toHaveBeenCalledWith('reinit', jasmine.any(Function));
				expect(carousel.bind).toHaveBeenCalledWith('setPosition', jasmine.any(Function));
				expect(carousel.bind).toHaveBeenCalledWith('swipe', jasmine.any(Function));
			});

			it('should trigger events as expected', () => {
				carousel.addEvents();

				expect(carousel.trigger).toHaveBeenCalledWith('carousel:init');

				$el.trigger('afterChange', [{}, 1]);
				expect(carousel.trigger).toHaveBeenCalledWith('carousel:afterChange', 1);

				$el.trigger('beforeChange', [{}, 1, 1]);
				expect(carousel.trigger).toHaveBeenCalledWith('carousel:beforeChange', 1, 1);

				$el.trigger('edge', [{}, 'left']);
				expect(carousel.trigger).toHaveBeenCalledWith('carousel:edge', 'left');

				$el.trigger('reinit', [{}]);
				expect(carousel.trigger).toHaveBeenCalledWith('carousel:reinit');

				$el.trigger('setPosition', [{}]);
				expect(carousel.trigger).toHaveBeenCalledWith('carousel:setPosition');

				$el.trigger('swipe', [{}, 'left']);
				expect(carousel.trigger).toHaveBeenCalledWith('carousel:swipe', 'left');
			});
		});
	});

	describe('slickMethod specs', () => {
		// to be done
	});
	
});