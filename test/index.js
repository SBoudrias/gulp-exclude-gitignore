'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var excludeGitignore = require('..');

var fakeFile = function (filepath) {
  return {
    relative: filepath,
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

    this.stub.withArgs(path.resolve('.gitignore'), 'utf8').returns(contents);
    this.stub.withArgs(path.resolve('custom.gitignore'), 'utf8').returns('bar\n');
    this.stub.withArgs(path.resolve('sub/.gitignore'), 'utf8').returns('a.txt\n');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('excludes files contained in .gitignore', function (done) {
    var stream = excludeGitignore();

    var filePaths = [];
    stream.on('data', function (file) {
      filePaths.push(file.relative);
    });

    stream.on('finish', function () {
      assert.deepEqual(filePaths, [
        'a.txt',
        'foo',
        'c.txt',
        'c.txt/d.txt'
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

  it('excludes dot files contained in .gitignore', function (done) {
    var stream = excludeGitignore();

    var filePaths = [];
    stream.on('data', function (file) {
      filePaths.push(file.relative);
    });

    stream.on('finish', function () {
      assert.deepEqual(filePaths, [
        '.a.txt',
        'baz/.e.txt',
        'baz/f.txt'
      ]);
      done();
    });

    stream.write(fakeFile('.a.txt'));
    stream.write(fakeFile('b.txt'));
    stream.write(fakeFile('foo/.c.txt'));
    stream.write(fakeFile('foo/d.txt'));
    stream.write(fakeFile('baz/.e.txt'));
    stream.write(fakeFile('baz/f.txt'));
    stream.end();
  });

  it('excludes files contained in the provided file', function (done) {
    var stream = excludeGitignore('custom.gitignore');

    var filePaths = [];
    stream.on('data', function (file) {
      filePaths.push(file.relative);
    });

    stream.on('finish', function () {
      assert.deepEqual(filePaths, [
        'a.txt',
        'b.txt'
      ]);
      done();
    });

    stream.write(fakeFile('a.txt'));
    stream.write(fakeFile('b.txt'));
    stream.write(fakeFile('bar/c.txt'));
    stream.end();
  });

  it('correctly account for nested .gitignore', function (done) {
    var stream = excludeGitignore('sub/.gitignore');

    var filePaths = [];
    stream.on('data', function (file) {
      filePaths.push(file.relative);
    });

    stream.on('finish', function () {
      assert.deepEqual(filePaths, ['a.txt']);
      done();
    });

    stream.write(fakeFile('a.txt'));
    stream.write(fakeFile('sub/a.txt'));
    stream.end();
  });
});
