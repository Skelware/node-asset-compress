module.exports = (function() {

    function AssetCompress(file) {
        Object.apply(this, arguments);

        this._file = file;
    }

    AssetCompress.prototype = Object.create(Object.prototype);
    AssetCompress.constructor = AssetCompress;

    AssetCompress.prototype.clean = function() {
        this._file.read().write();
        return this;
    };

    AssetCompress.prototype.check = function(groups) {
        var sections = this._file.read().getContent().section;
        var tests = flattenTestCases({}, groups, '');
        var duplicates = removeDuplicateTestCases(tests);
        var missing = removeMissingTestCases(tests, sections);
        var conflicts = detectConflicts(tests, sections);

        return this._data = {
            tests: tests,
            missing: missing,
            sections: sections,
            conflicts: conflicts,
            duplicates: duplicates
        };
    };

    AssetCompress.prototype.fix = function(options) {
        if (!this._data || this._data.fixes) {
            throw new Error('Cannot fix issues without first checking for issues!');
        }

        var fixes = {
            single: {},
            multiple: {}
        };

        var content = this._file.getContent();
        var single = this._data.conflicts.single;
        Object.keys(single).forEach(function(sectionName) {
            var seen = {};
            var section = content.section[sectionName];
            fixes.single[sectionName] = single[sectionName];
            section.files = section.files.filter(function(file) {
                return !seen.hasOwnProperty(file) && (seen[file] = true);
            });
        });

        this._file.setContent(content).write();
        this._data.fixes = fixes;
        return this._data;
    };

    function flattenTestCases(result, groups, namespace) {
        Object.keys(groups).forEach(function(key) {
            var group = groups[key];

            if (group instanceof Array) {
                result[namespace + key] = group;
            } else if (typeof group === 'string' || group instanceof String) {
                result[namespace + key] = Array(group);
            } else {
                flattenTestCases(result, group, namespace + key + '.');
            }
        });

        return result;
    }

    function removeDuplicateTestCases(tests) {
        var checked = {};
        var duplicates = {};

        Object.keys(tests).forEach(function(testName) {
            var test = tests[testName];

            if (checked[test]) {
                if (duplicates[test]) {
                    duplicates[test].push(testName);
                } else {
                    duplicates[test] = [checked[test], testName];
                }
                delete tests[testName];
            } else {
                checked[test] = testName;
            }
        });

        return duplicates;
    }

    function removeMissingTestCases(tests, sections) {
        var missing = {};

        Object.keys(tests).forEach(function(testName) {
            var test = tests[testName];

            test.forEach(function(sectionName) {
                if (!sections[sectionName]) {
                    missing[sectionName] = true;
                    delete tests[testName];
                }
            });
        });

        return Object.keys(missing);
    }

    function detectConflicts(tests, sections) {
        var single = {};
        var multiple = {};

        Object.keys(tests).forEach(function(testName) {
            var test = tests[testName];
            var list = {};

            test.forEach(function(section) {
                var files = sections[section];

                Object.keys(files).forEach(function parse(file) {
                    if (files[file] instanceof Array) {
                        files[file].forEach(parse);
                    } else if (list[file]) {
                        if (section === list[file]) {
                            if (single[section]) {
                                if (single[section].indexOf(file) < 0) {
                                    single[section].push(file);
                                }
                            } else {
                                single[section] = [file];
                            }
                        } else if (multiple[file]) {
                            if (multiple[file].indexOf(section) < 0) {
                                multiple[file].push(section);
                            }
                        } else {
                            multiple[file] = [list[file], section];
                        }
                    } else {
                        list[file] = section;
                    }
                });
            });
        });

        return {
            single: single,
            multiple: multiple
        };
    }

    return AssetCompress;
}());
