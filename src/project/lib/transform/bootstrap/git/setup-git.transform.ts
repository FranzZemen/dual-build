/*
Created by Franz Zemen 12/12/2022
License Type: MI
*/
import {simpleGit, SimpleGit} from 'simple-git';
import {GitOptions} from '../../../../options/index.js';
import {Pipeline} from '../../../../pipeline/index.js';
import {processUnknownError} from '../../../../util/index.js';
import {TransformPayload} from '../../../../transform/transform-payload.js';
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

  async executeImplPayload(gitOptions?: GitOptions): Promise<void> {
    if (gitOptions && gitOptions.useGit && gitOptions['git init']) {
      try {
        const self = this;
        const git: SimpleGit = simpleGit();
        const pipelinePayload: SetupGitPipelinePayload = {
          git,
          gitOptions
        };
        await Pipeline.options<SetupGitPipelinePayload, SetupGitPipelinePayload>({name: 'git setup', logDepth: self.contextLog.depth + 1})
                      .startSeries<InitGit, undefined, SetupGitPipelinePayload, void>(InitGit)
                      .endSeries<GitAddOrigin, undefined>(GitAddOrigin)
                      .execute(pipelinePayload);
      } catch (err) {
        const error = processUnknownError(err, this.contextLog);
        this.contextLog.info('Error processing git setup - not fatal but you will need to setup git yourself', 'error');
        this.contextLog.error(error);
        return;
      }
    } else {
      this.contextLog.warn('git gitOptions not enabled, skipping');
      return;
    }
  }

  public transformContext(payload: undefined, gitOptions?: GitOptions): string {
    return '';
  }
}




