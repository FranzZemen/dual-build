import { TransformIn } from '../../transform-in.js';
import { SetupGitPipelinePayload } from './setup-git.transform.js';
export declare class GitAddOrigin extends TransformIn<SetupGitPipelinePayload> {
    constructor(depth: number);
    executeImplIn(pipeIn: SetupGitPipelinePayload): Promise<void>;
    transformContext(pipeIn: SetupGitPipelinePayload): string;
}
