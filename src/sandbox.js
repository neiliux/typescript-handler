var x = require('./typescript-handler.js');

var options = {
    //source: "declare var module:any; declare var console:any; module.exports = { abc: function() { console.log('x11'); } };"
    file: 'test.ts',
    fileEncoding: 'utf-8'
};

var bleh = x.require(options);
bleh.abc();

var compiledJs = x.compile(options);
console.log(compiledJs);
