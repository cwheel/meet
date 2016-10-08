'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const server = require('gulp-develop-server');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('buildReact', function () {
	return browserify({entries: './client/index.jsx', extensions: ['.jsx', '.js'], debug: true})
    	.transform('babelify', {presets: ['es2015', 'react']})
    	.bundle()
    	.pipe(source('bundle.js'))
    	.pipe(gulp.dest('dist'))
});

gulp.task('buildHTML', function() {
	return gulp.src('client/index.html')
       .pipe(gulp.dest('dist'));
});

gulp.task('buildSASS', function() {
	return gulp.src('client/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(cssnano(), {mergeIdents: false})
		.pipe(autoprefixer())
		.pipe(concat('bundle.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'))
});

gulp.task('server', function() {
	server.listen({path: 'server/server.js'});
});

gulp.task('watch', function () {
	gulp.watch(['client/**/*.jsx', 'client/**/*.js', '!client/dist/*'], ['buildReact']);
	gulp.watch('client/index.html', ['buildHTML']);
	gulp.watch('client/**/*.scss', ['buildSASS']);
	gulp.watch(['**/*.js', '!client/**/*', '!node_modules/**/*'], server.restart);
});

gulp.task('default', ['buildHTML', 'buildReact', 'buildSASS', 'server', 'watch']);
