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
            nexus: {
                src: 'src/js/nexus/nexusUI.js',
                dest: 'build/js/lib/nexusUI.min.js'
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
                    unixNewlines: true,
                    loadPath: 'src/css',
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
                    '/css/open-sans/open-sans.css': 'open-sans-fontface/open-sans.css',
                    '/css/bootstrap/css/bootstrap.min.css' : 'bootstrap-css/css/bootstrap.min.css',
                    '/css/bootstrap-slider.min.css' : 'seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',

                    '/js/lib/jquery.min.js': 'jquery/dist/jquery.min.js',
                    '/js/lib/jq-swipe.min.js': 'jq-swipe/dist/jq-swipe.min.js',
                    '/js/lib/bootstrap.min.js': 'bootstrap-css/js/bootstrap.min.js',
                    '/js/lib/bootstrap-slider.min.js': 'seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                    '/js/lib/jquery.js': 'jquery/dist/jquery.js',
                    '/js/lib/jquery.fittext.js': 'FitText.js/jquery.fittext.js',
                    '/js/lib/jquery/dist/jquery.min.js': 'jquery/dist/jquery.min.js',
                    '/js/lib/state-machine.js': 'javascript-state-machine/state-machine.js',
                    '/js/lib/state-machine.min.js': 'javascript-state-machine/state-machine.min.js',
                }
            },
            folders: {
                files: {
                    '/css/bootstrap/fonts': 'bootstrap-css/fonts',
                    '/css/open-sans/fonts': 'open-sans-fontface/fonts'
                }
            }
        },

        pug: {
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
                    "build/index.html": ["src/index.pug"],
                    "build/info.html":  ["src/info.pug"],
                    "build/knobs.html":  ["src/knobs.pug"],
                    "build/timer.html":  ["src/timer.pug"],
                    "build/speakers.html" : ["src/speakers.pug"],
                    "build/concert.html" : ["src/concert.pug"],
                    "build/vlabel.html" : ["src/vlabel.pug"],
                    "build/vmetro.html" : ["src/vmetro.pug"],
                    "build/ui.html" : ["src/ui.pug"],
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

        copy: {
            js: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: ['node_modules/nexusui/dist/nexusUI.js'],
                        flatten: true,
                        dest: 'build/js/lib',
                        filter: 'isFile'},
                ],
            },
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
            pug: {
                files: ['src/*.pug', 'src/pug/*.pug'],
                tasks: ['pug'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // регистрация задач
    grunt.registerTask('default', ['connect', 'watch']);
    grunt.registerTask('dev', ['newer:pug', 'sass',
    'concat', 'jshint', 'bowercopy', 'newer:uglify']);
};
