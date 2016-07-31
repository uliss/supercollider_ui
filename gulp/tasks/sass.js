var gulp = require('gulp');
var sass = require('gulp-sass');

// gulp.task('sass:watch', function () {
//     gulp.watch('./sass/**/*.scss', ['sass']);
// });

module.export = function () {
    return gulp.src('./src/global.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
};
