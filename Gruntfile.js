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

	grunt.registerTask('default', ['compile']);
	grunt.registerTask('test', ['jshint:all']);
	
	grunt.registerTask('compile', ['bower-install-simple','copy:build','compilejs','compilecss','copy:dist']);
	grunt.registerTask('compilejs', ['systemjs','uglify:dist']);
	grunt.registerTask('compilecss', ['concat:less','less:dist','cssUrlEmbed:dist','cssmin:dist']);

	/** @todo move this to bsp-grunt, include here with loadNpmTask instead */
	grunt.registerMultiTask('systemjs', 'Compiles systemjs apps', function() {
		var config = {
			minify: true,
			sourceMaps: true
		};
		var filesCount = 0;
		var filesDone = 0;
		var done = this.async();
		var options = this.options();
		var buildDeps = [
			{ src: 'node_modules/babel-core/browser.js', dest: 'babel.js' },
			{ src: 'node_modules/bsp-grunt/lib/systemjs-build.js', dest: 'systemjs-build.js' },
			{ src: 'node_modules/systemjs/dist/system.js', dest: 'system.js' }
		];
		if (!options.configFile || !grunt.file.exists(options.configFile)) {
			grunt.fail.fatal('SystemJS tasks needs a vaild configFile option');
		}
		if (options.configOverrides) {
			config = _.extend({}, config, options.configOverrides);
		}
		this.files.forEach(function() {
			filesCount++;
		});
		this.files.forEach(function(file) {
			var args = [
				'systemjs-build.js',
				path.basename(file.src[0]),
				path.resolve(file.dest),
				path.basename(options.configFile),
				config.minify,
				config.sourceMaps
			];
			var child;
			var fileBaseDir = path.resolve( path.dirname(file.src[0]) );
			var troubleShootCmd = '';
			
			/** script must be run from app root because of bug in systemjs-builder */
			buildDeps.forEach(function(dep) {
				grunt.file.copy(dep.src, fileBaseDir + '/' + dep.dest);
			});

			troubleShootCmd = 'node ' + args.join(' ');

			child = grunt.util.spawn({
				cmd: 'node',
				args: args,
				opts: {
					cwd: fileBaseDir,
					stdio: 'inherit'
				}
			}, function(err) {
				if (err) {
					grunt.log.writeln('SystemJS build failed'.red);
					grunt.fail.fatal(err);
				}
				if (grunt.file.exists(file.dest)) {
					grunt.log.writeln('Wrote',file.dest.cyan);
				} else {
					grunt.fail.fatal('Failed to write' + file.dest.red);
				}
				if (config.sourceMaps) {
					if (grunt.file.exists(file.dest + '.map')) {
						grunt.log.writeln('Wrote',(file.dest+'.map').cyan);
					} else {
						grunt.fail.fatal('Failed to write ', (file.dest+'.map').red);
					}
				}
				filesDone++;
				
				if (filesDone === filesCount) {
					done();
				}
			});
		});
	});

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
						sourceMaps: false
					}
				},
				files: [
					{ '<%= distBspCarouselDir %>/<%= labelBspCarousel %>.js': '<%= buildJsDir %>/<%= labelBspCarousel %>.js' }
				]
			},
			distmin: {
				options: {
					configFile: '<%= buildJsDir %>/config.js',
				},
				files: [
					{ '<%= distBspCarouselDir %>/<%= labelBspCarousel %>.min.js': '<%= buildJsDir %>/<%= labelBspCarousel %>.js' }
				]
			}
		},
		uglify: {
			dist: {
				files: {
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