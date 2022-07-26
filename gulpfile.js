const gulp = require('gulp'),
		sass = require('gulp-sass')(require('sass')),
		browserSync = require('browser-sync'),
		csso = require('gulp-csso'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		del = require('del'),
		pug = require('gulp-pug'),
		plumber = require('gulp-plumber'),
		size = require('gulp-size'),
		purgecss = require('gulp-purgecss'),
		sourcemaps = require('gulp-sourcemaps'),
		ts = require("gulp-typescript"),
		autoprefixer = require('gulp-autoprefixer');

const tsProject = ts.createProject('tsconfig.json');

const dirs = {
	src: 'src/',
	build: 'dist/',
	ftp: ''
};

let path = {
	src: {
		css: dirs.src + 'css/',
		sass: dirs.src + 'sass/',
		js: dirs.src + 'ts/',
		pug: dirs.src + 'pug/',
		img: dirs.src + 'img/',
		imgAssets: dirs.src + 'img/assets/',
		fonts: dirs.src + 'fonts/'
	},
	build: {
		css: dirs.build + 'css/',
		js: dirs.build + 'js/',
		img: dirs.build + 'img/',
		fonts: dirs.build + 'fonts/'
	}
};

const files = {
	styles: '**/*.{scss,css}',
	js: '**/*.{js,ts}',
	pug: '**/*.pug',
	img: '*.{png,jpg,svg,webp}',
	html: '**/*.html',
	all: '**/*'
};

path = Object.assign({
	watch: {
		styles: [
			path.src.fonts + '*.{scss,css}',
			path.src.sass + files.styles
		],
		html: dirs.src + files.html,
		pug: dirs.src + files.pug,
		js: [
      path.src.js + files.js,
		]
	}
}, path);

const servConfig = {
	server: {
		baseDir: 'dist'
	},
	notify: false,
	open: false
};

const sizeConfig = {
	gzip: true,
	brotli: true,
	pretty: false,
	showFiles: true
};

const purgeCssConfig = {
	content: [
		dirs.src + files.html,
		path.src.js + files.js,
	],
	defaultExtractor: content => content.match(/[a-zA-Z0-9\-_:;.@,*+!\[\]\/]+/g) || [],
};

gulp.task('style', function(){
	return gulp.src(path.src.sass + '*.scss', {allowEmpty: true})
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			includePaths: [
				'node_modules',
			],
			outputStyle: 'expanded',
			indentWidth: 1
		}))
		.pipe(autoprefixer({
			cascade: false,
			flexbox: false
		}))
		.pipe(gulp.dest(path.src.css))
		.pipe(purgecss(purgeCssConfig))
		.pipe(csso({
			forceMediaMerge: true
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(size(sizeConfig))
		.pipe(gulp.dest(path.build.css))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(path.src.css))
		.pipe(browserSync.stream());
});

gulp.task('css-update', function(){
	return gulp.src([
		path.src.css + '*.css',
		'!' + path.src.css + '*.min.css'
	])
		.pipe(purgecss(purgeCssConfig))
		.pipe(csso({
			forceMediaMerge: true
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.build.css))
		.pipe(size(sizeConfig))
		.pipe(gulp.dest(path.src.css))
});

gulp.task('scripts', () => compileJs(path.watch.js));

function compileJs(sources) {
  return gulp.src(sources, {allowEmpty: true})
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(uglify())
    .pipe(size(sizeConfig))
    .pipe(gulp.dest(path.build.js))
    .pipe(sourcemaps.write(''))
		.pipe(browserSync.stream());
};

gulp.task('server', function(){
	browserSync(servConfig);
});

gulp.task('html', function(){
	return gulp.src(dirs.src + files.html, {allowEmpty: true})
		.pipe(size(sizeConfig))
		.pipe(gulp.dest(dirs.build))
		.pipe(browserSync.stream());
});

gulp.task('pug', function(){
	return gulp.src(path.src.pug + '*.pug', {allowEmpty: true})
		.pipe(plumber())
		.pipe(pug({'pretty': '\t'}))
		.pipe(gulp.dest(dirs.src))
		.pipe(gulp.dest(dirs.build));
});

gulp.task('compile', gulp.series('style', 'pug', 'scripts', 'css-update'));

gulp.task('default', gulp.parallel('compile', 'server', function(){
	gulp.watch(path.watch.styles, gulp.series('style'));
	gulp.watch(path.watch.pug, gulp.series('pug'));
	gulp.watch(path.watch.html, gulp.parallel('html', 'css-update'));

  gulp
    .watch(path.watch.js, gulp.parallel('css-update'))
    .on('change', compileJs);
}));

gulp.task('clear', function(cb){
	del.sync(dirs.build);
	cb();
});

gulp.task('build', gulp.series('clear', 'compile', 'html', function(){
	return gulp.src([
		'!'+path.src.fonts + '*.{scss,css}',
		path.src.fonts + files.all
	], {allowEmpty: true})
		.pipe(gulp.dest(path.build.fonts));
}));
