module.exports = function(grunt) {
    'use strict'; // включить строгий режим
    // автоматически загружать задачи (хотя можно и вручную)
    // require('load-grunt-tasks')(grunt);

    // директории разработки и деплоя
    var config = {
        app: 'src',
        dist: 'build'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: 'config',
        less: {},
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/js/<%= pkg.name %>.js',
                dest: 'build/js/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                ['src/js/*.js']
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

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // регистрация задач
    grunt.registerTask('default', ['jshint', 'uglify']);
};
