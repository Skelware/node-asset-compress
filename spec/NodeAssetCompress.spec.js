var AC = require('../src/AssetCompress');
var NAC = require('../src/NodeAssetCompress');

describe('NodeAssetCompress', function() {

    it('should contain a "link" function', function() {
        expect(typeof NAC.link).toEqual('function');
    });
});

describe('NodeAssetCompress.link', function() {

    var link = NAC.link;

    it('should link only "asset_compress.ini" files', function() {
        var err_1 = 'A valid file url must be provided to link to!';
        var err_2 = 'Cannot link to invalid file url: ';

        expect(link.bind(NAC)).toThrow(err_1);
        expect(link.bind(NAC, 'foo.bar')).toThrow(err_2 + 'foo.bar');
        expect(link.bind(NAC, 'asset compress.ini')).toThrow(err_2 + 'asset compress.ini');
        expect(link.bind(NAC, 'asset_compress.txt')).toThrow(err_2 + 'asset_compress.txt');
        expect(link.bind(NAC, 'my.asset_compress.txt')).toThrow(err_2 + 'my.asset_compress.txt');
        expect(link.bind(NAC, 'asset_compress.ini')).not.toThrow();
        expect(link.bind(NAC, '/asset_compress.ini')).not.toThrow();
        expect(link.bind(NAC, '\\asset_compress.ini')).not.toThrow();
        expect(link.bind(NAC, './foo/bar/asset_compress.ini')).not.toThrow();
        expect(link.bind(NAC, '\\foo\\bar\\asset_compress.ini')).not.toThrow();
    });

    it('should return a new AssetCompress instance upon linking', function() {
        var asset1 = link('asset_compress.ini');
        var asset2 = link('asset_compress.ini');

        expect(asset1).toEqual(asset2);
        expect(asset1).not.toBe(asset2);
        expect(asset1 instanceof AC).toEqual(true);
    });
});
