var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require('gulp-rename');
var pug = require('gulp-pug');
var bootlint  = require('gulp-bootlint');
var htmllint = require('gulp-htmllint')
var gutil = require('gulp-util');

module.exports.add = function() {
    gulp.task('jshint', function(cb) {
        pump([
            gulp.src('./src/js/*.js'),
            jshint(),
            jshint.reporter('jshint-stylish')
        ], cb);
    });

    gulp.task('jshint:watch', function(){
        gulp.watch('./src/js/*.js', ['jshint']);
    });

    gulp.task('sass', function (cb) {
        pump([
            gulp.src('./src/css/global.scss'),
            sourcemaps.init(),
            sass({outputStyle: 'compact'}),
            sourcemaps.write('.'),
            gulp.dest('./build/css')
        ], cb);
    });

    gulp.task('sass:watch', function () {
        gulp.watch('./src/css/*.scss', ['sass']);
    });

    gulp.task('browserify', function(cb) {
        pump([
            browserify('src/js/main.js', { debug: true }).bundle(),
            source('bundle.js'),
            gulp.dest('./build/js')
        ], cb);
    });

    gulp.task('browserify:watch', function() {
        gulp.watch('./src/js/*.js', ['browserify']);
    });

    gulp.task('compressjs', function (cb) {
        pump([
            gulp.src('./build/js/bundle.js'),
            uglify(),
            rename({ suffix: '.min' }),
            gulp.dest('./build/js')
        ], cb);
    });

    gulp.task('compressjs:watch', function() {
        gulp.watch('./build/js/bundle.js', ['compressjs']);
    });

    gulp.task('pug', function (cb) {
        pump([
            gulp.src(['./src/*.pug']),
            pug({ pretty: true }),
            gulp.dest('./build')
        ], cb);
    });

    gulp.task('pug:watch', function() {
        gulp.watch(['./src/*.pug', './src/*/*.pug'], ['pug']);
    });

    gulp.task('bootlint', function() {
        return gulp.src('./build/*.html')
        .pipe(bootlint({
            loglevel: 'warning',
        }));
    });

    gulp.task('bootlint:watch', function() {
        gulp.watch('./build/*.html', ['bootlint']);
    });

    gulp.task('htmllint', function() {
        return gulp.src('./build/*.html')
        .pipe(htmllint({
        }, htmllintReporter));
    });

    gulp.task('htmllint:watch', function() {
        gulp.watch('./build/*.html', ['htmllint']);
    });

    function htmllintReporter(filepath, issues) {
        if (issues.length > 0) {
            issues.forEach(function (issue) {
                if(issue.code == "E011") {
                }
                else {
                    gutil.log(gutil.colors.cyan('[gulp-htmllint] ') + gutil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + gutil.colors.red('(' + issue.code + ') ' + issue.msg));
                }
            });

            process.exitCode = 1;
        }
    }

    gulp.task('copy', ['copy_nexus', 'copy_bower', 'copy_opensans']);

    gulp.task('copy_nexus', function (cb) {
        pump([
            gulp.src(['../nexus/nexusUI/dist/*.js']),
            gulp.dest('./build/js/lib')
        ], cb);
    });

    gulp.task('copy_bower', function (cb) {
        pump([
            gulp.src([
                './bower_components/bootstrap-css/js/bootstrap*.js',
                './bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider*.js',
                './bower_components/jquery/dist/jquery*.js',
                './bower_components/javascript-state-machine/state-machine*.js',
                './bower_components/jq-swipe/dist/jq-swipe*.js',
            ]),
            gulp.dest('./build/js/lib')
        ], cb);
    });

    gulp.task('copy_opensans', ['copy_opensans_css', 'copy_opensans_fonts', 'copy_boostrap_slider', 'copy_boostrap']);

    gulp.task('copy_opensans_css', function (cb) {
        pump([
            gulp.src(['./bower_components/open-sans-fontface/open-sans.css']),
            gulp.dest('./build/css/open-sans'),

        ], cb);
    });

    gulp.task('copy_opensans_fonts', function (cb) {
        pump([
            gulp.src(['./bower_components/open-sans-fontface/fonts/*/*.{ttf,woff,eof,svg,woff2}']),
            gulp.dest('./build/css/open-sans/fonts')
        ], cb);
    });

    gulp.task('copy_boostrap_slider', function (cb) {
        pump([
            gulp.src(['./bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider*.css']),
            gulp.dest('./build/css'),

        ], cb);
    });

    gulp.task('copy_boostrap', function (cb) {
        pump([
            gulp.src(['./bower_components/bootstrap-css/**/*.{js,css,map,ttf,eot,svg,woff,woff2}']),
            gulp.dest('./build/css/bootstrap'),

        ], cb);
    });


    // }
    // },
    // folders: {
    // files: {
    //     '/css/bootstrap/fonts': 'bootstrap-css/fonts',
    //     '/css/open-sans/fonts': 'open-sans-fontface/fonts'
};
