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

// ------------------------------------------------------------------------------
// PATHS
// ------------------------------------------------------------------------------

const PROJECT_PATH      = `${__dirname}${Config.paths.projectPath}`;

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
        .pipe(Gulp.dest(CSS_PATH));
});

Gulp.task('watch:less', ['less'], function() {
    Gulp.watch(LESS_PATH + '/**/*.less', ['less']);
});
// ------------------------------------------------------------------------------
// DEFAULT TASK
// ------------------------------------------------------------------------------

Gulp.task('default', ['watch:less']);