/**
 * Gulp Modules
 */
const gulp          = require('gulp'),
      plumber       = require('gulp-plumber'),
      newer         = require('gulp-newer'),
      imagemin      = require('gulp-imagemin'),
      uglify        = require('gulp-uglify'),
      jshint        = require('gulp-jshint'),
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      handlebars    = require('gulp-compile-handlebars'),
      rename        = require('gulp-rename'),
      sourcemaps    = require('gulp-sourcemaps'),
      include       = require("gulp-include"),
      notify        = require('gulp-notify'),
      gls           = require('gulp-live-server'),

      // folder ref
      folder = {
        src: 'src/',
        build: 'dist/'
      },
      imgSrc = folder.src + '/*/assets/images/**/*',
      cssSrc = folder.src + '/*/assets/css/*.scss',
      jsSrc = folder.src + '/*/assets/js/app.js',
      commonSrc = folder.src + 'common/';

const PORT = 8888;

/**
 * Compress Images
 */
gulp.task('images', () => {

  return gulp.src(imgSrc)
    .pipe(newer(folder.build))
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(folder.build));
});

/**
 * SCSS / CSS
 */
gulp.task('scss', () => {

  var onError = function(err) {
    notify.onError({
      title:    "CSS Error",
      subtitle: "Nah Bruv!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
    })(err);

    this.emit('end');
  };

  return gulp.src(cssSrc)
  .pipe(plumber({errorHandler: onError}))
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed',
    imagePath: 'assets/images/',
    precision: 3,
    errLogToConsole: true,
    autoprefixer: {add: true},
  }))
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(rename({
    suffix: '.min' }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(folder.build));
});

/**
 * JavaScript
 */
gulp.task('js', () => {

  var onError = function(err) {
    notify.onError({
      title:    "JS Error",
      subtitle: "Nah Bruv!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
    })(err);

    this.emit('end');
  };

  return gulp.src(jsSrc)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(include())
    .pipe (uglify ({
      mangle: true,
      compress: true,
      output: { beautify: false }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(folder.build));
});

/**
 * Jquery
 */
gulp.task('jquery', () => {

  return gulp.src(commonSrc + 'js/jquery.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(rename({
      dirname: 'common/js',
      suffix: '.min'
    }))
    .pipe(gulp.dest(folder.build));
});

/**
 * JS Hint
 */
gulp.task('jshint', () => {
  var onError = function(err) {
    notify.onError({
      title:    "JS Error",
      subtitle: "JS Hint!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
    })(err);

    this.emit('end');
  };
  gulp.src(jsSrc)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(plumber({errorHandler: onError}));
});

 /**
  * Handlebars Partials
  */
 gulp.task('hbs', () => {

   return gulp.src('./src/*/*.hbs')
     .pipe(handlebars({}, {
       ignorePartials: true,
       batch: ['./src/common/partials']
     }))
     .pipe(rename({
       extname: '.html'
     }))
     .pipe(gulp.dest(folder.build));
 });


/**
 * Live Server at port:
 */
gulp.task('serve', function() {
  var server = gls.static(folder.build, PORT);
  server.start();
});

/**
 * Runner
 */
gulp.task('run', ['images', 'hbs', 'scss', 'jquery', 'js', 'jshint', 'serve']);

/**
 * Watcher
 */
gulp.task('watch', function() {
  gulp.watch(folder.src + 'assets/images/**/*', ['images']);
  gulp.watch(folder.src + 'assets/css/**/*', ['scss']);
  gulp.watch(folder.src + 'assets/js/**/*', ['js']);
  gulp.watch(folder.src + '**/*', ['hbs']);
  gulp.watch(folder.src + '**/*.html', ['serve'], function (file) {
    server.notify.apply(server, [file]);
  });
});

/**
 * Gulp Go Go Go
 */
gulp.task('default', ['run', 'watch']);
