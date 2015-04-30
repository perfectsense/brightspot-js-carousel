# brightspot-js-carousel

> **IMPORTANT: The 0.1.0 upgrade changes the init function in an important way.** Previously, Object.create was run in the init function. This was breaking IE8 if a polyfill for Object.create wasn't loaded. So it has now been changed to follow the more common bsp utility pattern where you are expected to manually invoke Object.create in whatever plugin you write.

Front end abstraction for [slick carousel](http://kenwheeler.github.io/slick/). Provides a utility with pre-bundled themes and Brightspot plugins to instantiate the utility.

## Installation

Manually:

*	Download [jQuery 1.7.0 or above](http://jquery.com/download/)
*	Download [bsp-utils.js](https://raw.githubusercontent.com/perfectsense/brightspot-js-utils/master/bsp-utils.js) ([repository](https://github.com/perfectsense/brightspot-js-utils))
*	Download js and css from [the dist folder of this repo](https://github.com/perfectsense/brightspot-js-carousel/tree/master/dist).

## Files

*	**bsp-carousel.js** - API which can be pulled into other plugins to build carousels, includes slick js
*	**bsp-carousel-plugin.js** - [Brightspot plugin]((https://github.com/perfectsense/brightspot-js-utils/blob/master/PLUGIN.md)) which instantiates bsp-carousel using the `data-bsp-carousel` attribute.
*	**bsp-carousel-thumbnav-plugin.js** - [Brightspot plugin]((https://github.com/perfectsense/brightspot-js-utils/blob/master/PLUGIN.md)) which combines two carousels (one for a "stage" and one for navigation) using the `data-bsp-carousel-thumbnav` attribute.
*	**bsp-carousel.css** - Base styles for all carousels, images and fonts included inline. Available font icons documented [here](https://github.com/perfectsense/brightspot-js-carousel/blob/master/src/fonts/usage.png). Includes slick css

## bsp-carousel API

### Methods

**bsp_carousel.init($el, options)**

    require(['jquery', 'bsp-carousel'], function($, bsp_carousel) {
      var $el = $('.my-carousel');
      bsp_carousel.init($el, {
        theme: 'carousel-dots',
        themeConfig: {
          arrows: false
        }
      });
    });

*   $el - jquery element
*   options - object
  * options.theme - string, selects a prepackaged set of carousel options (valid values: 'carousel-dots', 'carousel-horizontal-thumbnails')
  * options.themeConfig - object, overrides defaults set by slick and (if applied) a theme
  * options.breakpoints - object, overrides responsive breakpoints

**bsp_carousel.bind(event, callback)**

* event - string, see events section below
* callback - function

**bsp_carousel.trigger(event, argument1, argument2, ...)**

* event - string, see events section below
* argument1, argument2, ... - accepts any number of arguments

**bsp_carousel.currentSlide**

Abstraction of slickCurrentSlide method, returns the current slide

**bsp_carousel.goTo(i)**

Abstraction of slickGoTo method

* i - number, index of desired slide to go to
		
**bsp_carousel.next**

Abstraction of slickNext method

**bsp_carousel.prev**

Abstraction of slickPrev method

**bsp_carousel.pause**

Abstraction of slickPause method
		
**bsp_carousel.play**

Abstraction of slickPlay method

**bsp_carousel.add(ele, index, addBefore)**

Abstraction of slickAdd method

* ele - html or DOM object
* index - number, add at this index, or before if addBefore is set
* addBefore - bool, will set to add element before specified index. If no index provided, add to beginning or end
		
**bsp_carousel.remove(index, removeBefore)**

Abstraction of slickRemove method

* index - number of slide to remove
* removeBefore - bool, if set false will remove slide following index or last slide if no index set
		
**bsp_carousel.filter(selectorOrFunction)**

Abstraction of slickFilter method

* selectorOrFunction - filters slides using jQuery .filter()

**bsp_carousel.unfilter(i)**

Abstraction of slickUnfilter method

* i - slide to remove filtering on

**bsp_carousel.getOption(option)**

Abstraction of slickGetOption method

* option - string, name of option to retrieve

**bsp_carousel.setOption(option, value)**

Abstraction of slickSetOption method

* option - string, name of option to set
* value - value to save

**bsp_carousel.destroy**

Abstraction of unslick method

**bsp_carousel.slideCount**

Returns total number of slides

## bsp-carousel-plugin

[General Brightspot plugin configuration documentation](https://github.com/perfectsense/brightspot-js-utils/blob/master/PLUGIN.md)

Brightspot plugin that passes element and options to API init method. 

    <div data-bsp-carousel data-bsp-carousel-options='{ "theme" : "carousel-dots", "themeConfig" : { "arrows" : false } }'>
      <div><img alt="" src="image1.jpg" /></div>
      <div><img alt="" src="image2.jpg" /></div>
      <div><img alt="" src="image3.jpg" /></div>
    </div>

## bsp-carousel-thumbnav-plugin

[General Brightspot plugin configuration documentation](https://github.com/perfectsense/brightspot-js-utils/blob/master/PLUGIN.md)

Brightspot plugin which combines two carousels (one for a "stage" and one for navigation). Accepts two sets of configs: one for nav and one for stage.

    <div data-bsp-carousel-thumbnav data-bsp-carousel-thumbnav-options='{ "nav" : { "themeConfig": { "arrows": false } }, "stage" : { "themeConfig": { "arrows": false } } }'>
      <div class="bsp-carousel-stage">
        <div><img alt="" src="image1.jpg" /></div>
        <div><img alt="" src="image2.jpg" /></div>
        <div><img alt="" src="image3.jpg" /></div>
      </div>
      <div class="bsp-carousel-nav">
        <div><img alt="" src="thumb1.jpg" /></div>
        <div><img alt="" src="thumb2.jpg" /></div>
        <div><img alt="" src="thumb3.jpg" /></div>
      </div>
    </div>