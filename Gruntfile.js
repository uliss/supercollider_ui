module.exports = function(grunt) {
    'use strict'; // включить строгий режим
    // get build time
    require('time-grunt')(grunt);
    // автоматически загружать задачи
    require('load-grunt-tasks')(grunt);

    // директории разработки и деплоя
    var config = {
        app: 'src',
        dist: 'build'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: 'config',

        concat: {
            dist: {
                src: ['src/js/*.js'],
                dest: 'build/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/js/<%= pkg.name %>.js',
                dest: 'build/js/<%= pkg.name %>.min.js'
            },
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'src/js/*.js'
            ]
        },
        sass: {
            dist: {
                options: {
                    style: 'compact',
                    unixNewlines: true
                },
                files: {
                    'build/css/global.css': 'src/css/global.scss'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['concat', 'jshint', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['src/css/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // регистрация задач
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dev', ['sass', 'concat', 'jshint', 'uglify']);
};
