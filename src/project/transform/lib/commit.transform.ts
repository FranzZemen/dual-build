/*
Created by Franz Zemen 03/07/2023
License Type: MIT
*/

import inquirer from 'inquirer';
import {git} from '../../util/git.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';
import {TransformPayload} from '../core/transform-payload.js';


export type CommitPayload = {
  comment: string | undefined;
}

export class CommitTransform extends TransformPayload<CommitPayload> {

  constructor(depdth: number) {super(depdth);}

  protected transformContext(pipeIn: any, passedIn: undefined): string {
    return '';
  }

  protected async executeImplPayload(payload: CommitPayload): Promise<void> {
    let comment = payload?.comment ?? undefined;
    if (!comment) {
      comment = await inquirer
        .prompt([
                  {
                    name: 'comment',
                    message: 'Commit comment',
                    type: 'input',
                    default: ''
                  }
                ])
        .then(answers => {
          return answers['comment'];
        });
    }
    if (comment) {
      return git().commit(comment).then(result => this.contextLog.info(result));
    } else {
      throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
    }
  }

}
