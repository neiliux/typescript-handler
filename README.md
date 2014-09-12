typescript-handler
==================

Expressive NodeJS module for importing and managing TS compilation at runtime. You can require existing modules written in TS and forget about the compilation process. Typescript-handler will compile the TS in-memory and return the JS module as appropriate.

How to use
==========
##### Load a TS module in-memory
```
var ts = require('typescript-handler');
var myTsModule = ts.require({ file: 'path_to_your_ts_file' });
myTsModule.invokeAFunction();
```
##### Compile a TS module onto disk
```
var ts = require('typescript-handler');
var compileResult = ts.compileToDisk({ file: 'path_to_your_ts_file' });

// Get the full path to the generated JS file via path member.
console.log('Full path to compiled JS file is: ' + compileResult.path);

// Load the module.
var importedModule = compiledResult.require();
```

Options
=======
* file: 'path to TS file'
* fileEncoding: [ascii | utf-8] - optional flag to provide external ts file encoding, if necessary.
* compiledPath: 'path to compiled JS file' - optional argument to specify the location of the generated JS file.
* source: 'string representation of your TS'

Note that the file and source options are mutually exclusive.

