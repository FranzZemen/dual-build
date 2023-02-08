# Bootstrapping

Bootstrapping is the process of getting a project ready for `dual-build`. 

Bootstrapping includes 3 use cases:
- Create a `dual-build` project
- Migrating from a previous version of `dual-build`
- Converting a different build systesm to `dual-build`+
- 
## Creating a project

There are two variations on creating a project:

- Create a project from the parent directory
- Create a project from within the current directory

### Creating a project from the parent directory

This leverages the package binary `dual-build`:

From the parent directory:

````
npx dual-build <subdirectory name> 
````

This will attempt to bootstrap a project within a new subdirectory.  The bootstrap will fail if 
the subdirectory already exist.  Otherwise, the subdirectory will be created and the bootstrap 
process will begin to query the user.

### Create a project from the current directory

The binary `bootstrapx` is invoked in a manually created project folder that only contains a) A 
package.json and a node_modules directory with the minimum devDependency of `dual-build`.  A .
git folder is also optionally allowed.  The remaining sub-directory should remain empty.

````
  mkdir <subdirectory name>
  npm init
  npm i dual-build --save-dev;
  npx bootstrapx
````
