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

        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'build'
                }
            }
        },

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
            files: [
                'src/js/*.js'
            ]
        },
        sass: {
            dist: {
                options: {
                    style: 'compact',
                    unixNewlines: true,
                    sourceMap: true
                },
                files: {
                    'build/css/global.css': 'src/css/global.scss'
                }
            }
        },
        jade: {
            options: {
                pretty: true,
            },
            compile: {
                options: {
                    data: {
                        debug: false
                    }
                },
                files: {
                    "build/index.html": ["src/index.jade"]
                }
            }
        },
        htmllint: {
            all: {
                options: {
                    force: false
                },
                src: [
                    'build/*.html'
                ]
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
            },
            jade: {
                files: ['src/*.jade'],
                tasks: ['jade'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // регистрация задач
    grunt.registerTask('default', ['connect', 'watch']);
    grunt.registerTask('dev', ['newer:jade', 'newer:htmllint', 'newer:sass', 'concat', 'jshint', 'uglify']);
};
