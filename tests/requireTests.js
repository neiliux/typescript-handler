var expect = require('chai').expect,
    fs = require('fs'),
    sinon = require('sinon'),
    sut = require('../src/typescript-handler');

/**
 * Unit tests for public require function
 * @module Unit tests for public require function
 */
describe('require unit tests', function() {
    var sinonSandbox;
    var testModule;

    beforeEach(function() {
        sinonSandbox = sinon.sandbox.create();
        testModule = 'declare var module:any; module.exports = { add: function(a,b) { return a+b; } };';
    });

    afterEach(function() {
        sinonSandbox.restore();
    });


    it('require with source returns the expected required module', function() {
        var options = {
            source: testModule
        };

        var importedModule = sut.require(options);
        expect(importedModule.add).to.exist;
    });

    it('require with file returns the expected required module', function() {
        var options = {
            file: 'mockFile.ts'
        };

        sinonSandbox.stub(fs, 'existsSync', function() { return true; });
        sinonSandbox.stub(fs, 'readFileSync', function() { return testModule; });

        var compiledText = sut.require(options);
        expect(compiledText.add).to.exist;
    });
});