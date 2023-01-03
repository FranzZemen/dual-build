/*
Created by Franz Zemen 01/01/2023
License Type: MIT
*/

import {InitResult, SimpleGit} from 'simple-git';
import {gitOptions} from '../../../options/git-options.js';
import {TransformPayloadOut} from '../../transform-payload-out.js';
import {Transform} from '../../transform.js';
import {SetupGitPipelinePayload} from './setup-git.transform.js';

export type GitInitResult = Partial<InitResult> & {initialized: boolean;}

export class InitGit extends TransformPayloadOut<SetupGitPipelinePayload, GitInitResult> {
  constructor(depth: number) {
    super(depth);
  }
  public transformContext(payload: undefined, override?:SetupGitPipelinePayload): string {
    return '';
  }

  public async executeImpl(payload: undefined, override?: SetupGitPipelinePayload): Promise<GitInitResult> {
    if (override ) {
      if(gitOptions.useGit && gitOptions['git init']) {
        const git: SimpleGit = override.git;
        const result :InitResult= await override.git.init()
        this.log.info(result, 'task-internal');
        return Promise.resolve({initialized: true, ...result});
      } else {
        this.log.warn('git init not configured, skipping');
        return Promise.resolve({initialized: false});
      }
    } else {
      throw new Error('Payload is undefined');
    }
  }
}
