# Source Scaffolding

The scaffolding allows for several source scaffolding strategies, particularly with respect to the
location of test files relative to the source files.

The scaffolding standard is to have the test files under the same root folder as the source 
files, so that imports can point directly to the source files.  The build system knows to 
exclude the test output from distribution.

# Test File Locations and Build Strategy

The build system supports several test file location strategies.  This section explains what 
they are and, in the event the location needs to be change, how to accomplish that.

## Test files commingled with source files 

This is a simple strategy for testing, because test files have adjacent access to source files 
(import from current or relative path).  The distribution build process will exclude the test 
files, as long as the test files hold to a pre-defined pattern.

buildStrategy.json
```json
{
  "testFileLocation": "commingled",
  "testFilePattern": "**/*.test.*"
}
```



## Test file folder under src folder

Similar to comingled, but asssembled under a single directory

buildStrategy.json
```json
{
  "testFileLocation": "collocated",
  "testFilePattern": "${SOURCE_FOLDER}/path-to-test-folder/**/*.test*"
}
```

## Test file folded in its own folder 

buildStrategy.json
```json
{
  "testFileLocation": "distinct",
  "testFolder": "${SOURCE_FOLDER}",
  "sourceReferenceOption": "self-reference | imports | dist | rootDirs"
}
```
When keeping files in their own folder, the build system supports four options.

### self-reference

This leverages Node's self reference setup, where a local file can refer to files in its own 
package as if were a deployed module, if the package declares exports.  For this to work 
moduleResolution and "module" need to be set to nodenext or node16.ok

### imports

This leverages Node's package.json imports clause.  Unfortunately, the typescript compiler does 
not support this capability yet, so one as to leverage tsconfig paths to get this working at the 
pre-compile time.  However regular javascript will work fine.  Given that typescript does not 
support it, the moduleResolution and module are inconsequential, but a good idea is to set to 
nodenext so that it automatically works without paths int he future.

### dist

This leverages the distribution files, which requires the distribution to build compiled prior 
to the tests seeing the definitions.  Deleting the distribution files will cause errors in test 
typescript files until they are rebuilt.

### rootDirs

This leverages rootDirs in tsconfig.  However, a build step is necessary (and supplied) to merge 
source generated javascript with the test generated.  (typescript is fine with the rootDirs, but 
javascript knows nothing of them).


### Options for source paths

- nodenext:  


Option 1: test exits under src => distribution build will exclude src/path_to_test_dir

Option 2: tests not under src, moduleResolution=nodenext tests leverage package.json imports to 
get to src files(#...)

Option 3: tests not under src, moduleResolution!=nodenext tests leverage rootDirs to get to src, 
build step compbine root dirs to test output
