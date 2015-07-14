'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var excludeGitignore = require('../lib');

var fullpath = function (filepath) {
  return path.join(process.cwd(), filepath);
};

var fakeFile = function (filepath) {
  return {
    path: fullpath(filepath),
    contents: new Buffer('whatever')
  };
};

describe('gulp-exclude-gitignore', function () {
  beforeEach(function () {
    this.stub = sinon.stub(fs, 'readFileSync');

    var contents = [
      'foo/',
      'bar   ',
      '',
      '  ',
      'b.txt'
    ].join('\n');

    this.stub.withArgs(fullpath('.gitignore'), 'utf8').returns(contents);
    this.stub.withArgs('custom.gitignore', 'utf8').returns('bar\n');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('excludes files contained in .gitignore', function (done) {
    var stream = excludeGitignore();

    var filePaths = [];
    stream.on('data', function (file) {
      filePaths.push(file.path);
    });

    stream.on('finish', function () {
      assert.deepEqual(filePaths, [
        fullpath('a.txt'),
        fullpath('foo'),
        fullpath('c.txt'),
        fullpath('c.txt/d.txt')
      ]);
      done();
    });

    stream.write(fakeFile('a.txt'));
    stream.write(fakeFile('b.txt'));
    stream.write(fakeFile('foo'));
    stream.write(fakeFile('foo/c.txt'));
    stream.write(fakeFile('bar/c.txt'));
    stream.write(fakeFile('c.txt'));
    stream.write(fakeFile('c.txt/d.txt'));
    stream.end();
  });

  it('excludes files contained in the provided file', function (done) {
    var stream = excludeGitignore('custom.gitignore');

    var filePaths = [];
    stream.on('data', function (file) {
      filePaths.push(file.path);
    });

    stream.on('finish', function () {
      assert.deepEqual(filePaths, [
        fullpath('a.txt'),
        fullpath('b.txt')
      ]);
      done();
    });

    stream.write(fakeFile('a.txt'));
    stream.write(fakeFile('b.txt'));
    stream.write(fakeFile('bar/c.txt'));
    stream.end();
  });
});
