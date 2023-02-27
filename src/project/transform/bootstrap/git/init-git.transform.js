/*
Created by Franz Zemen 01/01/2023
License Type: MIT
*/
import { gitOptions } from '../../../options/index.js';
import { TransformInOut } from '../../transform-in-out.js';
export class InitGit extends TransformInOut {
    constructor(depth) {
        super(depth);
    }
    transformContext(pipeIn) {
        return '';
    }
    async executeImplInOut(pipeIn) {
        if (pipeIn) {
            if (gitOptions.useGit && gitOptions['git init']) {
                const result = await pipeIn.git.init();
                this.log.info(result, 'task-internal');
                pipeIn.gitInitResult = { initialized: true, ...result };
                return Promise.resolve(pipeIn);
            }
            else {
                this.log.warn('git init not configured, skipping');
                pipeIn.gitInitResult = { initialized: false };
                return Promise.resolve(pipeIn);
            }
        }
        else {
            throw new Error('Payload is undefined');
        }
    }
}
