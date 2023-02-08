/*
Created by Franz Zemen 01/11/2023
License Type: 
*/


import {writeFile} from 'fs/promises';
import {join} from 'node:path';
import {Directory} from '../../../options/index.js';
import {defaultBaseCompilerOptions} from '../../../options/index.js';
import {TransformPayload} from '../../transform-payload.js';


export type BaseTsConfigTransformPayload = {
  '.dual-build/tsconfigs': Directory
}

export class BaseTsConfigTransform extends TransformPayload<BaseTsConfigTransformPayload> {
  constructor(logDepth: number) {
    super(logDepth);
  }

  public executeImplPayload(passedIn: BaseTsConfigTransformPayload | undefined): Promise<void> {
    if(!passedIn) {
      return Promise.reject(new Error('Undefined Payload'));
    } else {
      const json = JSON.stringify({compilerOptions: defaultBaseCompilerOptions}, null, 2);
      return writeFile(join(passedIn['.dual-build/tsconfigs'].directoryPath, 'tsconfig.base.json'), json, {encoding: 'utf-8'});
    }
  }

  public transformContext(pipedIn: undefined, passedIn: BaseTsConfigTransformPayload | undefined): string {
    return '';
  }
}
