module.exports = function(grunt) {
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['compile']);
	
	grunt.registerTask('compile', ['compilejs']);
	grunt.registerTask('compilejs', ['uglify:dist','uglify:distmin']);

	grunt.initConfig({
		uglify: {
			dist: {
				options: {
					beautify: true
				},
				files: {
					'dist/bsp-carousel.js' : ['bower_components/slick-carousel/slick/slick.js', 'src/js/bsp-carousel.js'],
					'dist/bsp-carousel-plugin.js' : ['src/js/bsp-carousel-plugin.js']
				}
			},
			distmin: {
				files: {
					'dist/bsp-carousel.min.js' : ['bower_components/slick-carousel/slick/slick.js', 'src/js/bsp-carousel.js'],
					'dist/bsp-carousel-plugin.min.js' : ['src/js/bsp-carousel-plugin.js']
				}
			}
		}
	});

};