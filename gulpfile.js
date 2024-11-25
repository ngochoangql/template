// Variable
var {src, dest, ...gulp} = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    terser = require('gulp-terser');
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass')(require('sass'));
    header = require('gulp-header');
const yargs = require('yargs'); // Import yargs

const argv = yargs.argv;
const distPath = argv.dist || 'dist'; // Nếu không có tham số --dist, sẽ sử dụng 'dist' làm giá trị mặc định
const srcPath ='src'; // Nếu không có tham số --dist, sẽ sử dụng 'dist' làm giá trị mặc định


gulp.task('styles', function () {
    return src([
        `${srcPath}/sass/style.scss`,        // File Sass chính
        `${srcPath}/sass/responsive.scss`,   // File Sass cho responsive
        `${srcPath}/sass/icon/icon.scss`,    // File Sass cho icon
        `${srcPath}/sass/vendors/**/*.scss` // Các file Sass của vendors
    ])
        .pipe(sourcemaps.init()) // Khởi tạo sourcemaps
        .pipe(sass().on('error', sass.logError)) // Biên dịch Sass thành CSS
        .pipe(concat('bundle.min.css'))
        .pipe(minifyCSS({ processImport: false })) // Minify CSS
        .pipe(sourcemaps.write('.')) // Ghi sourcemap
        .pipe(dest(`${distPath}/css`)); // Lưu file CSS đã kết hợp vào dist/css
});



// Gulp-concat & gulp-terser
gulp.task('js', function () {
    return src([
        `${srcPath}/js/vendors/*.js`,
        `${srcPath}/js/jquery.js`,
        `${srcPath}/js/main.js`,

    ])
        .pipe(concat('bundle.js')) // concatinated js file
        .pipe(dest(`${distPath}/js`)) // js/vendors.js
        .pipe(concat('bundle.min.js'))
        .pipe(terser({output: {comments: /^!/}})) // minified js file js/vendors.min.js
        .pipe(dest(`${distPath}/js`)); // js/vendors.min.js
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
gulp.task('default', gulp.parallel(  'js', 'styles', function (done) {
    // gulp.watch(`${srcPath}/sass/**/*.scss`).on('change', gulp.series('sass'));
    // gulp.watch(`${srcPath}/sass/icon/*.scss`).on('change', gulp.series('icon'));
    // gulp.watch(`${srcPath}/sass/vendors/**/*.scss`).on('change', gulp.series('vendors'));
    // gulp.watch(`${srcPath}/js/vendors/*.js`).on('change', gulp.series('concat-vendors'));
    // gulp.watch([`${srcPath}/sass/theme-responsive/**/*.scss`, 'src/sass/responsive.scss']).on('change', gulp.series('responsive'));
    done()
}))