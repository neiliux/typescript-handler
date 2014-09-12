var expect = require('chai').expect,
    fs = require('fs'),
    path = require('path'),
    sut = require('../src/typescript-handler');

/**
 * @module Integration tests for compileToDisk function.
 */
describe('compileToDisk integration tests', function() {
    var folder = 'compiled_tmp';
    var tsModule = 'declare var module:any; module.exports = { add: function(a,b) { return a+b; } };';

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

    it('should create auto-generated folder for compiled js files', function() {
        removeFolder(folder);

        sut.compileToDisk({
           source: tsModule
        });

        var directoryExists = fs.existsSync(folder);
        expect(directoryExists).to.equal(true);
    });

    it('should have valid auto-generated file path returned after compilation', function() {
       removeFolder(folder);

        sut.compileToDisk({
            source: tsModule
        });

        var filePath = path.join(folder, 'untitled.js');
        var fileExists = fs.existsSync(filePath);
        expect(fileExists).to.equal(true);
    });

    it('should have valid explicit set file path return after compilation', function() {
        removeFolder(folder);
        var fileName = 'myFile.js';

        sut.compileToDisk({
            source: tsModule,
            compiledPath: path.join(folder, fileName)
        });

        var filePath = path.join(folder, fileName);
        var fileExists = fs.existsSync(filePath);
        expect(fileExists).to.equal(true);
    });

    it('should import module after compilation', function() {
        removeFolder(folder);

        var result = sut.compileToDisk({
            source: tsModule
        });

        var module = result.require();
        var val = module.add(5,5);
        expect(val).to.equal(10);
    });
});