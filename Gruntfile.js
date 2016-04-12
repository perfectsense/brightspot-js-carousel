module.exports = function(grunt) {
	
	var _ = require('lodash');
	var path = require('path');

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-css-url-embed');
	grunt.loadNpmTasks("grunt-bower-install-simple");
	grunt.loadNpmTasks("bsp-grunt");

	grunt.registerTask('default', ['compile']);
	grunt.registerTask('test', ['jshint:all']);
	
	grunt.registerTask('compile', ['bower-install-simple','copy:build','compilecss','copy:dist']);

	// uglify no-likey es6 right now
	// https://github.com/mishoo/UglifyJS2/issues/659
	// grunt.registerTask('compilejs', ['systemjs','uglify:dist']);
	grunt.registerTask('compilejs', ['systemjs']);
	
	grunt.registerTask('compilecss', ['concat:less','less:dist','cssUrlEmbed:dist','cssmin:dist']);

	grunt.initConfig({

		// build tokens
		labelBspCarousel: 'bsp-carousel',
		labelBspGallery: '<%= labelBspCarousel %>-gallery',
		labelBspThumbnav: '<%= labelBspCarousel %>-thumbnav',
		labelPluginLabel: 'plugin',
		extHandlebars: '.hbs',
		buildDir: 'build',
		buildJsDir: '<%= buildDir %>/js',
		buildLessDir: '<%= buildDir %>/less',
		buildBspCarouselLess: '<%= buildLessDir %>/<%= labelBspCarousel %>',
		buildBspGalleryLess: '<%= buildLessDir %>/<%= labelBspGallery %>',
		demoDir: 'demo',
		distDir: 'dist',
		distBspCarouselDir: '<%= distDir %>/<%= labelBspCarousel %>',
		distBspGalleryDir: '<%= distDir %>/<%= labelBspGallery %>',
		distBspThumbnavDir: '<%= distDir %>/<%= labelBspThumbnav %>',
		srcDir: 'src',
		srcFontsDir: '<%= srcDir %>/fonts',
		srcJsDir: '<%= srcDir %>/js',
		srcLessDir:  '<%= srcDir %>/less',
		srcTemplatesDir:  '<%= srcDir %>/templates',

		// task config
		"bower-install-simple": {
			options: {
				directory: "<%= buildJsDir %>"
			},
			dev: {
				production: true
			}
		},
		systemjs: {
			dist: {
				options: {
					configFile: '<%= buildJsDir %>/config.js',
					configOverrides: {
						minify: false,
						sfxFormat: 'es6',
						sourceMaps: false
					}
				},
				files: [
					{ '<%= distBspCarouselDir %>/<%= labelBspCarousel %>.js': '<%= buildJsDir %>/<%= labelBspCarousel %>.js' }
				]
			}
		},
		uglify: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					'<%= distBspCarouselDir %>/<%= labelBspCarousel %>.min.js' : ['<%= srcJsDir %>/<%= labelBspCarousel %>.js'],
					'<%= distBspCarouselDir %>/<%= labelBspCarousel %>-<%= labelPluginLabel %>.min.js' : ['<%= srcJsDir %>/<%= labelBspCarousel %>-<%= labelPluginLabel %>.js'],
					'<%= distBspThumbnavDir %>/<%= labelBspThumbnav %>.min.js' : ['<%= srcJsDir %>/<%= labelBspThumbnav %>.js'],
					'<%= distBspThumbnavDir %>/<%= labelBspThumbnav %>-<%= labelPluginLabel %>.min.js' : ['<%= srcJsDir %>/<%= labelBspThumbnav %>-<%= labelPluginLabel %>.js']
				}
			}
		},
		jshint: {
			all: ['Gruntfile.js', '<%= srcJsDir %>/**/*.js', '<%= demoDir %>/**/*.js']
  		},
		copy: {
			build: {
				files: [
					{
						cwd: '<%= srcDir %>/',
						expand: true,
						src: ['**'],
						dest: '<%= buildDir %>/'
					}
				]
			},
			dist: {
				files: [
					{
						'<%= distBspCarouselDir %>/slick.js':
						'bower_components/slick-carousel/slick/slick.js'
					},
					{
						'<%= distBspCarouselDir %>/<%= labelBspCarousel %>.js':
						'<%= srcJsDir %>/<%= labelBspCarousel %>.js'
					},
					{
						'<%= distBspCarouselDir %>/<%= labelBspCarousel %>-<%= labelPluginLabel %>.js':
						'<%= srcJsDir %>/<%= labelBspCarousel %>-<%= labelPluginLabel %>.js'
					}, 
					{
						'<%= distBspThumbnavDir %>/<%= labelBspThumbnav %>.js':
						'<%= srcJsDir %>/<%= labelBspThumbnav %>.js'
					},
					{
						'<%= distBspThumbnavDir %>/<%= labelBspThumbnav %>-<%= labelPluginLabel %>.js':
						'<%= srcJsDir %>/<%= labelBspThumbnav %>-<%= labelPluginLabel %>.js'
					},
					{
						'<%= distBspCarouselDir %>/<%= labelBspCarousel %>.css':
						'<%= buildDir %>/<%= labelBspCarousel %>.css'
					},
					{
						'<%= distBspGalleryDir %>/<%= labelBspGallery %>.css':
						'<%= buildDir %>/<%= labelBspGallery %>.css'
					},
					{
						'<%= distBspGalleryDir %>/<%= labelBspGallery %><%= extHandlebars %>':
						'<%= srcTemplatesDir %>/<%= labelBspGallery %><%= extHandlebars %>'
					},
					{
						'<%= distBspGalleryDir %>/<%= labelBspGallery %>.js':
						'<%= srcJsDir %>/<%= labelBspGallery %>.js'
					},
					{
						'<%= distBspGalleryDir %>/<%= labelBspGallery %>-<%= labelPluginLabel %>.js':
						'<%= srcJsDir %>/<%= labelBspGallery %>-<%= labelPluginLabel %>.js'
					},
					{
						cwd: '<%= buildDir %>/js/history.js/scripts/bundled-uncompressed/html5',
						expand: true,
						src: ['native.history.js'],
						dest: '<%= distDir %>/'
					}
				]
			}
		},
		cssUrlEmbed: {
		  dist: {
		    files: [{
		    	expand: true,
			    flatten: true,
			    src: [ '<%= buildBspCarouselLess %>/<%= labelBspCarousel %>.css' ],
			    dest: '<%= buildDir %>'
		    }]
		  }
		},
		concat: {
			less: {
				src: [
					"<%= buildLessDir %>/variables.less",
					"<%= buildBspGalleryLess %>/<%= labelBspGallery %>.less"
				],
				dest: "<%= buildBspGalleryLess %>/<%= labelBspGallery %>.concat.less"
			}
		},
		less: {
			dist: {				
				files: [
					{
						"<%= buildBspCarouselLess %>/<%= labelBspCarousel %>.css":
						"<%= buildBspCarouselLess %>/<%= labelBspCarousel %>.less"
					},
					{
						"<%= buildDir %>/<%= labelBspGallery %>.css":
						"<%= buildBspGalleryLess %>/<%= labelBspGallery %>.concat.less"
					}
				]
			}
		},
		cssmin: {
			dist: {
				files: [
					{
						'<%= distBspCarouselDir %>/<%= labelBspCarousel %>.min.css':
						'<%= buildDir %>/<%= labelBspCarousel %>.css'
					},
					{
						'<%= distBspGalleryDir %>/<%= labelBspGallery %>.min.css':
						'<%= buildDir %>/<%= labelBspGallery %>.css'
					}
				]
			}
		},
		clean: ['build'],
		watch: {
			src: {
				files: [
					'<%= srcDir %>/**/*',
					'<%= demoDir %>/**/*'
				],
				tasks: ['default']
			}
		}
	});

};