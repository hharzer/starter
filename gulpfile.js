var gulp = require('gulp');
var RpmBuilder = require('@com.eaiti.build.rpm/gulp-rpm');
var rpm = new RpmBuilder();
gulp.task('rpm-build', rpm.task());
