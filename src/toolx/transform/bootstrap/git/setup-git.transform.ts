/*
Created by Franz Zemen 12/12/2022
License Type: MI
*/
import {simpleGit, SimpleGit} from 'simple-git';
import {GitOptions} from '../../../options/index.js';
import {Pipeline} from '../../../pipeline/pipeline.js';
import {processUnknownError} from '../../../util/process-unknown-error-message.js';
import {TransformPayload} from '../../transform-payload.js';
import {GitAddOrigin} from './git-add-origin.transform.js';
import {GitInitResult, InitGit} from './init-git.transform.js';


export type SetupGitPipelinePayload = {
  git: SimpleGit,
  gitOptions: GitOptions,
  gitInitResult?: GitInitResult
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
        const result = await Pipeline.options<SetupGitPipelinePayload, SetupGitPipelinePayload>({name: 'git setup', logDepth: self.log.depth + 1})
                                     .startSeries<InitGit, undefined, SetupGitPipelinePayload, void>(InitGit)
                                     .endSeries<GitAddOrigin, undefined>(GitAddOrigin)
                                     .execute(pipelinePayload);
      } catch (err) {
        const error = processUnknownError(err);
        this.log.info('Error processing git setup - not fatal but you will need to setup git yourself', 'error');
        this.log.error(error);
        return;
      }
    } else {
      this.log.warn('git gitOptions not enabled, skipping');
      return;
    }
  }

  public transformContext(payload: undefined, gitOptions?: GitOptions): string {
    return '';
  }
}




