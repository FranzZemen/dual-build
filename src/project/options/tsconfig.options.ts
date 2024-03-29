/*
Created by Franz Zemen 01/14/2023
License Type: MIT
*/

import * as os from 'node:os';
import {
  EmitCompilerOptions,
  ImportsNotUsedAsValues,
  InteropConstraintsCompilerOptions,
  JavascriptSupportCompilerOptions,
  LanguageAndEnvironmentCompilerOptions,
  Module,
  ModuleDetection,
  ModuleResolution,
  ModulesCompilerOptions,
  NewLine,
  OutputFormattingCompilerOptions,
  PollingWatch,
  ProjectsCompilerOptions,
  Target,
  TsConfig,
  TypeCheckingCompilerOptions,
  WatchDirectory,
  WatchFile,
  WatchOptions
} from 'tsconfig.d.ts';
import {ModuleType} from './package.options.js';


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
  // noUnusedLocals: true,
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
  preserveValueImports: false,
  newLine: os.platform() === 'win32' ? NewLine.crlf : NewLine.lf
};

export const defaultTargetEnvironmentOptions: TargetEnvironmentCompilerOptions = {

  // ModuleCompiler Options
  allowUmdGlobalAccess: false,
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

export const projectTsConfig: TsConfig = {
  compilerOptions: defaultBaseCompilerOptions,
  watchOptions: defaultWatchOptions,
  references: [
    {'path': './src/project'},
    {'path': './src/'}
  ]
};


export type WellKnownTargetOptions = 'ide' | 'es3' | 'es5' | 'es6' | 'nodenext' | 'esm';

export type TargetOption = {
  nickName: WellKnownTargetOptions | string;
  target: Target; // Determines target ECMAScript
  module: Module; // Helps determine the type of module
  moduleResolution: ModuleResolution; // Helps determine how the module is resolved, as of 01/2023 modern usage is primarily for node features
  packageType: ModuleType; // Determines module loading when target is node, node16, nodenext (if set to commonjs, that's the target, if set to
  // module, becomes ESM
}

export type TargetOptions = {
  options: TargetOption[],
  'primary esm': WellKnownTargetOptions | string | undefined,
  'primary commonjs': WellKnownTargetOptions | string | undefined
}

export function isTargetOptions(target: TargetOptions | any): target is TargetOptions {
  return target &&
    'options' in target &&
    Array.isArray(target.options) &&
    target.options.length > 0 &&
    'primary esm' in target &&
    'primary commonjs' in target;
}

export const es3: TargetOption = {
  nickName: 'es3',
  target: Target.es3,
  module: Module.commonjs,
  moduleResolution: ModuleResolution.node,
  packageType: ModuleType.commonjs
};

export const es5: TargetOption = {
  nickName: 'es5',
  target: Target.es5,
  module: Module.commonjs,
  moduleResolution: ModuleResolution.node,
  packageType: ModuleType.commonjs
};

export const es6: TargetOption = {
  nickName: 'es6',
  target: Target.es6,
  module: Module.commonjs,
  moduleResolution: ModuleResolution.nodenext,
  packageType: ModuleType.commonjs
};

export const nodenext: TargetOption = {
  nickName: 'nodenext',
  target: Target.esnext,
  module: Module.nodenext,
  moduleResolution: ModuleResolution.nodenext,
  packageType: ModuleType.module // Generate ESM loaded modules, if set to commonjs, stay with commonjs
};

export const esm: TargetOption = {
  nickName: 'esm',
  target: Target.esnext,
  module: Module.esnext,
  moduleResolution: ModuleResolution.node,
  packageType: ModuleType.module
};

export const ideTsConfig: TargetOption = {
  nickName: 'ide',
  target: Target.esnext,
  module: Module.nodenext,
  moduleResolution: ModuleResolution.nodenext,
  packageType: ModuleType.module
};

export const defaultTargetOptions: TargetOptions = {
  options: [ideTsConfig, nodenext, es6],
  'primary commonjs': 'es6',
  'primary esm': 'nodenext'
};
