# Description of Typescript Configuration Files

The build system keeps configurations separate in order to satisfy target requirements by dividing configurations into
several hierarchical levels:

tsconfig.base.json -

## tsconfig.base.json

For a given project this configuration is used for features that are common to all builds. Normally this means:

A) A subset of "compilerOptions" sections including:

- Type Checking
- Emit (but not outDir or outFile)
- Javascript Support
- Interop Constraints

B) "watchOptions"

## tsconfig.[module].[target].{moduleResolution}.json

The job of this leve of configuration is to specify module, target and moduleResolution (optionally). Any allowed typescript
combination can be used, however the predefined versions are provided with a philosophy that makes sense probably for 99. 99%
of users. If you have a special use case that does not fit, feel free to create your own and configure the build system to
use it.

The philosophy, or ladder of inference to deciding combinations that make sense is influenced by the real world constraints -
generally you don't need node features outside of node, modern web browsers support not only ESM loading but also the latest
specifications and are updated often (unlike years ago when backward portability was a driving issue)
etc:

Specific conventions for this sub-configuration for tsconfig.json for dual-build:

A) It "extends": "./tsconfig.base.json"

B) It contains a subset of "compiler options" sections including:

- Modules
- Language and Environments
- We ignore UMD/AMD configurations in our standard configurations, but nothing stops you from using those

C) It is named `"tsconfig.[none | es3 | es5 | es6 | es2xxx | esnext].json"`

D) For targets that are module-less scripts the configuration file will be named `"tsconfig.none.[target].json`.

E) The configuration to support ES3 modules will be `"tsconfig.commonjs.es3.json"`, i.e. commonjs module system with es3
target and default moduleResolution - by definition following the typescript documentation.

F) Configuration to support ES5 will be `"tsconfig.commonjs.es5.json"` i.e. commonjs module system with es5 target and
default moduleResolution. Yes, you can use ESM module loading with target es5, but why would you want to deal with the
potential for headaches (module loader restrictions) when ESM was introduced with es6? It is our philosophy that we use
commonjs when targeting pre-ESM javascript standards.

G) If you are targeting a modern web application (and not using webpack or vite or some other bundler to begin with) then
your configuration would be  `"tsconfig.es2022.es2022"` or `"tsconfig.esnext.esnext"` (and default moduleResolution as Node)
unless your target browsers do not support specific features in es2022 that you want to use (in which case substitute the
ECMAScript module and target appropriate to your case) . Check "caniuse.com" for details noting that the modern browsers
track javascript releases pretty closely. Note that you would have moduleResolution set to `node`. Note that you can always
use .cts/.cjs files if you want to use require, for example when integrating with packages that don't support ESM module
loading.

H) If you are targeting a server side application, but don't need node specific extension, then your configuration could be
the same as G above, or if you want to support commonjs loading, `"tsconfig.commonjs.esnext"`.

G) Finally, if you are targeting a modern node application your configuration would be `"tsconfig.nodenext.esnext" `with
moduleResolution set to `"nodenext"'. Why bother with node16 when it just has fewer features than nodenext except for some
legacy reasons (like you started with node16).

It's good to have a clear understanding of the relationships between module, target and moduleResolution, but it is also good
to understand why it generally comes down to just a few choices. If the above is not good for your project then you have a *
*very specific use case**, environmental or otherwise, that you are supporting. It is beyond the scope of this documentation
to explain the differences between module, target and module resolution, and picking them at random is not the answer.

The build system will pick up the appropriate ts-config file(s) based on the build config file settings, as defined in TBD.

