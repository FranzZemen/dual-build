/*
Created by Franz Zemen 03/07/2023
License Type: MIT
*/

import {git} from '../../util/git.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformIndependent} from '../../transform/index.js';

export class CheckInTransform extends TransformIndependent {
  constructor(depth: number) {super(depth);}
  protected executeImplIndependent(): Promise<void> {
    return git().add(['*'])
      .then(result => {
        if(result && result.length > 0) {
          const err = new BuildError(`Unexpected result from git.add: ${result}`, undefined, BuildErrorNumber.GitAddError)
          this.contextLog.error(err);
          throw err;
        }
      })
  }

  protected transformContext(pipeIn: any, passedIn: undefined): string {
    return 'git add';
  }

}
