/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/
import { processUnknownError } from '../../../util/index.js';
import { TransformIn } from '../../transform-in.js';
export class GitAddOrigin extends TransformIn {
    constructor(depth) {
        super(depth);
    }
    async executeImplIn(pipeIn) {
        try {
            if (pipeIn.gitInitResult?.initialized) {
                const git = pipeIn.git;
                const repos = typeof pipeIn.gitOptions.repository === 'string' ? pipeIn.gitOptions.repository : pipeIn.gitOptions.repository();
                await git.addRemote('origin', `${pipeIn.gitOptions.protocol}${pipeIn.gitOptions.username}/${repos}`);
            }
            else {
                this.log.warn('git not initialize, skipping');
                return;
            }
        }
        catch (err) {
            throw processUnknownError(err, this.log);
        }
    }
    transformContext(pipeIn) {
        const gitOptions = pipeIn.gitOptions;
        const repos = typeof gitOptions.repository === 'string' ? gitOptions.repository : gitOptions.repository();
        return pipeIn.gitInitResult?.initialized ? `${gitOptions.protocol}${gitOptions.username}/${repos}` : '';
    }
}
