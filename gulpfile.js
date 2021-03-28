const { src, dest, series, watch } = require("gulp");

const sass = require("gulp-sass"),
  csso = require("gulp-csso"),
  include = require("gulp-file-include"),
  htmlmin = require("gulp-htmlmin"),
  del = require("del"),
  sync = require("browser-sync").create(),
  concat = require("gulp-concat"),
  autoprefixer = require("gulp-autoprefixer"),
  groupMedia = require('gulp-group-css-media-queries'),
  jsmin = require("gulp-minify");



function html() {
  return src("src/**.html")
    .pipe(include({
      prefix: "@@"
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest("dist"));
}


function WebScss() {
  del("dist/*.css")
  return src("src/scss/main.scss")
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ["last 4 versions"]
    }))

    .pipe(csso())
    .pipe(concat("style.css"))
    .pipe(dest("dist/style"));
}


// minify js
function js() {
  return src("src/js**/*.js")
    .pipe(jsmin())
    .pipe(dest("dist"));

}

function others() {
  return src("src/others/**")
    .pipe(dest("dist"));

}

function clear() {
  return del("dist");
}

function serve() {
  sync.init({
    server: "./dist",
  });
  // watch("src/others/**/*", series(others).on("change", sync.reload))
  watch("src/**/*.html", series(html)).on("change", sync.reload)
  watch("src/**/*.js", series(js)).on("change", sync.reload)
  watch("src/scss/**/*.scss", series(WebScss)).on("change", sync.reload)

}


exports.build = series(clear, WebScss, js, others, html)
exports.serve = series(clear, WebScss, js, others, html, serve)
exports.clear = clear;