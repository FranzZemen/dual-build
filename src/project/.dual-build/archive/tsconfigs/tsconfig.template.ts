/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {TsConfig, CompilerOptions, ModuleResolution, Module, Target, tsconfigBase} from 'tsconfig.d.ts';
import {JSONTemplateReplacement} from '../../../util/template-replacement.js';

export type EnvCompilerOptionProperties =
  'target'
  | 'module'
  | 'moduleResolution'
  | 'outDir'
  | 'rootDir'
  | 'rootDirs'
  | 'composite'
  | 'tsBuildInfoFile';


export type EnvTsConfigProperties = 'include' | 'exclude' | 'references';

export type EnvCompilerOptions = Pick<CompilerOptions, EnvCompilerOptionProperties>;

export type EnvTsConfig = Pick<Omit<TsConfig, 'compilerOptions'>, EnvTsConfigProperties> & {
  compilerOptions: EnvCompilerOptions
}


export function mergeTSConfig(envTSConfig: EnvTsConfig): TsConfig {
  return {...tsconfigBase, ...envTSConfig};
}


/*
export type CompilerOptionsOmitted = Omit<CompilerOptions, CompileOptionTemplateNames>;

class CompilerOptionJSONReplacement extends JSONTemplateReplacement<CompileOptionTemplateNames> {
  constructor(key: CompileOptionTemplateNames) {
    super(key);
  }
}

export type CompilerOptionsTemplate = CompilerOptionsOmitted & {
  moduleResolution?:  moduleResolution  | CompilerOptionJSONReplacement | undefined;
  module?:            Module            | CompilerOptionJSONReplacement | undefined;
  target?:            Target            | CompilerOptionJSONReplacement | undefined;
  outDir?:            string            | CompilerOptionJSONReplacement | undefined;
}

export type TSConfigTemplate = Omit<TsConfig, 'compilerOptions'> & {
  compilerOptions: CompilerOptionsTemplate;
}

const module            = new CompilerOptionJSONReplacement('module');
const moduleResolution  = new CompilerOptionJSONReplacement('moduleResolution');
const target            = new CompilerOptionJSONReplacement('target');
const outDir            = new CompilerOptionJSONReplacement('outDir');

const tsConfigTemplateOnly: TSConfigTemplate = {
  compilerOptions: {
    module,
    moduleResolution,
    target,
    outDir
  }
}*/
