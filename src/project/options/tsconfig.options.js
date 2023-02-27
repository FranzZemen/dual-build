/*
Created by Franz Zemen 01/14/2023
License Type: MIT
*/
import * as os from 'node:os';
import { ImportsNotUsedAsValues, Module, ModuleDetection, ModuleResolution, NewLine, PollingWatch, Target, WatchDirectory, WatchFile } from 'tsconfig.d.ts';
import { ModuleType } from './package.options.js';
export const defaultBaseCompilerOptions = {
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
export const defaultTargetEnvironmentOptions = {
    // ModuleCompiler Options
    allowUmdGlobalAccess: false,
    module: Module.nodenext,
    moduleResolution: ModuleResolution.nodenext,
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
    sourceMap: false,
    // Project options
    composite: true,
    incremental: true,
    tsBuildInfoFile: '../transient/tsBuildInfo',
    // Output formatting
    noErrorTruncation: true,
    pretty: true
};
export const defaultWatchOptions = {
    watchFile: WatchFile.usefsevents,
    watchDirectory: WatchDirectory.usefsevents,
    fallbackPolling: PollingWatch.fixedinterval,
    synchronousWatchDirectory: false,
    excludeDirectories: ['**/node_modules']
};
export const projectTsConfig = {
    compilerOptions: defaultBaseCompilerOptions,
    watchOptions: defaultWatchOptions,
    references: [
        { 'path': './src/project' },
        { 'path': './src/' }
    ]
};
export function isTargetOptions(target) {
    return target &&
        'options' in target &&
        Array.isArray(target.options) &&
        target.options.length > 0 &&
        'primary esm' in target &&
        'primary commonjs' in target;
}
export const es3 = {
    nickName: 'es3',
    target: Target.es3,
    module: Module.commonjs,
    moduleResolution: ModuleResolution.node,
    packageType: ModuleType.commonjs
};
export const es5 = {
    nickName: 'es5',
    target: Target.es5,
    module: Module.commonjs,
    moduleResolution: ModuleResolution.node,
    packageType: ModuleType.commonjs
};
export const es6 = {
    nickName: 'es6',
    target: Target.es6,
    module: Module.commonjs,
    moduleResolution: ModuleResolution.nodenext,
    packageType: ModuleType.commonjs
};
export const nodenext = {
    nickName: 'nodenext',
    target: Target.esnext,
    module: Module.nodenext,
    moduleResolution: ModuleResolution.nodenext,
    packageType: ModuleType.module // Generate ESM loaded modules, if set to commonjs, stay with commonjs
};
export const esm = {
    nickName: 'esm',
    target: Target.esnext,
    module: Module.esnext,
    moduleResolution: ModuleResolution.node,
    packageType: ModuleType.module
};
export const ideTsConfig = {
    nickName: 'ide',
    target: Target.esnext,
    module: Module.nodenext,
    moduleResolution: ModuleResolution.nodenext,
    packageType: ModuleType.module
};
export const defaultTargetOptions = {
    options: [ideTsConfig, nodenext, es6],
    'primary commonjs': 'es6',
    'primary esm': 'nodenext'
};
