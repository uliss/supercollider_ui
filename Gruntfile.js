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
            },
            ui: {
                src: ['bower_components/jquery-ui/ui/*.js'],
                dest: 'build/js/lib/jquery-ui.js'
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
            ui: {
                // src: 'build/js/lib/jquery-ui.js',
                // dest: 'build/js/lib/jquery-ui.min.js',
            },
            libs: {
                src: 'build/js/lib/jquery.fittext.js',
                dest: 'build/js/lib/jquery.fittext.min.js'
            }
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
                    unixNewlines: true
                },
                files: {
                    'build/css/global.css': 'src/css/global.scss'
                }
            }
        },
        bowercopy: {
            options: {
                destPrefix: 'build'
            },
            libs: {
                files: {
                    '/js/lib/jquery.min.js': 'jquery/dist/jquery.min.js',
                    '/js/lib/jquery.knob.min.js' : 'aterrien/jQuery-Knob/dist/jquery.knob.min.js',
                    '/css/bootstrap/css/bootstrap.min.css' : 'bootstrap-css/css/bootstrap.min.css',
                    '/js/lib/jquery.fittext.js': 'FitText.js/jquery.fittext.js'
                }
            },
            folders: {
                files: {
                    '/css/bootstrap/fonts': 'bootstrap-css/fonts'
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
                    "build/index.html": ["src/index.jade"],
                    "build/info.html":  ["src/info.jade"],
                    "build/knobs.html":  ["src/knobs.jade"],
                    "build/timer.html":  ["src/timer.jade"],
                    "build/speakers.html" : ["src/speakers.jade"],
                    "build/concert.html" : ["src/concert.jade"],
                    "build/vlabel.html" : ["src/vlabel.jade"],
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
                files: ['src/*.jade', 'src/jade/*.jade'],
                tasks: ['jade'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // регистрация задач
    grunt.registerTask('default', ['connect', 'watch']);
    grunt.registerTask('dev', ['newer:jade', 'newer:sass',
    'concat', 'jshint', 'uglify', 'bowercopy']);
};
