/*
Created by Franz Zemen 01/10/2023
License Type: 
*/

import {
  EmitCompilerOptions,
  InteropConstraintsCompilerOptions,
  JavascriptSupportCompilerOptions,
  LanguageAndEnvironmentCompilerOptions,
  ModulesCompilerOptions,
  PollingWatch,
  TypeCheckingCompilerOptions,
  WatchDirectory,
  WatchFile,
  WatchOptions
} from 'tsconfig.d.ts';
import {ImportsNotUsedAsValues, Module, ModuleDetection, ModuleResolution, Target} from 'tsconfig.d.ts/tsconfig.js';
import {Directory} from '../../../options/index.js';
import {TransformPayload} from '../../transform-payload.js';

export type TargetEnvironmentCompilerOptions =
  ModulesCompilerOptions
  & LanguageAndEnvironmentCompilerOptions;





export const defaultTargetEnvironmentOptions: TargetEnvironmentCompilerOptions = {
  // ModuleCompiler Options

  allowUmdGlobalAccess: false,
  baseUrl: './',
  module: Module.nodenext,
  moduleResolution: ModuleResolution.nodenext,
  noResolve: false,
  resolveJsonModule: true,

  // LanguageAndEnvironmentCompilerOptions

  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  moduleDetection: ModuleDetection.auto,
  target: Target.esnext,
  useDefineForClassFields: false
};

export type  EnvSpecificEmitOptions =
  'outDir'
  | 'outFile'
  | 'declarationDir'
  | 'removeComments'
  | 'declaration'
  | 'declarationMap'
  | 'inlineSourceMap'
  | 'inlineSources'
  | 'sourceMap';

export const defaultEmitCompilerOptions: Omit<EmitCompilerOptions, EnvSpecificEmitOptions> = {
  emitDeclarationOnly: false,
  downlevelIteration: true,
  emitBOM: false,
  importHelpers: true,
  importsNotUsedAsValues: ImportsNotUsedAsValues.remove,
  noEmit: false,
  noEmitOnError: false,
  preserveConstEnums: false,
  preserveValueImports: false
};

export type EnvOptions = Pick<EmitCompilerOptions, EnvSpecificEmitOptions>


export const defaultWatchOptions: WatchOptions = {
  watchFile: WatchFile.usefsevents,
  watchDirectory: WatchDirectory.usefsevents,
  fallbackPolling: PollingWatch.fixedinterval,
  synchronousWatchDirectory: false,
  excludeDirectories: ['**/node_modules']
};


export type GenerateTsConfigPayload = {
  '.dual-build/tsconfigs': Directory;
  target: Target,
  module: Module,
  moduleResolution: ModuleResolution
}

export class GenerateEnvTsConfigTransform extends TransformPayload<GenerateTsConfigPayload> {
  constructor(depth: number) {
    super(depth);
  }

  public executeImpl(pipeIn: undefined, passedIn: GenerateTsConfigPayload | undefined): Promise<void> {

    return Promise.resolve();
  }

  public transformContext(pipeIn: undefined, passedIn: GenerateTsConfigPayload | undefined): string {
    return `target: ${passedIn?.target} module: ${passedIn?.module} moduleResolution ${passedIn?.moduleResolution}`
  }
}
