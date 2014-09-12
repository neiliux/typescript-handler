var expect = require('chai').expect,
    fs = require('fs'),
    sinon = require('sinon'),
    sut = require('../src/typescript-handler');

describe('general validation tests', function() {
    var sinonSandbox;

    beforeEach(function() {
        sinonSandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sinonSandbox.restore();
    });

    it('should throw error when passing null to require', function() {
        expect(sut.require.bind(sut, null)).to.throw('Options invalid.');
    });

    it('should throw error when passing undefined to require', function() {
        expect(sut.require.bind(sut, undefined)).to.throw('Options invalid.');
    });

    it('should throw error when no source has been specified', function() {
        var options = {};
        expect(sut.require.bind(sut, options)).to.throw('No data source defined.');
    });

    it('should set default file encoding when none is set', function() {
        var options = {
            file: 'mockFile.ts'
        };

        sinonSandbox.stub(fs, 'existsSync', function() {
            return true;
        });

        sinonSandbox.stub(fs, 'readFileSync', function() {
           return 'var x:number=1024;';
        });

        sut.require(options);

        expect(options.fileEncoding).to.equals('utf-8');
    });

    it('should throw error when source file does not exist', function() {
        var options = {
            file: 'mockFile.ts'
        };

        sinonSandbox.stub(fs, 'existsSync', function() {
            return false;
        });

        expect(sut.require.bind(sut, options)).to.throw('Source file does not exist.');
    });

    it('should throw when both a source and file are present', function() {
        var options = {
            source: 'var x:number=100;',
            file: 'mockFile.ts'
        };

        expect(sut.require.bind(sut, options)).to.throw('Unable to determine which data source to use. Both defined.');
    });

    it('should set auto-generated path on options when compiling to disk', function() {
       var options = {
           source: 'var x:number=100;'
       };

        sinonSandbox.stub(fs, 'existsSync', function() { return false; });
        sinonSandbox.stub(fs, 'mkdirSync', function() { });
        sinonSandbox.stub(fs, 'writeFileSync', function() { });
        sut.compileToDisk(options);
        expect(options.compiledPath).to.exist;
    });
});
