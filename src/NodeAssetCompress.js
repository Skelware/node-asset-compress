module.exports = (function() {

    var AssetCompress = require('./AssetCompress');
    var NodeFileParser = require('node-file-parser');

    function link(url) {
        if (!url) {
            throw new Error('A valid file url must be provided to link to!');
        } else if (!(/[\\\/]?asset_compress\.ini$/g).test(url)) {
            throw new Error('Cannot link to invalid file url: ' + url);
        }

        var file = NodeFileParser.link(url);
        return new AssetCompress(file);
    }

    return {
        link: link
    };
}());
