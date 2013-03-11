# grunt-mdfiver

Calculates md5's for cache busting. Pretty automatic, give tags you want to bust as an array (attr is the attribute
containing file path). Suffix is mainly for stuff like require.js modules. The suffix is appended when renaming, and 
removed when injecting bust-string.

Note that this will overwrite the htmlfile, as well as rename the assets it finds, so you better use some place safe.

## Getting Started

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started]

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-mdfiver');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Documentation
```javascript
grunt.initConfig({
    mdfiver: {
        all: {
            htmlfile: "build-dir/index.html",
            basepath: "build-dir/",
            tags: [{tag:"script", attr:"src"}, {tag:"link", attr:"href"}, {tag:"script", attr:"data-main", suffix: ".js"}]
        }
    }
... 
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Juha Heimonen  
Licensed under the MIT license.
