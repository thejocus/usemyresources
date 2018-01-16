'use strict';

// ------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------

const Config            = require('package.json');

const Gulp              = require('gulp');
const Less              = require('gulp-less');
const PixRem            = require('gulp-pixrem');
const CombineMq         = require('gulp-combine-mq');
const Cache             = require('gulp-cached');
const Filter            = require('gulp-filter');
const Notify            = require('gulp-notify');
const Progeny           = require('gulp-progeny');
const AutoPrefixer      = require('gulp-autoprefixer');
const CleanCss          = require('gulp-clean-css');
const Rename            = require('gulp-rename');
const GulpConnect       = require('gulp-connect');
const GulpConnectSsi    = require('gulp-connect-ssi');
const Mjml              = require('gulp-mjml');

// ------------------------------------------------------------------------------
// PATHS
// ------------------------------------------------------------------------------

const FLATBUILD_PATH    = `${__dirname}${Config.paths.flatbuildPath}`;

const PROJECT_PATH      = `${__dirname}${Config.paths.projectPath}`;
const RESOURCES_PATH    = `${__dirname}${Config.paths.resourcesPath}`;

// ------------------------------------------------------------------------------
// LESS WATCH AND COMPILATION
// ------------------------------------------------------------------------------

const LESS_PATH         = `${__dirname}${Config.paths.lessPath}`;
const CSS_PATH          = `${__dirname}${Config.paths.cssPath}`;

Gulp.task('less', function() {
    return Gulp.src(LESS_PATH + '/**/*.less')
        .pipe(Cache('less'))
        .pipe(Progeny({
            regexp: /^\s*@import\s*(?:\(\w+\)\s*)?['"]([^'"]+)['"]/
        }))
        .pipe(Filter(['**/*.less', '!**/_*.less']))
        .pipe(Less()).on('error', Notify.onError(function(err) {
            return 'Error compiling less: ' + err.message;
        }))
        .pipe(AutoPrefixer({
            browsers: ['ie >= 11',
                       'edge >= 13',
                       'chrome >= 58',
                       'ff >= 54',
                       'safari >= 9',
                       'ios >= 9',
                       'samsung >= 5']
        }))
        .pipe(CombineMq({
            beautify: false
        }))
        .pipe(CleanCss({
            keepSpecialComments: '0'
        }))
        .pipe(Gulp.dest(CSS_PATH))
        .pipe(GulpConnect.reload());
});

Gulp.task('watch:less', ['less'], function() {
    Gulp.watch(LESS_PATH + '/**/*.less', ['less']);
});

// ------------------------------------------------------------------------------
// MJML COMPILATION
// ------------------------------------------------------------------------------

const MJML_PATH             = `${__dirname}${Config.paths.mjmlPath}`;
const MJML_COMPILED_PATH    = `${__dirname}${Config.paths.mjmlCompiledPath}`;

Gulp.task('mjml', function() {
    return Gulp.src(MJML_PATH + '/**/*.mjml')
        .pipe(Mjml())
        .pipe(Gulp.dest(MJML_COMPILED_PATH));
});

Gulp.task('watch:mjml', ['mjml'], function() {
    return Gulp.watch([MJML_PATH + '/**/*.mjml'], ['mjml']);
});

// ------------------------------------------------------------------------------
// FLATBULD SERVER AND HTML WATCH
// ------------------------------------------------------------------------------

Gulp.task('html', function () {
    Gulp.src(FLATBUILD_PATH + '**/*.html')
        .pipe(GulpConnect.reload());
});

Gulp.task('serve:flat', ['less'], function() {
    GulpConnect.server({
        root: FLATBUILD_PATH,
        port: 2500,
        livereload: true,
        middleware: function(){
            return [GulpConnectSsi({
                baseDir: FLATBUILD_PATH,
                ext: '.html',
                method: 'readLocal'
            })];
        }
    });
    Gulp.watch(LESS_PATH + '/**/*.less', ['less']);
    Gulp.watch(FLATBUILD_PATH + '/**/*.html', ['html']);
});

// ------------------------------------------------------------------------------
// DEFAULT TASK
// ------------------------------------------------------------------------------

Gulp.task('default', ['watch:less']);