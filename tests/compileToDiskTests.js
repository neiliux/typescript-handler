var expect = require('chai').expect,
    fs = require('fs'),
    sinon = require('sinon'),
    sut = require('../src/typescript-handler');

/**
 * Unit tests for public compileToDisk function
 * @module Unit tests for public compile function
 */
describe('compileToDisk unit tests', function() {
    var sinonSandbox;
    var testModule;

    beforeEach(function() {
        sinonSandbox = sinon.sandbox.create();
        testModule = 'declare var module:any; module.exports = { add: function(a,b) { return a+b; } };';
    });

    afterEach(function() {
        sinonSandbox.restore();
    });

    it('should write file with valid context', function() {

        sinonSandbox.stub(fs, 'existsSync', function() { return false; });
        sinonSandbox.stub(fs, 'mkdirSync', function() { });
        var writeStub = sinonSandbox.stub(fs, 'writeFileSync', function() { });

        sut.compileToDisk({
            source: testModule
        });

        expect(writeStub.called).to.equal(true);
    });
});