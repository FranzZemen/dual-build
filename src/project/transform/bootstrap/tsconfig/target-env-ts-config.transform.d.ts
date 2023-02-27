import { TargetOption } from '../../../options/index.js';
import { TransformPayload } from '../../transform-payload.js';
export type GenerateTsConfigPayload = {
    path: string;
    targetOption: TargetOption;
};
export declare class TargetEnvTsConfigTransform extends TransformPayload<GenerateTsConfigPayload> {
    constructor(depth: number);
    executeImplPayload(passedIn: GenerateTsConfigPayload | undefined): Promise<void>;
    transformContext(pipeIn: undefined, passedIn: GenerateTsConfigPayload): string;
}
