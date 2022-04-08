const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');

// const html = () => {
// 	return gulp.src('./src/index.html')
// 		.pipe(gulp.dest('./dest'))
// }

// exports.html = html;

const styles = () => {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./dest'))
}

exports.styles = styles;

const script = () => {
	return gulp.src('./src/script/*.js')
		.pipe(babel({
			presets: ['@babel/env'],
		}))
		.pipe(gulp.dest('./dest'));
}

exports.script = script;

const compile = gulp.series(
	styles,
	script
)

exports.compile = compile;

const watcher = () => {
	gulp.watch('src/**/*', gulp.series('styles', 'script'));
}

exports.watcher = watcher;