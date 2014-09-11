var tsApi = require('typescript-api');
var fs = require('fs');

module.exports = (function() {
    var defaultFileEncoding = 'utf-8';

    function require(source) {
        var mod = module.constructor;
        var m = new mod();
        m._compile(source);
        return m.exports;
    }

    function compile(options) {
        var compiler = new tsApi.TypeScriptCompiler();
        var snapshot = tsApi.ScriptSnapshot.fromString(options.source);
        compiler.addFile('typescriptHandler.ts', snapshot);

        var iterator = compiler.compile();
        iterator.moveNext();
        var compileResult = iterator.current();

        if (compileResult.diagnostics &&
            compileResult.diagnostics.length > 0) {
            throw new Error('TS compilation error.');
        }

        return compileResult;
    }

    function requireFromSource(options) {
        var compileResult = compile(options);
        return require(compileResult.outputFiles[0].text);
    }

    function requireFromFile(options) {
        var contents = readFile(options.file, options.fileEncoding);

        return requireFromSource({
            source: contents
        });
    }

    function readFile(path, encoding) {
        return fs.readFileSync(path, encoding);
    }

    function validateOptions(options) {
        if (!options) {
            throw new Error("Options invalid.");
        }

        if (!options.source && !options.file) {
            throw new Error("No data source defined.");
        }

        if (options.source && options.file) {
            throw new Error("Unable to determine which data source to use. Both defined.");
        }

        if (options.file) {
            if (!fs.existsSync(options.file)) {
                throw new Error('Source file does not exist.');
            }

            if (!options.fileEncoding) {
                options.fileEncoding = defaultFileEncoding;
            }
        }
    }

    return {
        require: function(options) {
            validateOptions(options);
            var result;

            if (options.source) {
                result = requireFromSource(options);
            } else if (options.file) {
                result = requireFromFile(options);
            }

            return result;
        },

        compile: function (options) {
            validateOptions(options);
            var text;

            if (options.source) {
                var compileResult = compile(options);
                text = compileResult.outputFiles[0].text;
            } else if (options.file) {
                var contents = readFile(options.file, options.fileEncoding);
                var compiledResult = compile({
                    source: contents
                });
                text = compiledResult.outputFiles[0].text;
            }

            return text;
        }
    };
})();

