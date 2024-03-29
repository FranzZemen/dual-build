# Project Structure

`dual-build` is a relatively flexible framework that provides for commonly used directory structures
leveraging straightforward techniques and documents those explicitly. This creates confidence in the
system, enables more straightforward debugging and even enables experts in development technologies
to tweak things manually if desired.

In past decades, project hierarchy was more of a static choice than a functional one. Over the years
project hierarchy has been increasingly influenced by tools and vice-versa. The tools offer choices
that would not necessarily have been made prior, and set constraints that might not have existed.
For example, consider the node feature that allows project files to import from the package name and
a supporting exports declaration. This enables the developer to write imports as if it were outside
the package by importing the module from the package. Testing resolution is simple in this case, and
it opens the door to straightforward integration tests post-publish, where the unit test can be used
pre and post publish without alteration of code.

Depending on configuration, `dual-build` uses these constructs to enable both static time
(pre-build or IDE) and run time linkage:

- tsconfig features such as rootDir, rootDirs, typeRoots, types, references etc.
- package.json features like type, exports, imports, bin, scripts
- transformation code that moves or alters files, which are called Transforms
- paralell and serial Transforms assembled together into Pipelines
- symbolic links (symlinks, junctions)
- npm features like locally publishing folders and binaries, as well as publicly publishing binaries

## tsconfig.json and package.json files

Because `dual-build` leverages tsconfig.json and package.json features at the very least to provide
distributions for different target javascript specs, even a simple `dual-build`
repository will have multiple such files. This can be confusing, however the usage is not arbitrary
and the nomenclature is set to support understanding based on the following:

## tsconfig:

| format                 | standalone | required                 | location               | contents                                                                                                                                                                              | purpose                                                                   |
|------------------------|:----------:|--------------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| tsconfig.base.json     |     no     | yes                      | subproject root        | compilerOptions configuration defined by the type BaseCompilerOptions. project version has default values, default subproject version only extends project version, with no overrides | common non-env specific options                                           | 
| tsconfig.src.env.json  |    yes     | yes                      | subproject source root | tsconfig configuration defined by type TargetEnvironmentCompilerOptions                                                                                                               | target and emission properties that complies with build strategy          |
| tsconfig.test.env.json |    yes     | depends on test strategy | subproject test root   | tsconfig configuration defined by type TargetEnvironmentCompilerOptions                                                                                                               | target and emission properties that complies with build and test strategy |
| tsconfig. json         |    yes     | yes                      | project  root          | tsconfig configuration defined by type ProjectCompilerOptions                                                                                                                         | leverages typescript projects to transpile all typescript incrementally   |

tsconfig types are initially generated by the bootstrapping process and can be liberally edited (at
your own risk). They can also be reset leveraging the `dual-project` binaries:

````
npx tsconfigx reset-base --override     // reset only tsconfig.base.json files 
npx tsconfigx reset-src-env --override  // reset only tsconfig.src.env.json files
npx tsconfigx reset-test-env --override // reset only tsconfig.test.env.json files (if they exist)
npx tsconfix reset project -- override  // reset only tsconfig.json
npx tsconfigx reset --override          // reset all tsconfig.json files
````

Note: override switch overwrites the file with defaults. No override switch merges the existing
settings into the default settings. These commands do not invoke the build process or typescript
compiler, although one might have unrelated watch options setup that do.

package.json:

Package.json files do not extend, when used functionally they must be called package.json.  
However, they do have some extension like properties. For example, the location of node_modules is
searched recursively up a directory, although if one installs from a subdirectory containing a
package.json, it will create a local node_modules. For package.json properties, the first
package.json encountered moving up a directory tree is used.

| name                 | location                          |                   existence                   | contents                                 | 
|----------------------|-----------------------------------|:---------------------------------------------:|------------------------------------------|
| Project Root Package | project root                      |                    static                     | defined by ProjectRootPackage type       |
| Subproject Package   | subproject root                   |        only for published subprojects         | defined by ProjectRootPackage type       |
| Source  Package      | source root                       |              generated by build               | type property (commonjs or module)       | 
| Test Package         | test root                         | generated by build depending on test strategy | type property (commonjs or module)       |
| Distribution Package | distribution root                 |              generated by build               | defined by DistributionPackageType       | 
| Distribution Module  | distribution target subdirecgtory |              generated by build               | defined by DistributionTargetPackageType |

### Project Root Package

As stated this is not the distribution package as is often the standard in the simplest code
packages. It does contain information that is used by the distribution package. Specifically this is
the source of truth for the following properties:

````json
{
  "name": "Distribution Name",
  "description": "Distribution Description",
  "version": "Last distribution version published",
  "type": "commonjs or module; only used for IDE purposes - select the one you want to edit with",
  "scripts": {
    "generate script": "generated by dual-build bootstrapping, not included in distributions",
    "user scripts": "included in distributions"
  },
  "bin": {
    "generated binaries": "local npm install not included in distributions",
    "user binaries": "included in distributions"
  },
  "exports": {
    ".": "exports defined here will be re-mapped to distributions"
  }
  
}
````


