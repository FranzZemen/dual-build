# Build

Invoked from the npm script "build", this is the entrypoint for building the package. The build
script "build" will compile all package typescript through tsc -build, and then launch the index
file in this folder. The index file contains the pipeline to finish building the package (which
includes ensure the generated javascript is up-to-date, re-invoking tsc -b).  

Note that invoking the build index.js from the package root is important - the resulting cwd is 
assumed to be the package root.

The steps to build the package are:

1. Transpile typescript/javascript with default configuration (esm) through package root tsc -build
   to `./build`folder. This will create a build folder for "this" directory, as well
   as `dist`, `dist/esm`, `dist/cjm` directories. The project's package.json file contains the
   necessary exports configuration for the build files to access libraries in the dist directories.
2. Copy & massage the project package.json to a distributable package.json and place it in the
   `./build/dist` directory.
3. Place appropriate mini package.json files in the `./build/dist/esm` and `./build/dist/cjm`
   folders.
4. Copy any additional file including project json and markdown files intended for publication to
   the `./build/dist` folder.
5. Launch unit tests.
6. Launch package tests.

Note that this build system operates in esm mode only with no options to change target/module/module
resolution other than to tinker with the tsconfig files. That's ok, it is not accessible to the
outside world.
  



