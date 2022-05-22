const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const browserSync = require("browser-sync").create();

function buildStyles() {
    return src("./src/**/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(dest("./build/"))
        .pipe(browserSync.stream());
}

function buildHtml() {
    return src("./src/*.html").pipe(dest("./build/")).pipe(browserSync.stream());
}

function buildJS() {
    return src("./src/**/*.js")
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(dest("./build/js"))
        .pipe(browserSync.stream());
}

function buildProdLibsJS() {
    return src(["./node_modules/jquery/dist/jquery.min.js", "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"])
        .pipe(concat("build-plugins.js"))
        .pipe(uglify())
        .pipe(dest("./build/js/"));
}
function buildProdLibsCSS() {
    return src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
        .pipe(cleanCSS())
        .pipe(dest("./build/css/bootstrap"));
}

function clean() {
    return del("./build/");
}

function startBrowserSync() {
    browserSync.init({
        server: "./build/",
    });

    watch("./src/**/*.scss", buildStyles);
    watch("./src/**/*.js", buildJS);
    watch("./src/*.html", buildHtml);
}

const buildLibs = series(buildProdLibsJS, buildProdLibsCSS);
const build = series(buildHtml, buildStyles, buildJS, buildLibs);

exports.clean = clean;
exports.buildLibs = buildLibs;
exports.build = build;
exports.start = series(clean, build, startBrowserSync);
