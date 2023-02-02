# Source Scaffolding

Within the topic of folder scaffolding is the main concern of source scaffolding. By definition,
this includes anything that is necessary to build or operate run time functionality, so typescript,
javascript, json, configuration files, test files and so on. Depending on local preference and often
framework specifications (for example Angular), it can make sense to create different roots for
different types of source, or keep them collocated or even comingled.

Within a project, there is often just one target feature/program/library being generated, and
therefore just one set of source files. Sometimes however it is desired to generate separately
managed but otherwise related distributions, requiring multiple sets of output distributions.  
This is supported by dual-project as "subprojects". Moreover, subprojects can have their own
transport and build rules, or share common ones.

Also, a project can include two special kind of source subprojects. One is called `tool.x` which
supports the creation of binary tools that are published with the project through the "bin"
attribute of package.json. The second is called `tool.i`, which supports the creation of binary
tools that exist within the project for the project developer, but not exposed through the
distribution. They are also invoked through a "bin" package.json attribute, just not the one that is
published.

Finally, there are various practices on where to put test source. Dual build supports several
locational strategies and within that, several import strategies, i.e. how test source files resolve
source files for transpilation, and how to ensure the transpiled source files are in the correct
location at run time for tests to run without error. This is not limited to typescript

PS:  The scaffolding topic is somewhat related and driven by a) test file strategy, b) test import
strategy and c) module loading/resolution strategy.

# Projects

As mentioned, there can be more than one subproject in a project. If there is only one subproject,
then it can be located in the project root.

If there is more than one subproject, excluding the `tool.x` and `tool.i` special subprojects,
then the subprojects will require their own directories and an import strategy for each subproject 
will need to be defined or all subprojects will use a common import strategy.

The `tool.x` and `tool.i` subprojects are always named just that.

Subprojects should not be nested in directory hierarchies.  Options include hanging them off the 
root project directory './sub1', './sub2' etc. or within a subdirectory.

## Location of source files

Non-test source files are expected to be under the same source directory for a given subproject, 
whatever the type of source.  By default, the source directory is names './src'.  Thus, for a 
single subproject (subproject = project), the default location is ./project-folder/src.  

Source file path resolution, for example for imports (import, require, etc.) of other typescript 
or javascript files is expected to be relative or absolute and identical pre-compilation or 
post-compilation unless otherwise configured below.  Several tools exist to bypass this:

- leveraging typescript configuration properties like rootDir, rootDirs, paths, typeRoots and types,
- using custom symlinks or similar
- leveraging reusable transforms like TransformLocation and customizing a pipeline
- writing your own transform
- at worst, writing your own custom code

Generally speaking, beyond the features provided by dual-code natively, leveraging these 
directly would be the exception.

For dependent subprojects that do not leverage a published npm format (dependency is resolved 
through an import)

Resolving paths for source files is normally the task of the

- a source directory, by default this is 'src'
- the source the source subdirectory of the project where there is only 1 subproject (subproject = 
  project)
- or the source subdirectory of the subproject 


By default, source files will all be located under './src' from the subproject. So for just one 
project that would be './src' under the root directory, and for multiples that would be .
/some-subproject/src.

The default lumps all source files under ./src.  There may be a desire to break out different 
types of source files under different folders, or different source folders.  Here the key 
consideration is import mapping, both for transpilation and IDE support, and destination 
reconciliation, so imports work at run time.  Except for test files (discussed further below), 
it is expected that source file imports within a subproject be managed manually using tsconfig.
josn or use 
relative paths




The are more specific, in that they are not expected to be dependent on other project source, and if
needed are more limited the import options to make that happen.

Source scaffolding include where any file considered as source(.ts, .cts, .mts, .js, .json, .html,
.css etc) are located, as well as configuration files necessary to transpile, build or otherwise
alter them for run time.

This also includes test files and potentially assets (media, json) or data required for the system
to run.

The build system leverages both package.json and tsconfig.json to maximize the options as well as
providing some transforms, or build steps, necessary to meet the scaffolding needs.

Multiple source hierarchies building different functional capability are allowed. This is not to be
confused with one functional capability generating multiple target distributions, for example ES5
and esnext generated code. Typically aside (potentially) from tests, and project would have just one
src root & hierarchy.

# Target Distributions

Several distribution types are allowed within a project. These are:

- Distributions:  Software libraries intended for external (distributed) usage
- Tests:  Various test suites to test both the intermediary and distributed software
- Tools:  Tools used to manage the project. These include the tools provided by dual-build as well
  as additional tools the project owner may wish to provide.



