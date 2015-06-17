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
		requirejs: {
			dist: {
				options: {
					baseUrl: 'src/js',
					include: ['bsp-carousel'],
					paths: {
						'jquery': 'empty:',
						'slick': '../../bower_components/slick-carousel/slick/slick'
					},
					optimize: 'none',
					out: 'dist/bsp-carousel/bsp-carousel.js',
					wrap: true
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/bsp-carousel/bsp-carousel.min.js' : ['dist/bsp-carousel/bsp-carousel.js'],
					'dist/bsp-carousel/bsp-carousel-plugin.min.js' : ['src/js/bsp-carousel-plugin.js'],
					'dist/bsp-carousel-thumbnav/bsp-carousel-thumbnav.min.js' : ['src/js/bsp-carousel-thumbnav.js'],
					'dist/bsp-carousel-thumbnav/bsp-carousel-thumbnav-plugin.min.js' : ['src/js/bsp-carousel-thumbnav-plugin.js']
				}
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'src/js/**/*.js', 'demo/**/*.js']
  		},
		copy: {
			build: {
				cwd: 'src/',
				expand: true,
				src: ['**'],
				dest: 'build/'
			},
			dist: {
				files: [
					{ 'dist/bsp-carousel/bsp-carousel-plugin.js': 'src/js/bsp-carousel-plugin.js' }, 
					{ 'dist/bsp-carousel-thumbnav/bsp-carousel-thumbnav.js': 'src/js/bsp-carousel-thumbnav.js' },
					{ 'dist/bsp-carousel-thumbnav/bsp-carousel-thumbnav-plugin.js': 'src/js/bsp-carousel-thumbnav-plugin.js' },
					{ 'dist/bsp-carousel/bsp-carousel.css': 'build/bsp-carousel.css' },
					{ 'dist/bsp-carousel-gallery-plugin/bsp-carousel-gallery-plugin.css': 'build/bsp-carousel-gallery-plugin.css' },
					{ 'dist/bsp-carousel-gallery-plugin/bsp-carousel-gallery.hbs': 'src/templates/bsp-carousel-gallery.hbs' }
				]
			}
		},
		cssUrlEmbed: {
		  dist: {
		    files: [{
		    	expand: true,
			    flatten: true,
			    src: [ 'build/less/bsp-carousel/bsp-carousel.css' ],
			    dest: 'build'
		    }]
		  }
		},
		concat: {
			less: {
				src: [
					"build/less/variables.less",
					"build/less/bsp-carousel-gallery-plugin/bsp-carousel-gallery-plugin.less"
				],
				dest: "build/less/bsp-carousel-gallery-plugin/bsp-carousel-gallery-plugin.concat.less"
			}
		},
		less: {
			dist: {				
				files: {
					"build/less/bsp-carousel/bsp-carousel.css": "build/less/bsp-carousel/bsp-carousel.less",
					"build/bsp-carousel-gallery-plugin.css": "build/less/bsp-carousel-gallery-plugin/bsp-carousel-gallery-plugin.concat.less"
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'dist/bsp-carousel/bsp-carousel.min.css' : 'build/bsp-carousel.css',
					'dist/bsp-carousel-gallery-plugin/bsp-carousel-gallery-plugin.min.css' : 'build/bsp-carousel-gallery-plugin.css'
				}
			}
		},
		clean: ['build'],
		watch: {
			src: {
				files: ['src/**/*','demo/**/*'],
				tasks: ['default']
			}
		}
	});

};