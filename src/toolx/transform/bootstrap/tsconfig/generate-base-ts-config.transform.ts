/*
Created by Franz Zemen 01/11/2023
License Type: 
*/


import {writeFile} from 'fs/promises';
import {join} from 'node:path';
import {Directory} from '../../../options/index.js';
import {defaultBaseCompilerOptions} from '../../../options/tsconfig.options.js';
import {TransformPayload} from '../../transform-payload.js';


export type GenerateBaseTsConfigTransformPayload = {
  '.dual-build/tsconfigs': Directory
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
