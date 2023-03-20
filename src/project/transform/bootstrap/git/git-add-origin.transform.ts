/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/


import {processUnknownError} from '../../../util/index.js';
import {TransformIn} from '../../transform-in.js';
import {SetupGitPipelinePayload} from './setup-git.transform.js';

export class GitAddOrigin extends TransformIn<SetupGitPipelinePayload> {
  constructor(depth: number) {
    super(depth);
  }
  public async executeImplIn(pipeIn: SetupGitPipelinePayload): Promise<void> {
    try {
      if (pipeIn.gitInitResult?.initialized) {
        const git = pipeIn.git;
        const repos = typeof pipeIn.gitOptions.repository === 'string' ? pipeIn.gitOptions.repository : pipeIn.gitOptions.repository();
        await git.addRemote('origin', `${pipeIn.gitOptions.protocol}${pipeIn.gitOptions.username}/${repos}`);
      } else {
        this.contextLog.warn('git not initialize, skipping');
        return;
      }
    } catch (err) {
      throw processUnknownError(err, this.contextLog);
    }
  }

  public transformContext(pipeIn: SetupGitPipelinePayload): string {
    const gitOptions = pipeIn.gitOptions;
    const repos = typeof gitOptions.repository === 'string' ? gitOptions.repository : gitOptions.repository();
    return pipeIn.gitInitResult?.initialized ? `${gitOptions.protocol}${gitOptions.username}/${repos}`: '';
  }

}
