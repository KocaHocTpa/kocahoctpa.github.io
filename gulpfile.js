var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var cmq = require('gulp-group-css-media-queries');
var plumber = require('gulp-plumber');

var browserSync = require('browser-sync').create();


gulp.task('dev', ['compile:desktop','compile:mobile'],function() {
    browserSync.init({
        proxy:{
            target: "http://test.loc",
            proxyReq: [
                function(proxyReq) {
                    proxyReq.setHeader('Cache-Control', 'no-store');
                }
            ]
        },
        notify: false,
        reloadDelay: 1000,
        serveStatic: ['./css']
    });

    gulp.watch('./dev/less/**/*.less', ['compile:desktop', 'compile:mobile']);
    gulp.watch('./dev/less/*.less', ['compile:desktop', 'compile:mobile']);
});

gulp.task('compile:desktop', function () {
    return gulp.src('./dev/less/*.less')
        // .pipe(plumber({
        //     errorHandler: function (err) {
        //         browserSync.notify('Ошибка в компиляции less: <br/>'+'Строка:'+err.lineNumber+'</br>'+err.filename,4000);
        //     }
        // }))
        .pipe(less())
        .pipe(autoprefixer(['last 20 version','safari 5','> 1%','Firefox ESR']))
        // .pipe(cssmin())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.reload({stream:true}));
});
gulp.task('compile:mobile', function () {
    return gulp.src('./dev/less/mobile.less')
        .pipe(plumber({
            errorHandler: function (err) {
                browserSync.notify('Ошибка в компиляции less: <br/>'+'Строка:'+err.lineNumber+'</br>'+err.filename,4000);
            }
        }))
        .pipe(less())
        .pipe(autoprefixer(['last 20 version','safari 5','> 1%','Firefox ESR']))
        // .pipe(cssmin())
        .pipe(cmq())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.reload({stream:true}));
});