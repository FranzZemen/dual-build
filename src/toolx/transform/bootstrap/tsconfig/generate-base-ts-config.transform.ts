/*
Created by Franz Zemen 01/11/2023
License Type: 
*/


import {writeFile} from 'fs/promises';
import {join} from 'node:path';
import {InteropConstraintsCompilerOptions, JavascriptSupportCompilerOptions, TypeCheckingCompilerOptions} from 'tsconfig.d.ts';
import {Directory} from '../../../options/index.js';
import {TransformPayload} from '../../transform-payload.js';


export type BaseCompilerOptions =
  TypeCheckingCompilerOptions
  & JavascriptSupportCompilerOptions
  & InteropConstraintsCompilerOptions;


const defaultBaseCompilerOptions: BaseCompilerOptions = {
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
  preserveSymlinks: true
};

export type GenerateBaseTsConfigTransformPayload = {
  '.dual-build/tsconfigs': Directory;
}

export class GenerateBaseTsConfigTransform extends TransformPayload<GenerateBaseTsConfigTransformPayload> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  public executeImpl(pipeIn: undefined, passedIn: GenerateBaseTsConfigTransformPayload | undefined): Promise<void> {
    if(!passedIn) {
      return Promise.reject(new Error('Undefined Payload'));
    } else {
      const json = JSON.stringify({compilerOptions: defaultBaseCompilerOptions}, null, 2);
      return writeFile(join(passedIn['.dual-build/tsconfigs'].directoryPath, 'tsconfig.base.json'), json, {encoding: 'utf-8'});
    }
  }

  public transformContext(pipedIn: undefined, passedIn: GenerateBaseTsConfigTransformPayload | undefined): string {
    return '';
  }
}
