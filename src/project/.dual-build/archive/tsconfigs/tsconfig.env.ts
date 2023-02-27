/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {TsConfig, CompilerOptions, tsconfigBase} from 'tsconfig.d.ts';

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
