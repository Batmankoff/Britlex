const {
  src,
  dest,
  watch,
  parallel,
  series
} = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const livereload = require('gulp-livereload');
const nunjucksRender = require('gulp-nunjucks-render');
const del = require('del');
const browserSync = require('browser-sync').create();


function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/"
    },
    notify: false
  })

}

function nunjucks() {
  return src('app/*.njk')
    .pipe(nunjucksRender())
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}


function styles() {
  return src("app/scss/*.scss")
    .pipe(scss({
      outputStyle: "compressed"
    }))
    // .pipe(concat())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
      "node_modules/jquery/dist/jquery.js",
      "app/js/main.js"
    ])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function images() {
  return src('app/images/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(dest('dist/images'))
}

function build() {
  return src([
      'app/**/*.html',
      '!app/module/**/*.html',
      'app/css/*.css',
      'app/js/main.min.js'
    ], {
      base: 'app'
    })
    .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(["app/**/*.scss"], styles);
  watch(['app/*.njk'], nunjucks);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
  watch(['app/module/**/*.html'], nunjucks);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.livereload = livereload;
exports.nunjucks = nunjucks;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);

exports.default = parallel(nunjucks, styles, scripts, browsersync, watching);