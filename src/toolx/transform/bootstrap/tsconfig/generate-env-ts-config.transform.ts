/*
Created by Franz Zemen 01/10/2023
License Type: 
*/

import {Directory} from 'options/directories.js';
import {TargetOptions} from 'options/tsconfig.options.js';
import {TransformPayload} from 'transform/transform-payload.js';


export type GenerateTsConfigPayload = {
  '.dual-build/tsconfigs': Directory;
  targetOptions: TargetOptions;
}

export class GenerateEnvTsConfigTransform extends TransformPayload<GenerateTsConfigPayload> {
  constructor(depth: number) {
    super(depth);
  }

  public executeImpl(pipeIn: undefined, passedIn: GenerateTsConfigPayload | undefined): Promise<void> {

    return Promise.resolve();
  }

  public transformContext(pipeIn: undefined, passedIn: GenerateTsConfigPayload | undefined): string {
    return ``
  }
}
