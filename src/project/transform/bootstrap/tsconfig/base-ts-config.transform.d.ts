import { Directory } from '../../../options/index.js';
import { TransformPayload } from '../../transform-payload.js';
export type BaseTsConfigTransformPayload = {
    '.dual-build/tsconfigs': Directory;
};
export declare class BaseTsConfigTransform extends TransformPayload<BaseTsConfigTransformPayload> {
    constructor(logDepth: number);
    executeImplPayload(passedIn: BaseTsConfigTransformPayload | undefined): Promise<void>;
    transformContext(pipedIn: undefined, passedIn: BaseTsConfigTransformPayload | undefined): string;
}
