import { TransformPayload } from '../transform-payload.js';
import { ContainsTargetOptions } from './distribution-package-json.transform.js';
export declare class CompileTransform extends TransformPayload<ContainsTargetOptions> {
    protected executeImplPayload(containsTargetOptions: ContainsTargetOptions): Promise<void>;
    protected transformContext(pipeIn: undefined, passedIn: ContainsTargetOptions | undefined): string;
}
