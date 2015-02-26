module.exports = function(grunt) {
	
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-css-url-embed');

	grunt.registerTask('default', ['compile']);
	grunt.registerTask('test', ['jshint:all']);
	
	grunt.registerTask('compile', ['copy:build','compilejs','compilecss','copy:dist']);
	grunt.registerTask('compilejs', ['requirejs:dist','uglify:dist']);
	grunt.registerTask('compilecss', ['less:dist','cssUrlEmbed:dist','cssmin:dist']);

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
					out: 'dist/bsp-carousel.js',
					wrap: true
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/bsp-carousel.min.js' : ['dist/bsp-carousel.js'],
					'dist/bsp-carousel-plugin.min.js' : ['src/js/bsp-carousel-plugin.js'],
					'dist/bsp-carousel-thumbnav-plugin.min.js' : ['src/js/bsp-carousel-thumbnav-plugin.js']
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
				src: ['src/js/bsp-carousel-plugin.js','src/js/bsp-carousel-thumbnav-plugin.js','build/bsp-carousel.css'],
				dest: 'dist/',
				expand: true,
				flatten: true
			}
		},
		cssUrlEmbed: {
		  dist: {
		    expand: true,
		    flatten: true,
		    src: [ 'build/less/bsp-carousel.css' ],
		    dest: 'build'
		  }
		},
		less: {
			dist: {
				files: {
					"build/less/bsp-carousel.css": "build/less/bsp-carousel.less"
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'dist/bsp-carousel.min.css' : 'build/bsp-carousel.css'
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