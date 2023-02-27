import { ValidationError } from 'fastest-validator';
import { Directories } from './directories.js';
import { GitOptions } from './git.options.js';
import { Options } from './options.js';
import { BootstrapPackageOptions } from './package.options.js';
import { Sources } from './sources.js';
import { TestStrategy } from './test-strategy-options.js';
import { TargetOptions } from './tsconfig.options.js';
export type InstallModuleLoader = 'install esm' | 'install commonjs' | 'install both';
export type BinSource = 'esm/bin' | 'commonjs/bin';
export type ModuleOptions = {
    buildEsm: boolean;
    buildCommonJS: boolean;
};
export type BootstrapOptions = Options & {
    'save profile': boolean;
    directories: Directories;
    'git options': GitOptions;
    'install module loader': InstallModuleLoader;
    'bin source': BinSource;
    'package options': BootstrapPackageOptions;
    'target options': TargetOptions;
    sources: Sources[];
    'build options': ModuleOptions;
    'test strategy': TestStrategy;
    '.gitignore': string[];
};
export declare const bootstrapOptions: BootstrapOptions;
export declare function validate(options: BootstrapOptions): true | ValidationError[];
