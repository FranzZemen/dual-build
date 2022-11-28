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

dual-build has been deployed in such a way that we don't need the -p and -c command line options.  This is because
the binary dual-build:

```
binx dual-bin  
```

Does nothing. In fact, if used on its own it will output "Missing Command".  It actually expects an argument,
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

<sup>a</sup> The only contents of the empty directory is an optional valid bootstrap-options.json file with that 
exact name.

This documentation will fully explain what bootstrapping is doing, how the scaffolding works, what each file's 
purpose and structure is.

## Bootstrapping commands and utilities

Conventions are used throughout.  Documentation will only cover what's unique or an exception from conventions.

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


### Get bootstrap-options.json from defaults

Get a copy of the default bootstrap-options.json, presumably to make changes prior to bootstrapping.  As a rule for
dual-build [npx commands can be called with or without the -p option][].  We show it without.

From Package Manager:

``` 
Call        binx dual-build defaut-bootstrap-options <-c> <-f> 
            binx dual-build defaut-bootstrap-options -c         
            binx dual-build defaut-bootstrap-options -f
            binx dual-build defaut-bootstrap-options -s <filename> 
            binx dual-build defaut-bootstrap-options -s <filename> -f
                    
Returns     bootstrap options

Flags       None:         saves to file bootstrap-options.json in process.cwd() 
            -c --console: Print to console
            -s --save:    save to a provided file <filename> relative to process.cwd()
            -f --force:   force save to a file  
                         
Errors      1. file already exists and -f not set
            2. combination of -c and -s
```

From code: 

```typescript
import {BootstrapOptions, 
        defaultBootstrapOptions} from 'dual-build';

let options:BootstrapOptions;
options = await defaultBootstrapOptions();
options = await defaultBootstrapOptions({console: true});
options = await defaultBootstrapOptions({path: 'bootstrap-options.json'});
options = await defaultBootstrapOptions({path: 'bootstrap-options.json', force:true});
```

### Get bootstrap-options.json from user configuration
Get a copy of the bootstrap-options saved in the [user configuration][].  Note that capability to save to the user 
configuration is not provided.  It will be re-saved if bootstrap-options.json are set to save to configuration, 
after a successful bootstrapping.

Package Manager:

``` 
Call        binx dual-build user-bootstrap-options [-c] [-s <path_to_file>] [-f] 
            
Returns     bootstrap options

Default     Saves to file bootstrap-options.json in process.cwd().  Use -f to force overwrite.
                        
Errors      1. file already exists and -f not set
            2. combination of -c and -s
            
Notes:      -cf has no effect and will be treated as -c        

Flags       None:         saves to file bootstrap-options.json in process.cwd() 
            -c --console: Print to console
            -s --save:    save to a provided file <filename> relative to process.cwd()
            -f --force:   force save to a file  
                         
Errors      1. file already exists and -f not set
            2. combination of -c and -s
```

API

```typescript
import {BootstrapOptions, 
        userBootstrapOptions} from 'dual-build';


let options:BootstrapOptions;
options = await userBootstrapOptions();
options = await userBootstrapOptions({console: true});
options = await userBootstrapOptions({path: 'bootstrap-options.json'});
options = await userBootstrapOptions({path: 'bootstrap-options.json', force:true});
```

### Delete bootstrap-options from user configuration
Delete the boostrap-options from user configuration.  Note - this does not delete the overall user configuration file.
See [Delete configuration][]  for that.

```
Call:       binx dual-build delete-user-bootstrap-options
            binx dual-build delete-user-bootstrap-options -c

Returns:    void

Flags       None:         quietly deletes
            -c --console: prints 'success' on complettion
                         
Errors      n/a
```


```typescript
import {BootstrapOptions, 
        deleteUserBootstrapOptions} from 'dual-build';

let success: 'success';
success = deleteUserBootstrapOptions();
success = deleteUserBootstrapOptions({console: true});
```

### Bootstrap
Bootstrap a new project

Package Manager:

``` 
Call        binx dual-build bootstrap 
            binx dual-build bootstrap -rf
            binx dual-build user-bootstrap-options -c          
            binx dual-build user-bootstrap-options -f <filename>
            binx dual-build user-bootstrap-options -f <filename> -o
            
Returns     bootstrap options

Parameters  n/a:  saves to file bootstrap-options.json in process.cwd() 
            -f:   save to a provided file <filename> relative to process.cwd()
            -o:   overwrite if file exists
            -c:   stream options to console
            
Errors      file already exists and -o not set
```

API

```typescript
import {BootstrapOptions, 
        getUserBootstrapOptions,
        streamUserBootstrapOptions,
        writeUserBootstrapOptions} from 'dual-build';

const options:BootstrapOptions  = getUserBootstrapOptions();
consoleUserBootstrapOptions();
writeUserBootstrapOptions();
writeUserBootstrapOptions({force:true});
writeUserBootstrapOptions('bootstrap-options.json');
writeUserBootstrapOptions('bootstrap-options.json', {force: true});
```






# Delete Configuration Files

# User Configuration Files

TBD

# Binaries

As mentioned earlier, dual-repo commands are  set up to have but one to use the syntax

```
[package manager command cli] dual-repo command
```

As per convention all of dual-repo's commands are registered in its package.json "bin" section.  

In addition, dual-repo supports the concept of registering custom binaries through the command 

```
register binary <pathspec>
```

TBD


### Get bootstrap-options.json

Get a copy of the default bootstrap-options.json, presumably to make changes prior to bootstrapping.  As a rule for 
dual-build, npx commands can be called with or without the -p option.  We show it without.

The p


npm:
``` 
npx dual-build bootstrap-options
```

yarn:
```
yarn dlx dual-build bootstrap-options
```

pnpm:
```
pnpm dlx dual-build bootstrap-options
```

Example output:
``` json
TBD
```



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








# How to use the build system

Before explaining how to use the dual-build build system, this is a framework that is intended to be transparent. 
Walking away from the documentation, a software engineer should feel equally comfortable using the build API as they 
would be using the raw tools.  If something is not clear on what is happening or how it's happening, please post 
that in the project issues.  The intent is to automate, not obfuscate, and to allow for the build system to be 
extended to other use cases.

The build system is based on three key concepts:

- **commands** which represent composable, aggregate, multistep capability based on _actions_. Commands are also the 
  API into the build system. 
- **actions** which represent complete units of work
- **tasks** which represent sub-unit functionality that often need to be combined with other tasks to generate 
  useful output.

At times, it is very clear what should be commands, actions and tasks, but things sometimes get blurry.  If building 
any of these, just go with your gut.  For instance, is "clean" a command or an action?  Maybe it is both, i.e. an 
action, so it can be composed into many commands, and a command so that it can be executed as an API.

# Commands

If you have executed the bootstrapping process to create a new project, then you are already familiar with commands. 
A command is distinct in that it can be executed with npx or pnpm/yarn dlx.

```
npx dual-build bootstrap
```

A command can take arguments (also known as parameters)



[nodejs]:                 https://www.nodejs.org
[typescript]:             https://www.typescriptlang.org/download
[npm]:                    https://docs.npmjs.com/getting-started
[yarn]:                   https://yarnpkg.com/getting-started/install
[pnpm]:                   https://pnpm.io/installation
[mocha]:                  https://mochajs.org/#installation
[chai]:                   https://www.chaijs.com/
[jest]:                   https://jestjs.io/docs/getting-started
[jasmine]:                https://jasmine.github.io/pages/getting_started.html
[user configuration]      https://github.com/sindresorhus/env-paths#pathsconfig
[Delete configuration]:   #Delete configuration
[Binaries]:               #Binaries
[scaffolding]:            #scaffolding


# Footnotes
 
[npx commands can be called with or without the -p option]:  #calling-npx-commands-with-or-without-the-p-option
## Calling npx commands with or without the -p option
