'use strict'

//
// VARS
//
const gulp = require('gulp'),
    nameDeps = require('app-name'),
    loadDeps = require('load-deps'),
    camelCase = require('camelcase'),
    stripDeps = ['gulp'],
    renameDeps = function renameFn (name) {
        return camelCase(nameDeps(name, stripDeps))
    },
    $ = loadDeps('*', {
        renameKey: renameDeps
    }),
    app = {
        name: 'esrijs'
    },
    paths = {
        development: 'src',
        production: 'dist'
    },
    files = {
        js: {
            src: `${paths.development}/index.js`,
            dest: `${paths.production}/`,
            development: `${paths.development}/`,
            production: `${paths.production}/${app.name}.min.js`
        }
    }

//
// WATCHERS
//
gulp.task('watch', () => {
    gulp.watch([files.js.development], file => {
        $.runSequence('make:js')
    })
})

//
// TASKS
//
gulp.task('make:js', function (cb) {
    $.pump([
        gulp.src(files.js.src),
        $.sourcemaps.init(),
        $.babel({
            presets: ['es2015'],
            comments: false,
            minified: true
        }),
        $.rename(function (path) {
            path.basename = `${app.name}.min`
        }),
        $.jsvalidate(),
        $.sourcemaps.write('.'),
        gulp.dest(files.js.dest)
    ], cb)
})

//
// BUILD
//
gulp.task('default', ['make'])

gulp.task('make', function () {
    $.runSequence('make:js')
})
