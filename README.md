# Read Me

dual-build provides services to build esm and commonjs distributions from the same source

# Critical Dependencies

Critical dependencies mean that functionality internal to dual-build depends on these in a way that would
render build-tools useless without them.  They must be pre-installed.

- **[nodejs][]**
- **Package Manager** ([npm][] | [pnpm][] | [yarn][])

| Critical Dependency | Supported Versions <sup>1</sup>                              |
|---------------------|--------------------------------------------------------------|
| git <sup>2</sup>    | If needed, >= 2.26.3                                         |
| [nodejs][]          | LTS Versions since 16:  >= 16.13.0 <= 16.18.1<br/>>= 18.12.0 |
| [npm][]             | If using npm, >= 5.2                                         |
| [pnpm][]            | If using pnpm, >= 7.17                                       |
| [yarn][]            | If using yarn, >= 3.30                                       |                                                             

<sup>1</sup> Prior versions may work, they just haven't been tested.  Report any successes or issues with these!
<sup>2</sup> Strictly speaking, dual-build provides an option to work without git.

Worth noting:

| Package Manager | Executable | Speed   | Popularity US | Popularity World |
|-----------------|------------|---------|---------------|------------------|
| npm             | npx        | Fast    | High          | High             |
| yarn            | yarn dlx   | Faster  | Highest       | High             |
| pnpm            | pnpm dlx   | Fastest | Low           | Low              |

# Optional Dependencies

Optional dependencies are specific to features dual-build offers.  These are usually installed by the bootstrap 
process but can be installed later as well.


| Dependency     | Usage                     | Supported Versions <sup>1</sup> |
|----------------|---------------------------|---------------------------------|
| [Typescript][] | Make use of typescript    | >= 4.0.2                        |
| [Mocha][]      | Test with mocha framework | >= 10.0.0                       |
| [Chai][]       | Assert with chai          | >= 4.3.7                        |
| [Jest][]       | Test with Jest framework  | >= 29.3.1                       |  
| [Jasmine][]    | Jasmine                   | >= 4.5                          |

<sup>1</sup> Prior versions may work, they just haven't been tested.  Report any successes or issues with these!  
All of these features may co-exist.  If you select more than one test framework, it will be reflected in the 
scaffolding.

# Bootstrapping a project

Bootstrapping will achieve some or all of the following, depending on configuration or input.

- Create or use an empty directory <sup>a</sup>
- Create a default package.json
- Create a default .gitignore file
- Initialize git
- Configure git remote origin to your GitHub account
- Configure the package manager (npm, pnpm, or yarn)
- Install the dual-build package with the package manager
- Install optional functional dependencies
- Create required directory scaffolding
- Install default build configurations
- Create sample source files (.ts, .cts, .mts, .js, .cjs, .mjs, .json, .md)
- Complete a basic build to ensure things are working
- Provide results output

<sup>a</sup> The only contents of the empty directory is an optional valid bootstrap-options.json file with that 
exact name.

This documentation will fully explain what bootstrapping is doing, how the scaffolding works, what each file's 
purpose and structure is.

## Bootstrapping commands and utilities

### Get bootstrap-options.json

Get a copy of the default bootstrap-options.json, presumably to make changes prior to bootstrapping

As a rule for all dual-build commands, npx can be called with or without the -p package specifier.  We will 
show it once
npm[^1]
``` 
npx dual-build bootstrap-options

or

npx -p dual-build bootstrap-options

or

npm i dual-build
npx dual-build bootstrap-options
```

yarn:
```
yarn dlx dual-build bootstrap-optoins
```

Example output:
``` json

```

[1]: ddd

Depending on how bootstrapping is invoked, it will either leverage default, saved or provided 
options.  Bootstrapping can also combine both in one step, which will create prompts 
for the user leveraging saved or default options.


Terms
: **Default options** are within dual-repo itself and provided to the bootstrapping process.  They cannot be altered 
prior to bootstrapping.
: **Saved options** is on the users machine in the usual conf location saved through prior action by 
the user
: **Provided options** is provided explicitly by a path pointing to a JSON file that contains bootstrap options.

Provided options override saved options which override default options.  The override is incremental, meaning only those
fields present override the same fields, i.e. implemented by _.merge() in lodash.

If saved options exist, they will be updated with final options for the next project, unless options are explicitly 
not to be saved anymore.

### Bootstrapping and support commands

Although you can use one package manager

pkggr

### Bootstrapping from an empty/mostly empty directory

The only file allowed in the directory is a valid bootstrap-options.json file.

```
npx -p dual-build bootstrap

npx dual-build bootstrap
```

Note that the directory must be empty or an error code will be returned.

### Create a project in a new subdirectory

```
npx -p dual-build bootstrap --sub <subdirectory>

npx dual-build bootstrap --sub <subdirectory>
```





[scaffolding]:    #scaffolding
[nodejs]:         https://www.nodejs.org
[typescript]:     https://www.typescriptlang.org/download
[npm]:            https://docs.npmjs.com/getting-started
[yarn]:           https://yarnpkg.com/getting-started/install
[pnpm]:           https://pnpm.io/installation
[mocha]:          https://mochajs.org/#installation
[chai]:           https://www.chaijs.com/
[jest]:           https://jestjs.io/docs/getting-started
[jasmine]:        https://jasmine.github.io/pages/getting_started.html
