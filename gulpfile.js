'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('my-scripts.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts:watch', function () {
  gulp.watch('./src/js/*.js', ['scripts']);
});

gulp.task('imagemin', () =>
    gulp.src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
);

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['imagemin', 'sass', 'sass:watch', 'scripts', 'scripts:watch', 'browser-sync']);

// autoprefixer gulp, imagemin gulp
