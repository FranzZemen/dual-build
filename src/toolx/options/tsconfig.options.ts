/*
Created by Franz Zemen 01/14/2023
License Type: MIT
*/

import {
  EmitCompilerOptions, ImportsNotUsedAsValues,
  InteropConstraintsCompilerOptions,
  JavascriptSupportCompilerOptions,
  LanguageAndEnvironmentCompilerOptions,
  Module, ModuleDetection,
  ModuleResolution,
  ModulesCompilerOptions,
  OutputFormattingCompilerOptions, PollingWatch,
  ProjectsCompilerOptions,
  Target,
  TypeCheckingCompilerOptions, WatchDirectory, WatchFile,
  WatchOptions
} from 'tsconfig.d.ts';


export type  EnvSpecificEmitOptionKeys =
  'outDir'
  | 'outFile'
  | 'declarationDir'
  | 'removeComments'
  | 'declaration'
  | 'declarationMap'
  | 'inlineSourceMap'
  | 'inlineSources'
  | 'sourceMap';


export type  NonEnvEmitOptions = Omit<EmitCompilerOptions, EnvSpecificEmitOptionKeys>;

export type EnvEmitOptions = Pick<EmitCompilerOptions, EnvSpecificEmitOptionKeys>

export type BaseCompilerOptions =
  TypeCheckingCompilerOptions
  & JavascriptSupportCompilerOptions
  & InteropConstraintsCompilerOptions
  & NonEnvEmitOptions;

export type TargetEnvironmentCompilerOptions =
  ModulesCompilerOptions
  & LanguageAndEnvironmentCompilerOptions
  & ProjectsCompilerOptions
  & EnvEmitOptions
  & OutputFormattingCompilerOptions;


export const defaultBaseCompilerOptions: BaseCompilerOptions = {
  // TypeCheckingCompilerOptions
  allowUnreachableCode: false,
  allowUnusedLabels: false,
  alwaysStrict: false,
  exactOptionalPropertyTypes: true,
  noFallthroughCasesInSwitch: true,
  noImplicitAny: true,
  noImplicitOverride: true,
  noImplicitReturns: true,
  noImplicitThis: true,
  noPropertyAccessFromIndexSignature: true,
  noUncheckedIndexedAccess: true,
  noUnusedLocals: true,
  noUnusedParameters: false,
  strict: true,
  strictBindCallApply: true,
  strictFunctionTypes: true,
  strictNullChecks: true,
  strictPropertyInitialization: true,
  useUnknownInCatchVariables: true,

  // JavascriptSupportCompilerOptions

  allowJs: true,
  checkJs: true,
  maxNodeModuleJsDepth: 0,

  // InteropConstraintsCompilerOptions

  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  forceConsistentCasingInFileNames: true,
  isolatedModules: false,
  preserveSymlinks: true,

  // Non Env specific emit options

  emitDeclarationOnly: false,
  downlevelIteration: true,
  emitBOM: false,
  importHelpers: true,
  importsNotUsedAsValues: ImportsNotUsedAsValues.remove,
  noEmit: false,
  noEmitHelpers: false,
  noEmitOnError: false,
  preserveConstEnums: false,
  preserveValueImports:false
};

export const defaultTargetEnvironmentOptions: TargetEnvironmentCompilerOptions = {

  // ModuleCompiler Options
  allowUmdGlobalAccess: false,
  baseUrl: './',
  module: Module.nodenext,  // Will be overwritten
  moduleResolution: ModuleResolution.nodenext, // Will be overwritten
  noResolve: false,
  resolveJsonModule: true,

  // LanguageAndEnvironmentCompilerOptions
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  moduleDetection: ModuleDetection.auto,
  target: Target.esnext,
  useDefineForClassFields: false,

  // Emit Options
  declaration: true,
  declarationDir: '../transient/types',
  declarationMap: true,
  inlineSourceMap: true,
  inlineSources: true,
  outDir: '../transient/out',
  removeComments: false,
  sourceMap: false, // Using inlineSourceMap

  // Project options
  composite: true,
  incremental: true,
  tsBuildInfoFile: '../transient/tsBuildInfo',

  // Output formatting
  noErrorTruncation: true,
  pretty: true
};


export const defaultWatchOptions: WatchOptions = {
  watchFile: WatchFile.usefsevents,
  watchDirectory: WatchDirectory.usefsevents,
  fallbackPolling: PollingWatch.fixedinterval,
  synchronousWatchDirectory: false,
  excludeDirectories: ['**/node_modules']
};


export type TargetOption = {
  nickName: string;
  target: Target;
  module: Module;
  moduleResolution: ModuleResolution;
}

export type TargetOptions = {
  options: TargetOption[],
  'primary esm': string | undefined,
  'primary commonjs': string | undefined
}

export const es3: TargetOption = {
  nickName: 'es3',
  target: Target.es3,
  module: Module.commonjs,
  moduleResolution: ModuleResolution.node
};

export const es5: TargetOption = {
  nickName: 'es5',
  target: Target.es5,
  module: Module.commonjs,
  moduleResolution: ModuleResolution.node
};

export const es6: TargetOption = {
  nickName: 'es6',
  target: Target.es6,
  module: Module.commonjs,
  moduleResolution: ModuleResolution.nodenext
};

export const nodenext: TargetOption = {
  nickName: 'nodenext',
  target: Target.esnext,
  module: Module.nodenext,
  moduleResolution: ModuleResolution.nodenext
};

export const esm: TargetOption = {
  nickName: 'esm',
  target: Target.esnext,
  module: Module.esnext,
  moduleResolution: ModuleResolution.node
};
