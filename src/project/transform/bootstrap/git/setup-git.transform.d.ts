import { SimpleGit } from 'simple-git';
import { GitOptions } from '../../../options/index.js';
import { TransformPayload } from '../../transform-payload.js';
import { GitInitResult } from './init-git.transform.js';
export type SetupGitPipelinePayload = {
    git: SimpleGit;
    gitOptions: GitOptions;
    gitInitResult?: GitInitResult;
};
export declare class SetupGit extends TransformPayload<GitOptions> {
    constructor(depth: number);
    executeImplPayload(gitOptions?: GitOptions): Promise<void>;
    transformContext(payload: undefined, gitOptions?: GitOptions): string;
}
