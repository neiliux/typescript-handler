typescript-handler
==================

Expressive NodeJS module for importing and managing TS compilation at runtime. You can require existing modules written in TS and forget about the compilation process. Typescript-handler will compile the TS in-memory and return the JS module as approrpiate.

How to use
==========
var ts = require('typescript-handler');
var myTsModule = ts.require({ file: 'path_to_your_ts_file' });
myTsModule.invokeAFunction();

Options
=======
file: 'path to TS file'
fileEncoding: [ascii | utf-8], optional flag to provide external ts file encoding, if necessary.
source: <string representation of your TS>

* Note that the file and source options are mutually exclusive.

