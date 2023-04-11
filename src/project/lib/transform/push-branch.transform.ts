/*
Created by Franz Zemen 03/10/2023
License Type: MIT
*/

import {git} from '../../util/git.js';
import {TransformIndependent} from '../../transform/core/transform-independent.js';

export class PushBranchTransform extends TransformIndependent {
  constructor(depth:number) {super(depth);}
  protected executeImplIndependent(): Promise<void> {
    return git().push().then(result => this.contextLog.info(result));
  }

  protected async transformContext(pipeIn: any, passedIn: undefined): Promise<string> {
    const branchName = await git().currentBranch();
    return `push origin ${branchName}`;
  }

}
