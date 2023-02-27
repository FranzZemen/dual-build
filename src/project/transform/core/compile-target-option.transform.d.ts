import { TsConfig } from 'tsconfig.d.ts';
import { Package, TargetOption } from '../../options/index.js';
import { TransformPayload } from '../transform-payload.js';
export type CompileTargetOptionPayload = {
    targetTsConfig: TsConfig;
    packageJson: Package;
    targetOption: TargetOption;
};
export declare class CompileTargetOptionTransform extends TransformPayload<TargetOption> {
    constructor(depth: number);
    protected executeImplPayload(payload: TargetOption): Promise<void>;
    protected transformContext(pipeIn: undefined, passedIn: TargetOption | undefined): string;
}
