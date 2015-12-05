module.exports = function(grunt) {
    'use strict'; // включить строгий режим
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
        less: {},
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
        watch: {
            options: {
                livereload: true
            },
            less: {
                files: ['<%= config.app %>/styles/{,*/}*.less'],
                tasks: ['less:dev']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js']
            }
        }
    });

    // регистрация задач
    grunt.registerTask('default', ['concat', 'jshint', 'uglify']);
};
