/*
Created by Franz Zemen 12/12/2022
License Type: MI
*/
import {simpleGit, SimpleGit} from 'simple-git';
import {GitOptions} from '../../../options/index.js';
import {Pipeline} from '../../../pipeline/pipeline.js';
import {processUnknownError} from '../../../util/process-unknown-error-message.js';
import {TransformPayload} from '../../transform-payload.js';
import {GitInitResult, InitGit} from './init-git.transform.js';


export type SetupGitPipelinePayload = {
  git: SimpleGit,
  gitOptions: GitOptions
}

export class SetupGit extends TransformPayload<GitOptions> {
  constructor(depth: number) {
    super(depth);
  }

  async executeImpl(payload: undefined, gitOptions?: GitOptions): Promise<void> {
    if (gitOptions && gitOptions.useGit && gitOptions['git init']) {
      try {
        const self = this;
        const git: SimpleGit = simpleGit();
        const pipelinePayload: SetupGitPipelinePayload = {
          git,
          gitOptions
        };
        const result = await Pipeline.options<undefined, GitInitResult>({name: 'git setup', logDepth: self.log.depth + 1})
                                     .transform<InitGit, SetupGitPipelinePayload, undefined, GitInitResult>(InitGit, pipelinePayload)
                                     .execute(undefined);
      } catch (err) {
        const error = processUnknownError(err);
        this.log.error(error);
        throw error;
      }
    } else {
      this.log.warn('git gitOptions not enabled, skipping');
      return Promise.resolve();
    }
  }

  public transformContext(payload: undefined, gitOptions?: GitOptions): string {
    return '';
  }
}




