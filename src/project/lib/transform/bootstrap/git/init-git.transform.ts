/*
Created by Franz Zemen 01/01/2023
License Type: MIT
*/

import {InitResult} from 'simple-git';
import {gitOptions} from '../../../../options/index.js';
import {TransformInOut} from '../../../../transform/core/transform-in-out.js';
import {SetupGitPipelinePayload} from './setup-git.transform.js';

export type GitInitResult = Partial<InitResult> & {initialized: boolean;}

export class InitGit extends TransformInOut<SetupGitPipelinePayload, SetupGitPipelinePayload> {
  constructor(depth: number) {
    super(depth);
  }
  public transformContext(pipeIn: SetupGitPipelinePayload): string {
    return '';
  }

  public async executeImplInOut(pipeIn: SetupGitPipelinePayload): Promise<SetupGitPipelinePayload> {
    if (pipeIn ) {
      if(gitOptions.useGit && gitOptions['git init']) {
        const result :InitResult= await pipeIn.git.init()
        this.contextLog.info(result, 'task-internal');
        pipeIn.gitInitResult = {initialized: true, ...result}
        return Promise.resolve(pipeIn);
      } else {
        this.contextLog.warn('git init not configured, skipping');
        pipeIn.gitInitResult = {initialized: false}
        return Promise.resolve(pipeIn);
      }
    } else {
      throw new Error('Payload is undefined');
    }
  }
}
