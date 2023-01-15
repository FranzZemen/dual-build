import {AsyncCheckFunction, SyncCheckFunction, ValidationError, ValidationSchema} from 'fastest-validator';
import pkg from '../util/validator.cjs';
const getValidator = pkg.getValidator;
import {Directories, directories, directoriesWrappedSchema} from './directories.js';
import {gitignore, gitOptions, GitOptions} from './git.options.js';
import {Options} from './options.js';
import {packageOptions, PackageOptions} from './package.options.js';
import {Sources, sources} from './sources.js';
import {es6, nodenext, TargetOptions} from './tsconfig.options.js';


export type InstallModuleLoader = 'install esm' | 'install commonjs' | 'install both';

export type BinSource = 'esm/bin' | 'commonjs/bin';

export type BuildOptions = {
  buildEsm: boolean;
  buildCommonJS: boolean
}

export type BootstrapOptions = Options & {
  'save profile': boolean;
  directories: Directories;
  'git options': GitOptions;
  'install module loader': InstallModuleLoader;
  'bin source': BinSource;
  'package options': PackageOptions;
  'target options': TargetOptions;
  sources: Sources[];
  'build options': BuildOptions;
  '.gitignore': string[];
}

export const bootstrapOptions: BootstrapOptions = {
  filename: 'bootstrap-options.json',
  // modified: undefined,  Case by case
  'save profile': true,
  'git options': gitOptions,
  'install module loader': 'install both',
  'bin source': 'esm/bin',
  'package options': packageOptions,
  'target options': {
    'primary commonjs': 'es6',
    'primary esm': 'nodenext',
    options: [es6, nodenext]
  },
  directories,
  sources,
  'build options': {buildEsm: true, buildCommonJS: true},
  '.gitignore': gitignore,
}

const bootstrapSchema: ValidationSchema = {
  directories: directoriesWrappedSchema
}

const bootstrapWrappedSchema: ValidationSchema = {
  $$strict: false,
  type: 'object',
  props: {
    filename: {type: 'string'}
  }
}


const compiled: SyncCheckFunction | AsyncCheckFunction =  (getValidator()).compile(bootstrapSchema);
let check: SyncCheckFunction;
if(compiled.async) {
  console.error('Unreachable Code');
} else {
  check = compiled; //!compiled.async ? compiled : (()=>{if(compiled.async) {throw new Error('Unexpected AsyncCheckFunction')} else { return undefined;}})();
}

export function validate(options: BootstrapOptions): true | ValidationError[] {
  return check(options);
}
