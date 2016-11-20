'use strict';
var fs = require('fs');
var path = require('path');
var gulpIgnore = require('gulp-ignore');

var appendStars = function (str) {
  return [
    str + '**',
    str + '/**'
  ];
};

module.exports = function (gitignorePath) {
  gitignorePath = path.resolve(gitignorePath || '.gitignore');

  var contents = fs.readFileSync(gitignorePath, 'utf8');
  var ignoredFiles = contents.split('\n')
    .map(str => str.trim())
    .filter(Boolean) // ignore empty lines
    .map(appendStars)
    .reduce((m, paths) => m.concat(paths), []);

  return gulpIgnore.exclude(ignoredFiles);
};
