[![Travis-CI](https://travis-ci.org/Skelware/node-asset-compress.svg?branch=master)](https://travis-ci.org/Skelware/node-asset-compress) [![Code Climate](https://codeclimate.com/github/Skelware/node-asset-compress/badges/gpa.svg)](https://codeclimate.com/github/Skelware/node-asset-compress/issues) [![Test Coverage](https://codeclimate.com/github/Skelware/node-asset-compress/badges/coverage.svg)](https://codeclimate.com/github/Skelware/node-asset-compress/coverage)

# Node Asset Compress
This library is not intended to be used without a task runner such as Grunt or Gulp, but can certainly be used if you so desire. If you use Grunt, you can use the [grunt-asset-compress](https://www.npmjs.com/package/grunt-asset-compress) package instead.

As your configuration file grows, it becomes harder and harder to assert the integrity of the file. To conquer this, we developed this simple package based on [node-file-parser](https://www.npmjs.com/package/node-file-parser) to perform multiple checks on your `asset_compress.ini`.

Automatic fixing is supported for simple conflicts, and is completely optional. Likewise, you can also choose to clean up your configuration file with this library quite easily!

## Table of contents
* Node File Parser
 * [Getting Started](#getting-started)
 * [Contributing](#contributing)
 * [Versioning](#versioning)

## Getting Started
The first step is to make the library aware of the location of your `asset_compress.ini`. To do this, you will be using the `link` function defined in `NodeAssetCompress`.
* The filename must be an exact match of `asset_compress.ini`;
* The file is not read (or written to) instantly, and thus the link can be made at any point of execution.

```javascript
var NodeAssetCompress = require('node-asset-compress');

var file_url = './foo/asset_compress.ini';
var file = NodeAssetCompress.link(file_url);
```

You can then choose to either check the file for issues, or to clean the file. In this case, we're going to clean the file first.
* Cleaning the file removes all comments, empty lines and unneeded whitespace;
* Cleaning the file is not mandatory for the issue checking to work, it is just for aesthetics.

```javascript
var NodeAssetCompress = require('node-asset-compress');

var file_url = './foo/asset_compress.ini';
var file = NodeAssetCompress.link(file_url).clean();
```

Now is the time to perform tests on the file, note that there's a lot of ways to enter data and there's even more data coming back. For exact implementation details please refer to the documentation.
```javascript
var result = file.check({
    'domain.com/': ['default.js', 'events.js', 'puppies.js'],
    'domain.com/calendar': ['calendar.js', 'events.js'],
    'domain.com/something': ['default.js', 'calendar.js', 'puppies.js']
});
```
The sections provided will be checked individually for internal conflicts (`single`) and will also be checked against each other (but only to the ones they are paired with) for conflicts as a group (`multiple`). The result can be inspected and further action can then be taken accordingly by fixing the file, or not.
```javascript
file.fix({
    single: true,
    multiple: false
});
```
## Contributing
Whether you're a programmer or not, all contributions are very welcome! You could add features, improve existing features or request new features. Assuming the unit tests cover all worst-case scenarios, you will not be able to report bugs because there will be no bugs.

If you want to make changes to the source, you should fork this repository and create a pull-request to our master branch. Make sure that each individual commit does not break the functionality, and contains new unit tests for the changes you make.

To test your changes locally, run `npm install` followed by `npm test`. All files that you added or changed must have score 100% coverage in its statements, branches, functions and lines. You will also have to [sign](https://www.clahub.com/agreements/Skelware/node-asset-compress) the [Contributor License Agreement](https://www.clahub.com/pages/why_cla), which will take a minute of your time but ensures that neither of us will sue the other.

## Versioning
As much as we want everyone to always use the latest version, we know that this is a utopia. Therefore, we adhere to a strict versioning system that is widely accepted: `major.minor.patch`. This is also known as the [SemVer](http://semver.org/spec/v2.0.0.html) method.
