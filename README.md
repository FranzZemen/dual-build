Pre-Alpah do not try and consume this package!

# Read Me

dual-build provides services to build esm and commonjs distributions from the same source

# Critical Dependencies

Critical dependencies mean that functionality internal to dual-build depends on these in a way that would
render build-tools useless without them. They must be pre-installed.

- **[nodejs][]**
- **Package Manager** ([npm][] | [pnpm][] | [yarn][])

| Critical Dependency | Supported Versions <sup>1</sup>                              |
|---------------------|--------------------------------------------------------------|
| git <sup>2</sup>    | If needed, >= 2.26.3                                         |
| [nodejs][]          | LTS Versions since 16:  >= 16.13.0 <= 16.18.1<br/>>= 18.12.0 |
| [npm][]             | If using npm, >= 5.2                                         |
| [pnpm][]            | If using pnpm, >= 7.17                                       |
| [yarn][]            | If using yarn, >= 3.30                                       |                                                             

<sup>1</sup> Prior versions may work, they just haven't been tested. Report any successes or issues with these!
<sup>2</sup> Strictly speaking, dual-build provides an option to work without git.

Worth noting:

| Package Manager | Executable | Speed   | Popularity US | Popularity World |
|-----------------|------------|---------|---------------|------------------|
| npm             | npx        | Fast    | High          | High             |
| yarn            | yarn dlx   | Faster  | Highest       | High             |
| pnpm            | pnpm dlx   | Fastest | Low           | Low              |

# Optional Dependencies

Optional dependencies are specific to features dual-build offers. These are usually installed by the bootstrap.ts
process but can be installed later as well.

| Dependency     | Usage                     | Supported Versions <sup>1</sup> |
|----------------|---------------------------|---------------------------------|
| [Typescript][] | Make use of typescript    | >= 4.0.2                        |
| [Mocha][]      | Test with mocha framework | >= 10.0.0                       |
| [Chai][]       | Assert with chai          | >= 4.3.7                        |
| [Jest][]       | Test with Jest framework  | >= 29.3.1                       |  
| [Jasmine][]    | Jasmine                   | >= 4.5                          |

<sup>1</sup> Prior versions may work, they just haven't been tested. Report any successes or issues with these!  
All of these features may co-exist. If you select more than one test framework, it will be reflected in the
scaffolding.

# Invoking dual-build commands with the package managers is straightforward:

```
// command = package in the first line below
[package manager command cli] command
[package manager command cli]  -p package -c command

```

where:

| Package Manager | [package manager command cli] |
|-----------------|-------------------------------|
| npm             | npx                           |
| pnpm            | pnpm dlx                      |
| yarn            | yarn dlx                      |

We will use "binx" in our examples to remain neutral

dual-build has been deployed in such a way that we don't need the -p and -c command line options. This is because
the binary dual-build:

```
binx dual-bin  
```

Does nothing. In fact, if used on its own it will output "Missing Command". It actually expects an argument,
specifically the actual command to be executed.

So all our commands will look like

npx dual-bin command

More on this in [Binaries][]

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

<sup>a</sup> The only contents of the empty directory is an optional valid bootstrap.ts-options.json file with that
exact name.

This documentation will fully explain what bootstrapping is doing, how the scaffolding works, what each file's
purpose and structure is.

## Bootstrapping commands and utilities

Conventions are used throughout. Documentation will only cover what's unique or an exception from conventions.

Conventions:

| Convention         | Explanation                                                                                                                                                                                                                            |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| -c                 | A letter preceded by a dash - is a flag                                                                                                                                                                                                |
| --console          | A word preceded by two dashes -- is a flag, and may be a synonym to a single letter flag                                                                                                                                               |
| -s <path_to_file>  | Angular brackets means supply the parameter is described between them, in this case path_to_file                                                                                                                                       |
| -sf <path_to_file> | Single letter flags may combine as long as their instructions don't conflict (causing an error).  Only one of the combinations may require a parameter, which must follow as usual.  The order of single letter flags is not important |
| [-c]               | Square brackets implies what's between them is optional, in this case -c                                                                                                                                                               |

Common Flags:

| Flag | Synonyms  | Parameter(s) | Unless documented otherwise, functions to                                  |
|------|-----------|--------------|----------------------------------------------------------------------------|
| -c   | --console |              | Print to console                                                           |
| -s   | --save    | <filename>   | Saves to filename relative to process.cwd(), unless absolute path provided |
| -f   | --force   |              | Forces a behavior (forcing overwrite, deletes etc)                         |

### Get bootstrap.ts-options.json from defaults

Get a copy of the default bootstrap.ts-options.json, presumably to make changes prior to bootstrapping. As a rule for
dual-build [npx commands can be called with or without the -p option][]. We show it without.

From Package Manager:

``` 
Call        binx dual-build defaut-bootstrap.ts-options [-c] [-s <path_to_json>] [-f] [-v <verbose_level>
                    
Returns     bootstrap.ts options

Default     1. saves to file bootstrap.ts-options.json in process.cwd().  Use -f to force overwrite.
            2. depending on verbose levels and configuration, logs progress
            
Notes:      -cf has no effect and will be treated as -c     

Flags       None:               saves to file bootstrap.ts-options.json in process.cwd() 
            -c --console:       Print to console
            -s --save:          save to a provided JSON file <path_to_json> relative to process.cwd()
            -f --force:         force save to a file  
            -v --verbose_level: set verbose level <verbose_level>, i..e debug info warn error suppress
                         
Errors      1. file already exists and -f not set 
            2. combination of -c and -s
```

From code:

```typescript
options = await defaultBootstrapOptions();
options = await defaultBootstrapOptions({console: true});
options = await defaultBootstrapOptions({path: 'bootstrap.ts-options.json'});
options = await defaultBootstrapOptions({path: 'bootstrap.ts-options.json', force: true});
```

### Get bootstrap.ts-options.json from user configuration

Get a copy of the bootstrap.ts-options saved in the [user configuration][]. Note that capability to save to the user
configuration is not provided. It will be re-saved if bootstrap.ts-options.json are set to save to configuration,
after a successful bootstrapping.

Package Manager:

``` 
Call        binx dual-build user-bootstrap.ts-options [-c] [-s <path_to_json>] [-f] [-v <verbose_level>
            
Returns     1. bootstrap.ts options
            2. depending on verbose levels and configuration, logs progress

Default     saves to file bootstrap.ts-options.json in process.cwd().  Use -f to force overwrite.

Notes:      -cf has no effect and will be treated as -c        

Flags       none:         saves to file bootstrap.ts-options.json in process.cwd() 
            -c --console: Print to console
            -s --save:    save to a provided JSON file <path_to_json> relative to process.cwd()
            -f --force:   force save to a file  
            -v --verbose_level: set verbose level <verbose_level>, i..e debug info warn error suppress
                                    
Errors      1. file already exists and -f not set
            2. combination of -c and -s
```

API

```typescript
options = await userBootstrapOptions();
options = await userBootstrapOptions({console: true});
options = await userBootstrapOptions({path: 'bootstrap.ts-options.json'});
options = await userBootstrapOptions({path: 'bootstrap.ts-options.json', force: true});
```

### Delete bootstrap.ts-options from user configuration

Delete the boostrap-options from user configuration. Note - this does not delete the overall user configuration file.
See [Delete configuration][]  for that.

```
Call:       binx dual-build delete-user-bootstrap.ts-options [-c] [-v <verbose_level>]

Returns:    depending on verbose levels and configuration, logs progress

Default     delete bootstrap.ts options from user configuration

Notes:      n/a

Flags       none:         quietly deletes
            -c --console: prints 'success' on complettion
            -v --verbose_level: set verbose level <verbose_level>, i..e debug info warn error suppress
                         
Errors      n/a
```

```typescript
import {
  BootstrapOptions,
  deleteUserBootstrapOptions
} from '..dual-build';

let success: 'success';
success = deleteUserBootstrapOptions();
success = deleteUserBootstrapOptions({console: true});
```

### Bootstrap

Bootstrap a new project

Package Manager:

``` 
Call        binx dual-build bootstrap.ts path_to_project [-p | -o <path_to_options>]  [-v <verbose_level>] [--logger <path_to_logger>] 
            
Returns     1. creates project scaffolding and files
            2. depending on verbose levels and configuration, logs progress
            
Flags       ** all flags are optional **

            -p --prompt: Options are prompted prior to launching.  Mutually exclusive with -o.  

            -o --options: Options are provided in the path_to_options file.  Mutually exclusive with -p.
                        
            -v --verbose: Set verbose level to one of "debug", "info", "warn", or "error".  Default is "info".         
      
            --logger: Specify custom logger.  This option removes the default logger, and will determine entirely 
            where logs appear.  However, the verbose level will still be governed by -v.  Mutually exclusive with -w.
                                         
Errors      error code: 500 subcode: N    generally unable to complete command (reason will depend on subcode)
            error code: 404 subcode: 1    options file does not exist in path specified (-o)
            error code: 400 subcode: 2    options file does not validate
            error code: 403 subcode: 3    not permitted to access / read / write file(s) or director(ies)
            error code: 403 subcode: 4    not permitted to execute file(s)
            error code: 409 subcode: 5    project folder is not empty (only file allowed is bootstrap.ts options file
```

#### Project directory

path_to_project points a directory that bootstrap.ts will create.  ** Intermediate ** directories will not be created.
bootstrap.ts-options.json resolution

#### bootstrap.ts-options.json

1. There are two optional, mutually exclusive command line entries to specify the options. If one of these is set,
   that will be where the options are pulled from.
  1. If -p is provided, options will be created from prompts. See C. prompts, below.
  2. If -o <path_to_options> is provided, that will be used.

2. If neither -p nor -o are specified
  1. If there is a build-dual user profile, the options will be pulled from that (see D, Profile below)
  2. If there is a bootstrap.ts-options.json file in process.cwd() it is used.
  3. If the options will be pulled from node_modules/build-dual/defaults/bootstrap.ts-options.json

#### Prompts

prompts:  When -p is selected prompts drive the bootstrap.ts options. Prompts are preloaded with defaults, as follows.

1. Within prompts, the first question will be whether user wants to load a bootstrap.ts options file. If that is
   affirmative, it will be used (if it exists).
2. If there exists a valid bootstrap.ts-options.json file in process.cwd() then it will be used.
3. If there exists a valid dual-build user profile it will be used.  (see D. Profile below)
4. If build-dual/defaults/bootstrap.ts-options.json will be used as prompt defaults.

At the end of the prompting, the user can save the options to the user profile for use on other projects. Also see
Commands to manage the user profile directly.

#### Profile

Profile: A build-dual profile allows for settings to optionally be re-used from project to project. A profile
can be created through a number of ways including some Commands specific to that. During bootstrapping, if the  
-p option is used, bootstrap.ts-options.json may be optionally saved to the profile, creating it if it did not
already exist. If saving to the profile, it will overwrite and any previois bootstrap.ts-options.json.

#### Scaffolding

The following scaffolding will be created in the base directory targeted by bootstrap.ts

```
base ─┬─ .git/  
      │
      ├─ .gitignore 
      │
      ├─ node_modules/ 
      │
      ├─ package.json (Ref: Top Level package.json)
      │      
      ├─ .dual-build/─┬─ options/─┬─ bootstrap.ts-options.json
      │               │           ├─ ...
      │               │           └─ [command]-options.json 
      │               │
      │               ├─ packages/─┬─ package.base.json 
      │               │            ├─ package.build.json
      │               │            ├─ package.publish.json
      │               │            ├─ package.publish.esm.json
      │               │            ├─ package.publish.commonjs.json
      │               │            └─ package.ide.json
      │               │              
      │               ├─ tsconfigs/─┬─ tsconfig.base.json
      │               │             ├─ tsconfig.buildsource.esm.json
      │               │             ├─ tsconfig.buildsource.commonjs.json
      │               │             ├─ tsconfig.buildtest.esm.json
      │               │             ├─ tsconfig.buildtest.commonjs.json
      │               │             └─ tsconfig.ide.json       
      │               │
      │               └─ logs/─┬─ bootstrap.ts.log (Ref: Project Folder)
      │                        ├─ clean.log
      │                        ├─ ...
      │                        └─ [command].log4 
      │
      ├─ src─┬─ package.json [transient] (Ref: Source Folder)
      │      ├─ tsconfig.json [transient]
      │      ├─ bin-command/─ (Any source we want built and later called from /bin and placed in package.json)
      │      └─ (files hierarchy for all sources, ex: .ts, .js, .cts, .mts, .cjs, .mjs, non-doc .md, non-data .json)     
      │
      ├─ test/─┬─ package.json [transient] (Ref: Test Folder) 
      │        ├─ tsconfig.json [transient]
      │        └─ (test files hierarchy)  
      │
      ├─ buildhooks/─
      │
      ├─ bin/── (bin files)
      │
      ├─ assets/── Reserved for later
      │
      ├─ data/── Reserved for later
      │    
      └─ transient/─┬─ build/─┬─ esm/ [transient]
                    │         └─ commonjs/
                    │
                    ├─ publish/─┬─ package.json
                    │           ├─ esm/─┬─ package.json
                    │           │       ├─ index.cjs
                    │           │       ├─ bin-command/    
                    │           │       └─ (files hierarchy)        
                    │           │ 
                    │           ├─ commonjs/─┬─ package.json
                    │           │            ├─ index.cjs
                    │           │            ├─ bin-command/    
                    │           │            └─ (files hierarchy) 
                    │           └─ bin-impl/─┬─ boostrap
                    │                        ├─ ....
                    │                        └─ (biniaries)
                    │    
                    └─ test/─┬─ package.json
                             ├─ esm/─┬─ package.json
                             │       ├─ index.cjs
                             │       └─ (files hierarchy)        
                             │ 
                             └─ commonjs/─┬─ package.json
                                          ├─ index.cjs
                                          └─ (files hierarchy)   

```

#####


API

```typescript
bootstrap.ts();
bootstrap.ts({});
bootstrap.ts({'logger path': './path/to/my/logger/my-logger.js'});
bootstrap.ts({logger: new MyLogger()});
bootstrap.ts({prompt: true});
bootstrap.ts({'project path': './my-..dual-build'});
bootstrap.ts({'bootstrap.ts-options.json': './my-bootstrap.ts-options.json'});
const bootstrapJSON = loadSomehow(...somhhow);
bootstrap.ts(bootstrapJSON);
```

#### Project scaffolding and files

IMPORTANT IDEA

glob->files newer than build files->build

### Repair Bootstrap

# Delete Configuration Files

# User Configuration Files

TBD

# Binaries

As mentioned earlier, dual-repo commands are set up to have but one to use the syntax

```
[package manager command cli] dual-repo command
```

As per convention all of dual-repo's commands are registered in its package.json "bin" section.

In addition, dual-repo supports the concept of registering custom binaries through the command

```
register binary <pathspec>
```

TBD

### Get bootstrap.ts-options.json

Get a copy of the default bootstrap.ts-options.json, presumably to make changes prior to bootstrapping. As a rule for
dual-build, npx commands can be called with or without the -p option. We show it without.

The p

npm:

``` 
npx dual-build bootstrap.ts-options
```

yarn:

```
yarn dlx dual-build bootstrap.ts-options
```

pnpm:

```
pnpm dlx dual-build bootstrap.ts-options
```

Example output:

``` json
TBD
```

Depending on how bootstrapping is invoked, it will either leverage default, saved or provided
options. Bootstrapping can also combine both in one step, which will create prompts
for the user leveraging saved or default options.


Terms
: **Default options** are within dual-repo itself and provided to the bootstrapping process. They cannot be altered
prior to bootstrapping.
: **Saved options** is on the users machine in the usual conf location saved through prior action by
the user
: **Provided options** is provided explicitly by a path pointing to a JSON file that contains bootstrap.ts options.

Provided options override saved options which override default options. The override is incremental, meaning only those
fields present override the same fields, i.e. implemented by _.merge() in lodash.

If saved options exist, they will be updated with final options for the next project, unless options are explicitly
not to be saved anymore.

# How to use the dual-build

Before explaining how to use the dual-build dual-build, this is a framework that is intended to be transparent.
Walking away from the documentation, a software engineer should feel equally comfortable using the build API as they
would be using the raw tools. If something is not clear on what is happening or how it's happening, please post
that in the project issues. The intent is to automate, not obfuscate, and to allow for the dual-build to be
extended to other use cases.

The dual-build is based on three key concepts:

- **commands** which represent composable, aggregate, multistep capability based on _actions_. Commands are also the
  API into the dual-build.
- **actions** which represent complete units of work
- **tasks** which represent sub-unit functionality that often need to be combined with other tasks to generate
  useful output.

At times, it is very clear what should be commands, actions and tasks, but things sometimes get blurry. If building
any of these, just go with your gut. For instance, is "clean" a command or an action? Maybe it is both, i.e. an
action, so it can be composed into many commands, and a command so that it can be executed as an API.

# Commands

If you have executed the bootstrapping process to create a new project, then you are already familiar with commands.
A command is distinct in that it can be executed with npx or pnpm/yarn dlx.

```
npx dual-build bootstrap.ts -j 
```

A command can take command line arguments or (parameters when accessed via API).


[nodejs]:                 https://www.nodejs.org

[typescript]:             https://www.typescriptlang.org/download

[npm]:                    https://docs.npmjs.com/getting-started

[yarn]:                   https://yarnpkg.com/getting-started/install

[pnpm]:                   https://pnpm.io/installation

[mocha]:                  https://mochajs.org/#installation

[chai]:                   https://www.chaijs.com/

[jest]:                   https://jestjs.io/docs/getting-started

[jasmine]:                https://jasmine.github.io/pages/getting_started.html

[profile location]:      https://github.com/sindresorhus/env-paths#pathsconfig
[Delete configuration]:   #Delete configuration
[Binaries]:               #Binaries
[scaffolding]:            #scaffolding

# Footnotes

[npx commands can be called with or without the -p option]:  #calling-npx-commands-with-or-without-the--p-option

## Calling npx commands with or without the -p option

As mentioned, normally binaries are called by package managers as follows:

```
npx package
```

This is done because it turns out the first binary in the package/bin also bears the package's name. It won't work if
the first binary doesn't have the exact same name.

To overcome this, or to call any binary that is not the first binary command in a package the call must be made as
follows, specifying both the package and command explicitly.

```
npx -p package -c binary
```

In the case of dual-build this would look like

```
npx -p dual-build -c bootstrap.ts
```

However, dual-build is configured with a first binary command named dual-build. Moreover, the dual-build command by
itself is a no-op. It does nothing. In fact, it expects one argument, the actual command to execute. Any
additional arguments are consumed by _that_ command.

Specify package, command and command's argument.

```
npx -p dual-build -c bootstrap.ts -c
```

Specify first command, second command and second command's arguments

```
npx dual-build bootstrap.ts -s -f my-file.json
```

Each of these is equivalent (aside from the arguments).

| scaffold item                      | f/d <sup>1</sup> | git<sup>2</sup> | gitignore<sup>3</sup> | description                                                                                                |
|:-----------------------------------|:----------------:|:---------------:|:---------------------:|:-----------------------------------------------------------------------------------------------------------|
| .git/                              |        d         |       no        |          no           | git file                                                                                                   |
| .gitignore                         |        f         |       yes       |          no           | .gitignore                                                                                                 |
|                                    |                  |                 |                       |                                                                                                            |
| [project/][]                       |                  |                 |                       |                                                                                                            |
| ........[options/][]               |                  |                 |                       |                                                                                                            |
| [.options/][]                      |        d         |       yes       |          no           | options files used by the dual-build, including the bootstrap.ts-options.json file that was used to bootstrap.ts |
|                                    |                  |                 |                       |                                                                                                            |
| package.json                       |        f         |       yes       |          no           | minimal package.json for node_modules                                                                      |
| node_modules/                      |        d         |       no        |          yes          | node_modules                                                                                               |
|                                    |                  |                 |                       |                                                                                                            |
| logs/                              |        d         |       no        |          yes          | logs location for default logger in file mode                                                              | 
|                                    |                  |                 |                       |                                                                                                            |
| [.package.base.json][]             |        f         |       yes       |          no           | package.json settings shared across the project and used by dual-build                                     |
| [.tsconfig.base.json][]            |        f         |       yes       |          no           | tsconfig.json settings shared across the project and used by dual-build                                    |
| [.package.publish.json][]          |        f         |       yes       |          no           | Template for "the" package.json that will be published.                                                    |
| [.package.publish.esm.json][]      |        f         |       yes       |          no           | package.json for publish/esm directory                                                                     |
| [.package.publish.commonjs.json][] |        f         |       yes       |          no           | package.json for <br/>publish/commonjs director                                                            |
|                                    |                  |                 |                       |                                                                                                            |
| sources/                           |        d         |       yes       |          no           | contains all sourcing and source build files                                                               |
| sources/src/                       |        d         |       yes       |          no           | this is the source root for .ts, .mts, .cts, .js, .mjs, .cjs, .json . md etc                               |
| [sources/package.json][]           |        f         |       yes       |          no           | minimal package.json file to assist IDEs with type="module" or type="commonjs"                             |  
| [sources/tsconfig.json][]          |        f         |       yes       |          no           | minimal tsconfig.json file to assist IDEs with typescript "compilerOptions"                                |
| [sources/.tsconfig.esm.json]       |                  |                 |                       |                                                                                                            |
| [sources/.tsconfig.commons.json]   |                  |                 |                       |                                                                                                            |
|                                    |                  |                 |                       |                                                                                                            |
| tests/                             |        d         |       yes       |          no           | contains all test and test build files                                                                     |
| tests/test/                        |                  |                 |                       |                                                                                                            |
| [test/package.json][]              |                  |                 |                       |                                                                                                            |
| [test/tsconfig.json][]             |                  |                 |                       |                                                                                                            |
| [test/.tsconfig.esm.json]          |                  |                 |                       |                                                                                                            |
| [test/.tsconfig.commonjs.json]     |                  |                 |                       |                                                                                                            |
|                                    |                  |                 |                       |                                                                                                            |
| [.build/][]                        |        d         |       no        |          yes          |                                                                                                            |
| [publish][]                        |        d         |       no        |          yes          | final build location and root of npm publish                                                               |
|                                    |                  |                 |                       |                                                                                                            |

<sup>1</sup> file or directory
<sup>2</sup> added to git

