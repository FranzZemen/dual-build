import { InitResult } from 'simple-git';
import { TransformInOut } from '../../transform-in-out.js';
import { SetupGitPipelinePayload } from './setup-git.transform.js';
export type GitInitResult = Partial<InitResult> & {
    initialized: boolean;
};
export declare class InitGit extends TransformInOut<SetupGitPipelinePayload, SetupGitPipelinePayload> {
    constructor(depth: number);
    transformContext(pipeIn: SetupGitPipelinePayload): string;
    executeImplInOut(pipeIn: SetupGitPipelinePayload): Promise<SetupGitPipelinePayload>;
}
