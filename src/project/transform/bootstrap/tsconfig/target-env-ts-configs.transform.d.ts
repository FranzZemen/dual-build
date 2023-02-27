import { TargetOptions } from '../../../options/index.js';
import { TransformPayload } from '../../transform-payload.js';
export type GenerateTsConfigsPayload = {
    path: string;
    targetOptions: TargetOptions;
};
export declare class TargetEnvTsConfigsTransform extends TransformPayload<GenerateTsConfigsPayload> {
    constructor(depth: number);
    executeImplPayload(passedIn: GenerateTsConfigsPayload | undefined): Promise<void>;
    transformContext(pipeIn: undefined, passedIn: GenerateTsConfigsPayload | undefined): string;
}
