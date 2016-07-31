var gulp = require('gulp');
var tasks = require('./gulp');

tasks.add();

gulp.task('build', ['jshint', 'browserify', 'compressjs', 'sass', 'pug']);
gulp.task('default', ['build', 'watch']);
gulp.task('watch', ['jshint:watch', 'sass:watch', 'browserify:watch', 'compressjs:watch', 'pug:watch']);
