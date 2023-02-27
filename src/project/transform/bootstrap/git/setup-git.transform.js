/*
Created by Franz Zemen 12/12/2022
License Type: MI
*/
import { simpleGit } from 'simple-git';
import { Pipeline } from '../../../pipeline/index.js';
import { processUnknownError } from '../../../util/index.js';
import { TransformPayload } from '../../transform-payload.js';
import { GitAddOrigin } from './git-add-origin.transform.js';
import { InitGit } from './init-git.transform.js';
export class SetupGit extends TransformPayload {
    constructor(depth) {
        super(depth);
    }
    async executeImplPayload(gitOptions) {
        if (gitOptions && gitOptions.useGit && gitOptions['git init']) {
            try {
                const self = this;
                const git = simpleGit();
                const pipelinePayload = {
                    git,
                    gitOptions
                };
                await Pipeline.options({ name: 'git setup', logDepth: self.log.depth + 1 })
                    .startSeries(InitGit)
                    .endSeries(GitAddOrigin)
                    .execute(pipelinePayload);
            }
            catch (err) {
                const error = processUnknownError(err, this.log);
                this.log.info('Error processing git setup - not fatal but you will need to setup git yourself', 'error');
                this.log.error(error);
                return;
            }
        }
        else {
            this.log.warn('git gitOptions not enabled, skipping');
            return;
        }
    }
    transformContext(payload, gitOptions) {
        return '';
    }
}
