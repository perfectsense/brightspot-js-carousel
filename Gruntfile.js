module.exports = function(grunt) {
	
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

	grunt.registerTask('default', ['compile']);
	grunt.registerTask('test', ['jshint:all']);
	
	grunt.registerTask('compile', ['copy:build','compilejs','compilecss','copy:dist']);
	grunt.registerTask('compilejs', ['requirejs:dist','uglify:dist']);
	grunt.registerTask('compilecss', ['concat:less','less:dist','cssUrlEmbed:dist','cssmin:dist']);

	grunt.initConfig({

		// build tokens
		labelBspCarousel: 'bsp-carousel',
		labelBspGallery: '<%= labelBspCarousel %>-gallery',
		labelBspThumbnav: '<%= labelBspCarousel %>-thumbnav',
		labelPluginLabel: 'plugin',
		extHandlebars: '.hbs',
		buildDir: 'build',
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
		requirejs: {
			dist: {
				options: {
					baseUrl: '<%= srcJsDir %>',
					include: ['<%= labelBspCarousel %>'],
					paths: {
						'jquery': 'empty:',
						'slick': '../../bower_components/slick-carousel/slick/slick'
					},
					optimize: 'none',
					out: '<%= distBspCarouselDir %>/<%= labelBspCarousel %>.js',
					wrap: true
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= distBspCarouselDir %>/<%= labelBspCarousel %>.min.js' : ['<%= distBspCarouselDir %>/<%= labelBspCarousel %>.js'],
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
				cwd: '<%= srcDir %>/',
				expand: true,
				src: ['**'],
				dest: '<%= buildDir %>/'
			},
			dist: {
				files: [
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