/*
Created by Franz Zemen 02/25/2023
License Type: 
*/

import {TsConfig} from 'tsconfig.d.ts'
import {Package, TargetOption} from '../../options/index.js';
import {TransformPayload} from '../core/transform-payload.js';


export type CompileTargetOptionPayload = {
  targetTsConfig: TsConfig;
  packageJson: Package;
  targetOption: TargetOption;
}


export class CompileTargetOptionTransform extends TransformPayload<TargetOption> {
  constructor(depth: number) {super(depth);}

  protected async executeImplPayload(payload: TargetOption): Promise<void> {

  }

  protected transformContext(pipeIn: undefined, passedIn: TargetOption | undefined): string {
    return `compiling target option ${passedIn?.nickName}`;
  }

}
