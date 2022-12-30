# /src/bin directory

If the bootstrap.ts option `deploy binaries` is true, then this folder takes on a special meaning.  

Each generated javascript will have a corresponding javascript in `/publish/bin` (without .js, .cjs, or .mjs extension).
Per specification the first line of these corresponding files will  have the hashbang `#!/usr/bin/env node`.  The 
next line will have the import the original javascript. 

Which javascript is the original file and how it is loaded depends on three factors. 

1. If the bootstrap.ts option `install module loader` is set to `install esm` or to `install commonjs`, then the 
   original file will come from that distribution.  In this case, the bootstrap.ts option `bin source` is ignored.
2. If the boostrap option `install module loader` is set to `install both`, then the bootstrap.ts option `bin source`'s 
   value of either `esm/bin` or `commonjs/bin` will determine.

In all cases, whatever the javascript source type '.js', '.mjs', '.cjs', remembering that both commonjs and esm 
distributions can have all three, the source is loaded with a dynamic import.

The typescript/javascript in the `/src/bin` folder can be any of the `/\.cts|\.mts|\.ts|\.cjs|\.mjs|\.js/` 
typescript/javascript flavors as with any other source file, and it must be executable, i.e. it must launch and 
complete the command.

