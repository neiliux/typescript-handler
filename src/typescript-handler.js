var tsApi = require('typescript-api');
var fs = require('fs');
var path = require('path');

/**
 * @module typescript-handler module
 * @description Expressive NodeJS module for importing and managing TS compilation at runtime.
 */
module.exports = (function() {
    /** Default encoding of external TS file */
    var defaultFileEncoding = 'utf-8';
    var compiledFilesDirectory = null;

    /**
     * Run cleanup when our process is finished.
     */
    process.on('exit', function() {
        if (compiledFilesDirectory) {
            removeFolder(compiledFilesDirectory);
        }
    });

    // TODO: Need to refactor this into separate module.
    /**
     * Removes a folder and all files within.
     * @param {string} folder - Path of folder.
     */
    function removeFolder(folder) {
        var directoryExists = fs.existsSync(folder);
        if (directoryExists) {
            fs.readdirSync(folder).forEach(function (file) {
                var fullPath = path.join(folder, file);
                fs.unlinkSync(fullPath);
            });
            fs.rmdirSync(folder);
        }
    }

    /**
     * Wrapper for importing CommonJS module.
     * @private
     * @param {string} source - Raw JS module
     * @returns {Object} CommonJS module
     */
    function require(source) {
        var mod = new module.constructor();
        mod._compile(source);
        return mod.exports;
    }

    /**
     * Invokes the TS API for compilation.
     * @private
     * @param {Object} options - Object that represents the compilation context.
     * @returns {Object} Compilation result
     */
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

    /**
     * Manages process of compilation and importing of in-memory based TS content.
     * @private
     * @param {Object} options - Object that represents the compilation context.
     * @returns {Object} Node Module
     */
    function requireFromSource(options) {
        var compileResult = compile(options);
        return require(compileResult.outputFiles[0].text);
    }

    /**
     * Manages process of compilation and importing of external file based TS content.
     * @private
     * @param {Object} options - Object that represents the compilation context.
     * @returns {Object} Node Module
     */
    function requireFromFile(options) {
        var contents = readFile(options.file, options.fileEncoding);

        return requireFromSource({
            source: contents
        });
    }

    /**
     * Reads and returns the contents of a file synchronously.
     * @private
     * @param {string} path - Path to file
     * @param {string} encoding - Encoding of file
     * @returns {NodeBuffer|string}
     */
    function readFile(path, encoding) {
        return fs.readFileSync(path, encoding);
    }

    /**
     * Writes contents to a file synchronously.
     * @private
     * @param {string} path - Path to file
     * @param {string} encoding - Encoding of file
     * @param {string} contents - Contents to write to file
     */
    function writeFile(path, encoding, contents) {
        fs.writeFileSync(path, contents, encoding);
    }

    /**
     * Common validation for compilation options.
     * @private
     * @param {Object} options - Object that represents the compilation context.
     */
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

    /**
     * Validation specific to compileToDisk branch.
     * @private
     * @param {Object} options - Object that represents the compilation context.
     */
    function compileToDiskValidateOptions(options) {
        if (!options.compiledPath) {
            options.compiledPath = 'compiled_tmp/untitled.js';
        }

        var filePath = path.dirname(options.compiledPath);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
    }

    function setCompiledFilesDirectory(filePath) {
        compiledFilesDirectory = path.dirname(filePath);
    }

    return {
        /**
         * Compiles and imports the passed TS module.
         * @public
         * @param {Object} options
         * @returns {Object} Node Module
         */
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

        /**
         * Compiles the passed TS and returns the compilation as a string.
         * @public
         * @param {Object} options - Context for compilation.
         * @returns {string} Raw compiled JS
         */
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
        },

        /**
         * Compiles the passed TS to a JS file on the filesystem.
         * @public
         * @param {Object} options - Context for compilation.
         */
        compileToDisk: function (options) {
            validateOptions(options);
            compileToDiskValidateOptions(options);

            var compiledText, compiledResult;
            setCompiledFilesDirectory(options.compiledPath);

            if (options.source) {
                compiledResult = compile(options);
                compiledText = compiledResult.outputFiles[0].text;
            } else if (options.file) {
                var contents = readFile(options.file, options.fileEncoding);
                compiledResult = compile({
                    source: contents
                });
                compiledText = compiledResult.outputFiles[0].text;
            }

            writeFile(options.compiledPath, options.fileEncoding, compiledText);

            return {
                path: options.compiledPath,
                require: function() {
                    var compiledJs = readFile(options.compiledPath, options.fileEncoding);
                    return require(compiledJs.toString());
                }
            };
        }
    };
})();

