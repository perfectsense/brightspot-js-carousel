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

		buildDir: 'build',
		buildLessDir: '<%= buildDir %>/less',
		buildBspCarouselLess: '<%= buildLessDir %>/bsp-carousel',
		buildBspGalleryLess: '<%= buildLessDir %>/bsp-carousel-gallery-plugin',
		demoDir: 'demo',
		distDir: 'dist',
		distBspCarouselDir: '<%= distDir %>/bsp-carousel',
		distBspGalleryDir: '<%= distDir %>/bsp-carousel-gallery-plugin',
		distBspThumbnavDir: '<%= distDir %>/bsp-carousel-thumbnav',
		srcDir: 'src',
		srcFontsDir: '<%= srcDir %>/fonts',
		srcJsDir: '<%= srcDir %>/js',
		srcLessDir:  '<%= srcDir %>/less',
		srcTemplatesDir:  '<%= srcDir %>/templates',

		requirejs: {
			dist: {
				options: {
					baseUrl: '<%= srcJsDir %>',
					include: ['bsp-carousel'],
					paths: {
						'jquery': 'empty:',
						'slick': '../../bower_components/slick-carousel/slick/slick'
					},
					optimize: 'none',
					out: '<%= distBspCarouselDir %>/bsp-carousel.js',
					wrap: true
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= distBspCarouselDir %>/bsp-carousel.min.js' : ['<%= distBspCarouselDir %>/bsp-carousel.js'],
					'<%= distBspCarouselDir %>/bsp-carousel-plugin.min.js' : ['<%= srcJsDir %>/bsp-carousel-plugin.js'],
					'<%= distBspThumbnavDir %>/bsp-carousel-thumbnav.min.js' : ['<%= srcJsDir %>/bsp-carousel-thumbnav.js'],
					'<%= distBspThumbnavDir %>/bsp-carousel-thumbnav-plugin.min.js' : ['<%= srcJsDir %>/bsp-carousel-thumbnav-plugin.js']
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
					{ '<%= distBspCarouselDir %>/bsp-carousel-plugin.js': '<%= srcJsDir %>/bsp-carousel-plugin.js' }, 
					{ '<%= distBspThumbnavDir %>/bsp-carousel-thumbnav.js': '<%= srcJsDir %>/bsp-carousel-thumbnav.js' },
					{ '<%= distBspThumbnavDir %>/bsp-carousel-thumbnav-plugin.js': '<%= srcJsDir %>/bsp-carousel-thumbnav-plugin.js' },
					{ '<%= distBspCarouselDir %>/bsp-carousel.css': '<%= buildDir %>/bsp-carousel.css' },
					{ '<%= distBspGalleryDir %>/bsp-carousel-gallery-plugin.css': '<%= buildDir %>/bsp-carousel-gallery-plugin.css' },
					{ '<%= distBspGalleryDir %>/bsp-carousel-gallery.hbs': '<%= srcTemplatesDir %>/bsp-carousel-gallery.hbs' }
				]
			}
		},
		cssUrlEmbed: {
		  dist: {
		    files: [{
		    	expand: true,
			    flatten: true,
			    src: [ '<%= buildBspCarouselLess %>/bsp-carousel.css' ],
			    dest: '<%= buildDir %>'
		    }]
		  }
		},
		concat: {
			less: {
				src: [
					"<%= buildLessDir %>/variables.less",
					"<%= buildBspGalleryLess %>/bsp-carousel-gallery-plugin.less"
				],
				dest: "<%= buildBspGalleryLess %>/bsp-carousel-gallery-plugin.concat.less"
			}
		},
		less: {
			dist: {				
				files: {
					"<%= buildBspCarouselLess %>/bsp-carousel.css": "<%= buildBspCarouselLess %>/bsp-carousel.less",
					"<%= buildDir %>/bsp-carousel-gallery-plugin.css": "<%= buildBspGalleryLess %>/bsp-carousel-gallery-plugin.concat.less"
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'<%= distBspCarouselDir %>/bsp-carousel.min.css' : '<%= buildDir %>/bsp-carousel.css',
					'<%= distBspGalleryDir %>/bsp-carousel-gallery-plugin.min.css' : '<%= buildDir %>/bsp-carousel-gallery-plugin.css'
				}
			}
		},
		clean: ['build'],
		watch: {
			src: {
				files: ['<%= srcDir %>/**/*','demo/**/*'],
				tasks: ['default']
			}
		}
	});

};