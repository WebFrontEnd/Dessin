module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
                files : {
                    'dist/concat/<%= pkg.name %>.default.js': ['src/namespace.js', 'src/constant.js'],
                    'dist/concat/<%= pkg.name %>.core.js' : ['src/core/util/*.js', 'src/core/tool/*.js','src/core/*.js'],
                    'dist/concat/<%= pkg.name %>.ui.js' : ['src/ui/*.js'],
                    'dist/<%= pkg.name %>.js': ['dist/concat/<%= pkg.name %>.default.js','dist/concat/<%= pkg.name %>.core.js','dist/concat/<%= pkg.name %>.ui.js']
                }
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		}
	});

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //'jshint',
	grunt.registerTask('default', [ 'concat', 'uglify']);

};