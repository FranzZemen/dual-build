import { TargetOptions } from '../../options/index.js';
import { TransformPayloadIn } from '../transform-payload-in.js';
export type ContainsTargetOptions = {
    targetOptions: TargetOptions | undefined;
} | undefined;
export declare class DistributionPackageJsonTransform extends TransformPayloadIn<ContainsTargetOptions | undefined, ContainsTargetOptions | any> {
    constructor(depth: number);
    protected executeImplPayloadIn(pipeIn: ContainsTargetOptions | any, passedIn: ContainsTargetOptions | undefined): Promise<void>;
    protected transformContext(pipeIn: ContainsTargetOptions | undefined, passedIn: ContainsTargetOptions | undefined): string;
}
