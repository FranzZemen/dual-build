import { BootstrapOptions } from '../../options/bootstrap.options.js';
import { TransformPayloadIn } from '../transform-payload-in.js';
export declare abstract class BootstrapTransform<PASSED_IN> extends TransformPayloadIn<PASSED_IN, BootstrapOptions> {
    executeImplPayloadIn(pipeIn: BootstrapOptions, passedIn: PASSED_IN): Promise<void>;
    abstract executeBootstrapImpl(bootstrapOptions: BootstrapOptions, passedIn?: PASSED_IN): Promise<void>;
}
