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
            gulp.src('./src/*.pug'),
            pug({
                pretty: true
            }),
            gulp.dest('./build')
        ], cb);
    });

    gulp.task('pug:watch', function() {
        gulp.watch('./src/*/*.pug', ['pug']);
    });
};
