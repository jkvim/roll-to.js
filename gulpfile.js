"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream')

gulp.task('sass', () => {
  return gulp.src('./example/index.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./example'))  // 不需要文件名，会生成同名的 CSS 文件
    .pipe(browserSync.stream());
});

gulp.task('build', () => {
  return rollup({
    entry: './index',
    format: 'umd',
    moduleName: 'RollTo',
    globals: {
      rollto: 'RollTo'
    }
  })
    .pipe(source('index.js'))
    .pipe(gulp.dest('./example'));
});

gulp.task('serve', ['sass', 'build'], () => {
  browserSync.init({
    server: "./example"
  });

  gulp.watch('./index.js', ['build']);
  gulp.watch('./example/*.scss', ['sass']);
  gulp.watch('./example/index.html')
    .on('change', browserSync.reload);
});

// depoly to github page
gulp.task('depoly', ['build', 'sass'], () => {
  return gulp.src([
    './example/*'
  ]).pipe(ghPages());
});

gulp.task('default', ['serve']);