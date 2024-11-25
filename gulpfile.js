// Variable
var {src, dest, ...gulp} = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    terser = require('gulp-terser');
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass')(require('sass'));
    header = require('gulp-header');

const srcPath = 'package/src'
const distPath = 'package/dist';

// Gulp-SAAS
gulp.task('sass', function () {
    return src([`${srcPath}/sass/style.scss`])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(dest(`${distPath}/css`)) // concatinated css file
        .pipe(concat('style.min.css')) // concatinated css file sass/style.scss
        .pipe(minifyCSS({processImport: false}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${distPath}/css`)) // minified css file css/style.min.css
        // .pipe(browserSync.reload({
        //     stream: true // watched by BrowserSync
        // }))
});

gulp.task('responsive', function () {
    return src([`${srcPath}/sass/responsive.scss`])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(dest(`${distPath}/css`)) // concatinated css file
        .pipe(concat('responsive.min.css')) // concatinated css file sass/style.scss
        .pipe(minifyCSS({processImport: false}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${distPath}/css`)) // minified css file css/style.min.css
        // .pipe(browserSync.reload({
        //     stream: true // watched by BrowserSync
        // }))
});

gulp.task('icon', function () {
    return src(`${srcPath}/sass/icon/icon.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(dest(`${distPath}/css`)) // concatinated css file
        .pipe(concat('icon.min.css')) // concatinated css file sass/style.scss
        .pipe(minifyCSS({processImport: false}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${distPath}/css`)) // minified css file css/style.min.css
        // .pipe(browserSync.reload({
        //     stream: true // watched by BrowserSync
        // }))
});

gulp.task('vendors', function () {
    return src(`${srcPath}/sass/vendors/**/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(dest(`${distPath}/css`)) // concatinated css file
        .pipe(concat('vendors.min.css')) // concatinated css file sass/style.scss
        .pipe(minifyCSS({processImport: false}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${distPath}/css`)) // minified css file css/style.min.css
        // .pipe(browserSync.reload({
        //     stream: true // watched by BrowserSync
        // }))
});

// Gulp-concat & gulp-terser
gulp.task('concat-vendors', function () {
    src([
        `${srcPath}/js/vendors/*.js`
    ])
        .pipe(concat('vendors.js')) // concatinated js file
        .pipe(dest(`${distPath}/js`)); // js/vendors.js

    src([
        `${srcPath}/js/vendors/*.js`
    ])
        .pipe(concat('vendors.min.js'))
        .pipe(terser({output: {comments: /^!/}})) // minified js file js/vendors.min.js
        .pipe(dest(`${distPath}/js`)); // js/vendors.min.js
});

// Gulp-concat & gulp-terser
gulp.task('js-other', function () {
    src([
        `${srcPath}/js/jquery.js`
    ])
        .pipe(concat('jquery.js')) // concatinated js file
        .pipe(dest(`${distPath}/js`)); // js/vendors.js
    src([
        `${srcPath}/js/main.js`
    ])
        .pipe(concat('main.js')) // concatinated js file
        .pipe(dest(`${distPath}/js`)); // js/vendors.js
});

// // Browser sync
// gulp.task('browserSync', function () {
//     browserSync.init({
//         watchTask: true,
//         online: true,
//         server: {
//             baseDir: './${distPath}'
//         }
//     });
// });


// // Đường dẫn nguồn và đích
// const paths = {
//     src: './src/css/**/*.css', // Thư mục chứa file CSS
//     dest: `./${dist}/css/`        // Thư mục đích
// };
//
// // Task sao chép file CSS
// gulp.task('copy-css', function () {
//     return src(paths.src)
//         .pipe(sourcemaps.init())             // Khởi tạo sourcemaps (nếu cần)
//         .pipe(cleanCSS({compatibility: '*'})) // Tối ưu CSS
//         .pipe(sourcemaps.write('./'))        // Viết sourcemaps vào thư mục đích
//         .pipe(dest(paths.dest));        // Sao chép file vào thư mục đích
// });


// Gulp watch
gulp.task('default', gulp.parallel( 'sass', 'icon', 'vendors', 'concat-vendors', 'responsive','js-other', function (done) {
    // gulp.watch(`${srcPath}/sass/**/*.scss`).on('change', gulp.series('sass'));
    // gulp.watch(`${srcPath}/sass/icon/*.scss`).on('change', gulp.series('icon'));
    // gulp.watch(`${srcPath}/sass/vendors/**/*.scss`).on('change', gulp.series('vendors'));
    // gulp.watch(`${srcPath}/js/vendors/*.js`).on('change', gulp.series('concat-vendors'));
    // gulp.watch([`${srcPath}/sass/theme-responsive/**/*.scss`, 'src/sass/responsive.scss']).on('change', gulp.series('responsive'));
    done()
}))