# gulp-exclude-gitignore [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

Ever find yourself in a situation where you want to run a gulp plugin against every JavaScript file in your project? You do so, but then it start throwing at all your `node_modules`?

The usual fix is to add negative glob patterns to your `gulp.src()` call. Doesn't this feel verbose and tedious? There is a better way! You already have this list inside your `.gitignore` file, let's just use it.

## Install

```sh
$ npm install --save-dev gulp-exclude-gitignore
```


## Usage

```js
var excludeGitignore = require('gulp-exclude-gitignore');

gulp.src('**/*.js')
  .pipe(excludeGitignore())
  .pipe(jshint());
```

`.gitignore` is used by default. However, you can specify a different file:

```js
gulp.src('**/*.js')
  .pipe(excludeGitignore('custom.gitignore'))
  .pipe(jshint());
```

If you use custom [minimatch][minimatch-url] options in your glob, you can pass those if needed to ensure correct behavior:

```js
gulp.src('**/*.json', {dot: true})
  .pipe(excludeGitignore({dot: true}))
  .pipe(jshint());
```

## API

### excludeGitignore([gitignorePath][, minimatchOptions])

Default export. Excludes all files that are matched by the specified gitignore file.

#### gitignorePath

Optional; defaults to `.gitignore`.

#### minimatchOptions

Optional; defaults to `{}`. These options are passed to [minimatch][minimatch-url].

## License

ISC © [Simon Boudrias](http://simonboudrias.com)


[npm-image]: https://badge.fury.io/js/gulp-exclude-gitignore.svg
[npm-url]: https://npmjs.org/package/gulp-exclude-gitignore
[travis-image]: https://travis-ci.org/SBoudrias/gulp-exclude-gitignore.svg?branch=master
[travis-url]: https://travis-ci.org/SBoudrias/gulp-exclude-gitignore
[daviddm-image]: https://david-dm.org/SBoudrias/gulp-exclude-gitignore.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/SBoudrias/gulp-exclude-gitignore
[coveralls-image]: https://coveralls.io/repos/SBoudrias/gulp-exclude-gitignore/badge.svg
[coveralls-url]: https://coveralls.io/r/SBoudrias/gulp-exclude-gitignore
[minimatch-url]: https://github.com/isaacs/minimatch
