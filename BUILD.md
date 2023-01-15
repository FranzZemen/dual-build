# Build

This doc explains how the build process works and how the end user can impact it.

## Introduction to Pipelines and Transforms

The build process is a sequence of series and/or parallel tasks. The series of tasks are referred to as the Pipeline, and the
tasks are referred to as Transforms. More on these concepts further below.

## Typescript, Javascript, Module Loading and Environments

The main benefit of this build system is that it produces runnable javascript for various environments. The current version
supports emitting javascript code for all sensical combinations of tsconfig target, module and moduleResolutions.

The emitted javascript for the desired combination can then be module loaded by client code through "import" (ECMAScript
Modules, "esm" for short) or "require" (Commonjs, "cjs" for short, not to be confused with .cjs files), or run module-less as
standalone scripts.

The build system supports publishing a primary esm and cjs module output, as well as any number of additional
target/module/moduleResolution combinations through virtual sub paths, as one npm (or Yarn or pnpm) package.

To facilitate this, features provided tsconfig.json and package.json configurations are leveraged.

### Development package.json

The Development package.json is the usual package.json that is at the top of the git project, utilized for the purposes of
development.

If the project was created with `npx dual-build create-project`, then the starting point will have been provided, and one can
add whatever other fields are desired. If the dual-build was installed into an existing project, then one can
run `npx dual-build audit-project` or  `npx dual-build audit-fix-project` to validate and add any missing fields.

Note:  For development/IDE purposes, you would typically set the `type` package.json field here to whatever you prefer.  
dual-build will preset that "module", not "commonjs". This type field has no bearing on what is published.

You can add additional any fields you need for your project, for example any custom fields your tools support from
package.json

During the build process, dual-build will pull the following fields from this package to construct the Published Base
package.json:

- name
- author
- license
- version
- dependencies
- repository
- keywords
- bugs
- homepage
- imports

It does NOT pull:

- devDependencies - which have no meaning to the published code
- scripts - which are assumed to be for development purposes. See later in this section on how to provide publish-time
  scripts.
- bin commands - same as scripts

Finally, the field "version" in this package.json will be updated on each successful publish. It is the only update that will
be made to this file.

### Published Base package.json

The Published Base package.json is the main package.json file that is published. It contains all the fields extracted from
the Development package.json, plus the Published scripts.json and bin.json (described below) and the 'exports' definition. It
does not contain the "type" field (for 'module' or 'commonjs' values).

The exports field is drawn from exports.json, initially created from the desired targets, modules and moduleResolution
settings and has the form:

./dual-build/packages/exports.json

```json
{
  "exports": {
    ".": {
      "types": "./types",
      "require": "./cjs/index.js",
      "import": "./esm/index.js",
      "default": "./esm/index.js"
    },
    "./[target]/[module]/[module-resolution]": {
      "types": "./types",
      "[require|import]": "./target/module/module-resolution/index.js",
      "default": "./esm/index.js"
    }
  }
}
```

The exports field is initially setup assuming one is exporting everything from a top-level index.js. Add whatever additional
sub-paths make sense. If producing additional target environments, complete those additional sub-paths for each target
environment combination.

For example if in addition to primary esnext code, commonjs and esnext module loading, and nodenext module resolution we
wanted to have ES3 target code (implicitly commonjs), and for es3 support for a "foo" and "goo", where "goo" is a 
subfolder that would be accessed only by es3 the exports.js would be:

```json
{
  "exports": {
    ".": {
      "types": "./types",
      "require": "./cjs/index.js",
      "import": "./esm/index.js",
      "default": "./esm/index.js"
    }, 
    "./es3/commonjs/nodenext": {
      "require": "./es3/commonjs/nodenext/index.js",
      "default": "./esm/index.js"
    },
    "./foo/es3/commonjs/nodenext": {
      "require": "./es3/commonjs/nodenext/index.js",
      "default": "./esm/index.js"
    },
    "./goo": {No
      "require": "./goo/index.js",
      "default": "./esm/index.js"
    }
  }
}
```

Note that once generated, the exports.json can be edited.  It will not be regenerated, but that can be forced using the 
command

`npx dual-build generate exports.json.`

For the case where subpaths are auto generated for additional environments (the "foo" case above, but not the "goo" case),
client code would need to access that subpath to get that target code, which creates a form of hard coding:

const foo = require('somepackage/es3/commonjs/nodenext');

Finally, while the general form of subpaths for additional target environments is /[target]/[module]/[moduleLoader] generally
nicknames are used.  For the case ./es3/commonjs/nodenext, this would boil down to ./es3, if the nickname es3 was 
assigned at setup time.  The following standard nicknames are pre-provided:

es3/commonjs/node => es3
es5/commonjs/node => es5
esnext/esnext/node => esnext
esnext/nodenext/nodenext => nodenext



### Development tsconfig.json

As with the package.json, a development tsconfig.json is at the thop of the git project.
