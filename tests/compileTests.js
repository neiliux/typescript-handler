var expect = require('chai').expect,
    fs = require('fs'),
    sinon = require('sinon'),
    sut = require('../src/typescript-handler');

/**
 * Unit tests for public compile function
 * @module Unit tests for public compile function
 */
describe('compile unit tests', function() {
    var sinonSandbox;
    var testModule;

    beforeEach(function() {
        sinonSandbox = sinon.sandbox.create();
        testModule = 'declare var module:any; module.exports = { add: function(a,b) { return a+b; } };';
    });

    afterEach(function() {
        sinonSandbox.restore();
    });


    it('compile with source returns the expected JS code', function() {
        var options = {
            source: testModule
        };

        var compiledCode = sut.compile(options);
        // TODO: Need to find a better method for verifying this.
        expect(compiledCode.length).to.be.greaterThan(14);
    });

    it('compile with file returns the expected JS code', function() {
        var options = {
            file: 'mockFile.ts'
        };

        sinonSandbox.stub(fs, 'existsSync', function() { return true; });
        sinonSandbox.stub(fs, 'readFileSync', function() { return testModule; });

        var compiledCode = sut.compile(options);
        // TODO: Need to find a better method for verifying this.
        expect(compiledCode.length).to.be.greaterThan(14);
    });
});