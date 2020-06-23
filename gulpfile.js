var gulp = require("gulp");
var del = require("del");

gulp.task("clean", function() {
  return del(["build", "src/**/*.js", "src/**/*.js.map"]);
});

gulp.task("default", gulp.series("clean"));
