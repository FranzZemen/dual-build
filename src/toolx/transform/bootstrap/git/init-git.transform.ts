/*
Created by Franz Zemen 01/01/2023
License Type: MIT
*/

import {InitResult, SimpleGit} from 'simple-git';
import {gitOptions} from '../../../options/git-options.js';
import {TransformInOut} from '../../transform-in-out.js';
import {TransformPayloadOut} from '../../transform-payload-out.js';
import {Transform} from '../../transform.js';
import {SetupGitPipelinePayload} from './setup-git.transform.js';

export type GitInitResult = Partial<InitResult> & {initialized: boolean;}

export class InitGit extends TransformInOut<SetupGitPipelinePayload, SetupGitPipelinePayload> {
  constructor(depth: number) {
    super(depth);
  }
  public transformContext(pipeIn: SetupGitPipelinePayload): string {
    return '';
  }

  public async executeImpl(pipeIn: SetupGitPipelinePayload): Promise<SetupGitPipelinePayload> {
    if (pipeIn ) {
      if(gitOptions.useGit && gitOptions['git init']) {
        const git: SimpleGit = pipeIn.git;
        const result :InitResult= await pipeIn.git.init()
        this.log.info(result, 'task-internal');
        pipeIn.gitInitResult = {initialized: true, ...result}
        return Promise.resolve(pipeIn);
      } else {
        this.log.warn('git init not configured, skipping');
        pipeIn.gitInitResult = {initialized: false}
        return Promise.resolve(pipeIn);
      }
    } else {
      throw new Error('Payload is undefined');
    }
  }
}
