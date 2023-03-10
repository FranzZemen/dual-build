/*
Created by Franz Zemen 03/10/2023
License Type: MIT
*/

import {git} from '../../util/git.js';
import {TransformIndependent} from '../transform-independent.js';

export class PushBranchTransform extends TransformIndependent {
  constructor(depth:number) {super(depth);}
  protected executeImplIndependent(): Promise<void> {
    return git().push().then(result => console.info(result));
  }

  protected transformContext(pipeIn: any, passedIn: undefined): string {
    return 'Push origin [branch]';
  }

}
