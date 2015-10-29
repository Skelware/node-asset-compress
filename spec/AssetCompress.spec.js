var AC = require('../src/AssetCompress');
var NAC = require('../src/NodeAssetCompress');
var NFP = require('node-file-parser');

describe('AssetCompress', function() {

    var asset_1 = 'data/1/asset_compress.ini';

    it('should contain a "clean" function', function() {
        var asset = NAC.link(asset_1);
        expect(AC.clean).toBeUndefined();
        expect(typeof asset.clean).toEqual('function');
    });

    it('should contain a "check" function', function() {
        var asset = NAC.link(asset_1);
        expect(AC.check).toBeUndefined();
        expect(typeof asset.check).toEqual('function');
    });

    it('should contain a "fix" function', function() {
        var asset = NAC.link(asset_1);
        expect(AC.fix).toBeUndefined();
        expect(typeof asset.fix).toEqual('function');
    });
});

describe('AssetCompress.clean', function() {

    var asset_0 = 'data/0/asset_compress.ini';
    var asset_1 = 'data/1/asset_compress.ini';
    var asset_2 = 'data/2/asset_compress.ini';
    var asset_3 = 'data/3/asset_compress.ini';
    var asset_4 = 'data/4/asset_compress.ini';

    function expectClean(file) {
        var original = NFP.link(asset_0).read().getRawContent();
        var actual = NFP.link(file).read().getRawContent();
        expect(actual).toEqual(original);
    }

    it('should remove all comments from the file', function() {
        NAC.link(asset_1).clean();
        expectClean(asset_1);
    });

    it('should remove all empty lines from the file', function() {
        NAC.link(asset_2).clean();
        expectClean(asset_2);
    });

    it('should remove all unneeded whitespace from the file', function() {
        NAC.link(asset_3).clean();
        expectClean(asset_3);
    });

    it('should do all of the above at the same time', function() {
        NAC.link(asset_4).clean();
        expectClean(asset_4);
    });
});

describe('AssetCompress.check', function() {

    var asset_5 = 'data/5/asset_compress.ini';
    var asset_6 = 'data/6/asset_compress.ini';
    var asset_7 = 'data/7/asset_compress.ini';
    var asset_8 = 'data/8/asset_compress.ini';
    var asset_9 = 'data/9/asset_compress.ini';

    it('should flatten test cases', function() {
        var test_1 = 'default.js';
        var test_2 = ['default.js', 'calendar.js'];
        var test_3 = ['default.js', 'calendar.js', 'events.js'];

        var result = NAC.link(asset_5).check({
            'domain.com/home': {
                test_1: test_1,
                test_2: test_2
            },
            'domain.com/user': {
                mobile: {
                    test_3: test_3
                }
            }
        });

        expect(result.tests).toEqual({
            'domain.com/home.test_1': ['default.js'],
            'domain.com/home.test_2': ['default.js', 'calendar.js'],
            'domain.com/user.mobile.test_3': ['default.js', 'calendar.js', 'events.js']
        });
    });

    it('should detect (and remove) duplicated test cases', function() {
        var test_1 = 'default.js';
        var test_2 = ['default.js', 'calendar.js'];
        var test_3 = ['default.js', 'calendar.js', 'events.js'];

        var result = NAC.link(asset_6).check({
            'domain.com/home': {
                test_1: test_1,
                test_2: test_2
            },
            'domain.com/user': {
                test_3: test_3,
                mobile: {
                    test_4: test_3
                },
                tablet: {
                    test_5: test_3
                }
            }
        });

        expect(result.duplicates).toEqual({
            'default.js,calendar.js,events.js': [
                'domain.com/user.test_3',
                'domain.com/user.mobile.test_4',
                'domain.com/user.tablet.test_5'
            ]
        });

        expect(result.tests).toEqual({
            'domain.com/home.test_1': ['default.js'],
            'domain.com/home.test_2': ['default.js', 'calendar.js'],
            'domain.com/user.test_3': ['default.js', 'calendar.js', 'events.js']
        });
    });

    it('should detect (and remove) test cases with non-existing sections', function() {
        var test_1 = 'made-up.js';
        var test_2 = ['default.js', 'made-up.js'];

        var result = NAC.link(asset_7).check({
            test_1: test_1,
            test_2: test_2
        });

        expect(result.tests).toEqual({});
        expect(result.missing).toEqual([test_1]);
    });

    it('should detect conflicting entries within a single section', function() {
        var test_1 = ['calendar.js', 'events.js'];

        var result = NAC.link(asset_8).check({
            test_1: test_1
        });

        expect(result.conflicts.single).toEqual({
            'calendar.js': ['webroot/js/api/a.js', 'webroot/js/api/b.js'],
            'events.js': ['webroot/js/api/f.js']
        });
    });

    it('should detect conflicting entries within multiple sections', function() {
        var test_1 = ['calendar.js', 'events.js'];
        var test_2 = ['default.js', 'events.js', 'puppies.js'];
        var test_3 = ['default.js', 'calendar.js', 'puppies.js'];

        var result = NAC.link(asset_9).check({
            test_1: test_1,
            test_2: test_2,
            test_3: test_3
        });

        expect(result.conflicts.multiple).toEqual({
            'webroot/js/api/f.js': ['events.js', 'puppies.js'],
            'webroot/js/api/g.js': ['default.js', 'puppies.js', 'calendar.js']
        });
    });
});

describe('AssetCompress.fix', function() {

    var asset_0 = 'data/0/asset_compress.ini';
    var asset_10 = 'data/10/asset_compress.ini';
    var asset_11 = 'data/11/asset_compress.ini';

    function expectClean(file) {
        var original = NFP.link(asset_0).read().getRawContent();
        var actual = NFP.link(file).read().getRawContent();
        expect(actual).toEqual(original);
    }

    it('should not be able to fix issues without manually checking', function() {
        var file = NAC.link(asset_10);

        var data;
        expect(function() {
            data = file.fix();
        }).toThrow('Cannot fix issues without first checking for issues!');
        expect(data).toBeUndefined();

    });

    it('should fix conflicting entries within a single section by default', function() {
        var test_1 = ['calendar.js', 'events.js'];

        var data;
        var result;
        var file = NAC.link(asset_11);

        data = file.check({
            test_1: test_1
        });

        expect(data).toBeDefined();
        expect(function() {
            result = file.fix();
        }).not.toThrow();
        expect(result).toBeDefined();
        expect(result.fixes).toBeDefined();
        expect(result.fixes.single).toBeDefined();
        expect(result.fixes.single).toEqual(result.conflicts.single);
        expectClean(asset_11);
    });
});
