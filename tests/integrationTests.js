var expect = require('chai').expect,
    fs = require('fs'),
    sut = require('../src/typescript-handler');

describe('integration tests', function () {
    var options;
    var tsModule = "declare var module:any; module.exports = { add: function(a,b) { return a+b; } };";
    var externalFile = './integrationTest.ts';

    beforeEach(function() {
        options = {
            source: tsModule,
            fileEncoding: 'utf-8'
        };
        fs.writeFileSync(externalFile, tsModule);
    });

    afterEach(function() {
        if (fs.existsSync(externalFile)) {
            fs.unlinkSync(externalFile);
        }
    });

    it('should have working add function after require', function() {
        var mod = sut.require(options);
        var result = mod.add(5,5);
        expect(result).to.equal(10);
    });

    it('should have compiled js after compiling', function() {
        var compiledJs = sut.compile(options);
        expect(compiledJs.length).to.be.greaterThan(14);
    });

    it('should read in external file and have working add function after require', function() {
        delete options.source;
        options.file = externalFile;
        var mod = sut.require(options);
        var result = mod.add(3,3);
        expect(result).to.equal(6);
    });

    it('should read in external file and have compiled js after compiling', function() {
       delete options.source;
        options.file = externalFile;
        var compiledJs = sut.compile(options);
        expect(compiledJs.length).to.be.greaterThan(14);
    });
});
